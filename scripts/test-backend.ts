import dotenv from 'dotenv';
dotenv.config();

import prisma from '../server/lib/prisma';
import { AuthService } from '../server/services/AuthService';
import { BeneficiaryService } from '../server/services/BeneficiaryService';
import { ProgramService } from '../server/services/ProgramService';
import { GADPlanService } from '../server/services/GADPlanService';
import { AccomplishmentService } from '../server/services/AccomplishmentService';
import { DashboardService } from '../server/services/DashboardService';
import { UserService } from '../server/services/UserService';
import { sanitizePII } from '../server/middleware/piiSanitizer';
import { Role, GADPlanStatus } from '@prisma/client';

async function runIntegrationTests() {
  console.log('====================================================');
  console.log(' TAGAD SPRINT 2 BACKEND INTEGRATION TEST SUITE');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`  [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`  [FAIL] ${testName}`);
      failed++;
    }
  }

  try {
    // 1. Authenticate ADMIN and ENCODER
    console.log('>> 1. TESTING AUTHENTICATION & TOKEN ISSUANCE');
    const adminLogin = await AuthService.login('admin@talibon.gov.ph', 'Password123!');
    assert(!!adminLogin.accessToken && adminLogin.user.role === Role.ADMIN, 'Admin login returns valid JWT and role');

    const encoderLogin = await AuthService.login('mswdo@talibon.gov.ph', 'Password123!');
    assert(!!encoderLogin.accessToken && encoderLogin.user.role === Role.ENCODER, 'Encoder login returns valid JWT and role');

    const meProfile = await AuthService.getMe(adminLogin.user.id);
    assert(meProfile.email === 'admin@talibon.gov.ph', 'AuthService.getMe returns correct profile');

    const refreshed = await AuthService.refreshToken(adminLogin.refreshToken);
    assert(!!refreshed.accessToken, 'AuthService.refreshToken issues fresh access token');

    let badAuthFailed = false;
    try {
      await AuthService.login('admin@talibon.gov.ph', 'WrongPassword!');
    } catch (e: any) {
      badAuthFailed = e.code === 'INVALID_CREDENTIALS';
    }
    assert(badAuthFailed, 'AuthService rejects invalid credentials with INVALID_CREDENTIALS');

    // 2. Public API PII Safety Tests
    console.log('\n>> 2. TESTING PUBLIC API & ZERO-PII SAFETY');
    const publicDash = await DashboardService.getPublicDashboardStats(2026);
    assert(typeof publicDash.summary.totalBeneficiaries === 'number', 'Public dashboard returns numeric summary');

    const rawBeneficiary = {
      firstName: 'Juanita',
      lastName: 'Dela Cruz',
      contactNumber: '09123456789',
      addressStreet: 'Poblacion Street 1',
      passwordHash: 'secret_hash',
      sector: 'Senior Citizen',
      age: 68,
      sex: 'FEMALE',
    };
    const sanitized = sanitizePII(rawBeneficiary);
    assert(
      !sanitized.firstName &&
      !sanitized.lastName &&
      !sanitized.contactNumber &&
      !sanitized.addressStreet &&
      !sanitized.passwordHash &&
      sanitized.sector === 'Senior Citizen',
      'PII Sanitizer deeply strips personal names, contact, street address, and secrets'
    );

    const publicDemographics = await BeneficiaryService.getDemographicsAggregates({ year: 2026 });
    assert(Array.isArray(publicDemographics.byBarangay) && Array.isArray(publicDemographics.bySector), 'Public demographics returns aggregated arrays only');

    // 3. Office Isolation & Scoping
    console.log('\n>> 3. TESTING OFFICE ISOLATION & RBAC SCOPING');
    const mswdoOffice = await prisma.office.findFirst({ where: { code: 'MSWDO' } });
    const maoOffice = await prisma.office.findFirst({ where: { code: 'MAO' } });
    const testBrgy = await prisma.barangay.findFirst();

    assert(!!mswdoOffice && !!maoOffice && !!testBrgy, 'Reference Offices and Barangays exist in canonical DB');

    // Encoders can create within their office
    const createdBen = await BeneficiaryService.createBeneficiary(
      {
        firstName: 'Maria',
        lastName: 'Santos',
        sex: 'FEMALE',
        age: 34,
        sector: 'Solo Parents',
        barangayId: testBrgy!.id,
      },
      { id: encoderLogin.user.id, role: Role.ENCODER, officeId: mswdoOffice!.id }
    );
    assert(createdBen.officeId === mswdoOffice!.id, 'Encoder creating beneficiary is automatically scoped to own office');

    // Encoder trying to update another office's program
    const maoProgram = await ProgramService.createProgram(
      {
        title: 'Agricultural Women Farmers Grant',
        fiscalYear: 2026,
        officeId: maoOffice!.id,
        sector: 'Agriculture & Livelihood',
        budgetTarget: 500000,
      },
      { id: adminLogin.user.id, role: Role.ADMIN, officeId: null }
    );

    let crossOfficeBlocked = false;
    try {
      await ProgramService.updateProgram(
        maoProgram.id,
        { title: 'Attempted Hijack' },
        { id: encoderLogin.user.id, role: Role.ENCODER, officeId: mswdoOffice!.id }
      );
    } catch (e: any) {
      crossOfficeBlocked = e.code === 'OFFICE_SCOPE_MISMATCH';
    }
    assert(crossOfficeBlocked, 'ENCODER cannot modify program of another office (OFFICE_SCOPE_MISMATCH enforced)');

    // Admin can update any office's program
    const adminUpdatedProg = await ProgramService.updateProgram(
      maoProgram.id,
      { budgetTarget: 550000 },
      { id: adminLogin.user.id, role: Role.ADMIN, officeId: null }
    );
    assert(adminUpdatedProg.budgetTarget === 550000, 'ADMIN has full cross-office authority to update program');

    // 4. GAD Plan Status Workflow
    console.log('\n>> 4. TESTING GAD PLAN WORKFLOW & ROLE RESTRICTIONS');
    const newPlanItem = await GADPlanService.createGADPlan(
      {
        fiscalYear: 2026,
        officeId: mswdoOffice!.id,
        activity: 'Women Leadership Capacity Workshop',
        genderIssue: 'Low representation in community councils',
        gadResult: 'Empowered women barangay leaders',
        performanceIndicator: '50 women trained',
        targetGroup: 'Barangay Women Leaders',
        timeline: 'Q2 2026',
        responsibleOffice: 'MSWDO',
        budget: 75000,
      },
      { id: encoderLogin.user.id, role: Role.ENCODER, officeId: mswdoOffice!.id }
    );
    assert(newPlanItem.budget === 75000, 'GAD Plan line item created successfully');

    let encoderApproveBlocked = false;
    try {
      await GADPlanService.updatePlanStatus(
        newPlanItem.planId,
        GADPlanStatus.APPROVED,
        { id: encoderLogin.user.id, role: Role.ENCODER, officeId: mswdoOffice!.id }
      );
    } catch (e: any) {
      encoderApproveBlocked = e.code === 'FORBIDDEN';
    }
    assert(encoderApproveBlocked, 'ENCODER is forbidden from approving GAD Plans (Only ADMIN can approve)');

    const approvedPlan = await GADPlanService.updatePlanStatus(
      newPlanItem.planId,
      GADPlanStatus.APPROVED,
      { id: adminLogin.user.id, role: Role.ADMIN, officeId: null }
    );
    assert(approvedPlan.status === GADPlanStatus.APPROVED, 'ADMIN successfully approves GAD Plan');

    // 5. Accomplishments & Actuals
    console.log('\n>> 5. TESTING ACCOMPLISHMENTS & ACTUALS TRACKING');
    const accRecord = await AccomplishmentService.createAccomplishment(
      {
        gadPlanId: newPlanItem.id,
        fiscalYear: 2026,
        quarter: 2,
        actualOutput: 'Conducted 3-day leadership workshop for 52 women leaders',
        actualMale: 2,
        actualFemale: 50,
        actualBudgetUsed: 72000,
        outputSummary: 'Target exceeded by 4%',
      },
      { id: encoderLogin.user.id, role: Role.ENCODER, officeId: mswdoOffice!.id }
    );
    assert(accRecord.actualFemale === 50 && accRecord.actualBudgetUsed === 72000, 'Accomplishment created with gender disaggregated beneficiaries and budget');

    // 6. Audit Logging Verification
    console.log('\n>> 6. TESTING CENTRALIZED TRANSACTIONAL AUDIT LOGGING');
    const logsResult = await UserService.getUsers();
    assert(logsResult.length > 0, 'Users query succeeds');

    const auditTrail = await prisma.auditLog.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
    });
    assert(auditTrail.length > 0, `Audit logs captured in database (total checked: ${auditTrail.length})`);
    const hasPlanStatusLog = auditTrail.some((l) => l.action.includes('GAD_PLAN') || l.action.includes('USER') || l.action.includes('BENEFICIARY'));
    assert(hasPlanStatusLog, 'Audit log accurately records state mutations');

  } catch (error) {
    console.error('Test Suite encountered unhandled error:', error);
    failed++;
  } finally {
    console.log('\n====================================================');
    console.log(` TEST RUN SUMMARY: ${passed} PASSED, ${failed} FAILED`);
    console.log('====================================================');
    await prisma.$disconnect();
    if (failed > 0) process.exit(1);
  }
}

runIntegrationTests();
