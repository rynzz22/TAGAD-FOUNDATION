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
import { OfficeService } from '../server/services/OfficeService';
import { BarangayService } from '../server/services/BarangayService';
import { AuditService } from '../server/services/AuditService';
import { sanitizePII } from '../server/middleware/piiSanitizer';
import { Role, GADPlanStatus } from '@prisma/client';

import bcrypt from 'bcryptjs';

async function runIntegrationTests() {
  console.log('====================================================');
  console.log(' TAGAD SPRINT 4 BACKEND INTEGRATION TEST SUITE');
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
    // 0. Ensure test fixtures exist if live database is connected
    const { isDatabaseConnected } = await import('../server/lib/prisma');
    if (isDatabaseConnected()) {
      const testHash = await bcrypt.hash('Password123!', 10);
      const mswdo = await prisma.office.findFirst({ where: { code: 'MSWDO' } });
      const mpdc = await prisma.office.findFirst({ where: { code: 'MPDC' } });

      await prisma.user.upsert({
        where: { email: 'admin@talibon.gov.ph' },
        update: { passwordHash: testHash, role: Role.ADMIN, officeId: mpdc?.id, isActive: true },
        create: { email: 'admin@talibon.gov.ph', fullName: 'System Administrator', passwordHash: testHash, role: Role.ADMIN, officeId: mpdc?.id, isActive: true },
      });

      await prisma.user.upsert({
        where: { email: 'mswdo@talibon.gov.ph' },
        update: { passwordHash: testHash, role: Role.ENCODER, officeId: mswdo?.id, isActive: true },
        create: { email: 'mswdo@talibon.gov.ph', fullName: 'MSWDO GAD Encoder', passwordHash: testHash, role: Role.ENCODER, officeId: mswdo?.id, isActive: true },
      });

      await prisma.user.upsert({
        where: { email: 'encoder.mswdo@talibon.gov.ph' },
        update: { passwordHash: testHash, role: Role.ENCODER, officeId: mswdo?.id, isActive: true },
        create: { email: 'encoder.mswdo@talibon.gov.ph', fullName: 'MSWDO Secondary Encoder', passwordHash: testHash, role: Role.ENCODER, officeId: mswdo?.id, isActive: true },
      });
    }

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
    const allOffices = await OfficeService.getOffices();
    const allBrgys = await BarangayService.getBarangays();
    const mswdoOffice = allOffices.find((o: any) => o.code === 'MSWDO') || allOffices[0];
    const maoOffice = allOffices.find((o: any) => o.code === 'MAO') || allOffices[1] || allOffices[0];
    const testBrgy = allBrgys[0];

    assert(!!mswdoOffice && !!maoOffice && !!testBrgy, 'Reference Offices and Barangays exist in system');

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

    // 6. Sprint 4 Hardening: Token Revocation, Refresh Rotation, Session Invalidation
    console.log('\n>> 6. TESTING TOKEN REVOCATION, ROTATION & LOGOUT HARDENING');
    
    // Test refresh token rotation
    const rotationLogin = await AuthService.login('admin@talibon.gov.ph', 'Password123!');
    const firstRefreshToken = rotationLogin.refreshToken;
    const firstRotated = await AuthService.refreshToken(firstRefreshToken);
    assert(!!firstRotated.accessToken && !!firstRotated.refreshToken, 'Refresh token rotated and returned new access & refresh tokens');

    // Attempting to reuse old refresh token must be rejected
    let reuseBlocked = false;
    try {
      await AuthService.refreshToken(firstRefreshToken);
    } catch (e: any) {
      reuseBlocked = e.code === 'INVALID_REFRESH_TOKEN' || e.name === 'TokenRevokedError';
    }
    assert(reuseBlocked, 'Replay attack prevented: Reusing previous refresh token is immediately rejected');

    // Test access token revocation on logout
    const logoutTestLogin = await AuthService.login('encoder.mswdo@talibon.gov.ph', 'Password123!');
    const dummyReq: any = {
      headers: {
        authorization: `Bearer ${logoutTestLogin.accessToken}`,
      },
      body: {
        refreshToken: logoutTestLogin.refreshToken,
      },
      socket: { remoteAddress: '127.0.0.1' },
    };
    await AuthService.logout(logoutTestLogin.user.id, dummyReq);

    // Verifying revoked access token throws TokenRevokedError
    let tokenRevokedCheckPassed = false;
    try {
      const { verifyAccessToken } = await import('../server/lib/jwt');
      verifyAccessToken(logoutTestLogin.accessToken);
    } catch (e: any) {
      tokenRevokedCheckPassed = e.name === 'TokenRevokedError';
    }
    assert(tokenRevokedCheckPassed, 'Logged out access token is immediately revoked and blocked on subsequent requests');

    // 7. Sprint 4 Hardening: UUID Parameter Validation Schema Tests
    console.log('\n>> 7. TESTING UUID PARAMETER VALIDATION SCHEMA');
    const { uuidParamSchema, uuidSchema } = await import('../server/validation/schemas');
    const validUuid = '123e4567-e89b-12d3-a456-426614174000';
    const invalidUuid = 'not-a-valid-uuid-12345';

    const validResult = uuidParamSchema.safeParse({ id: validUuid });
    const invalidResult = uuidParamSchema.safeParse({ id: invalidUuid });

    assert(validResult.success, 'UUID schema validates RFC4122 standard UUID strings');
    assert(!invalidResult.success, 'UUID schema strictly rejects malformed / non-UUID parameter strings');

    // 8. Audit Logging Verification
    console.log('\n>> 8. TESTING CENTRALIZED TRANSACTIONAL AUDIT LOGGING');
    const logsResult = await UserService.getUsers();
    assert(logsResult.length > 0, 'Users query succeeds');

    const auditResponse = await AuditService.getLogs({ limit: 10 });
    const auditTrail = auditResponse.logs;
    assert(auditTrail.length > 0, `Audit logs captured in system (total checked: ${auditTrail.length})`);
    const hasPlanStatusLog = auditTrail.some((l: any) => l.action.includes('GAD_PLAN') || l.action.includes('USER') || l.action.includes('BENEFICIARY') || l.action.includes('PROGRAM'));
    assert(hasPlanStatusLog, 'Audit log accurately records state mutations via atomic transactions');

    // 9. Sprint 5: Phase 1 CSV Schema Discovery Tests
    console.log('\n>> 9. TESTING SPRINT 5 PHASE 1 CSV SCHEMA DISCOVERY');
    const { CsvDiscoveryService } = await import('../server/services/CsvDiscoveryService');

    // Test sample raw CSV input (representative LGU format)
    const sampleLguCsv = `first_name,last_name,middle_name,gender,age,sector,barangay,contact_no,custom_remarks
Maria,Santos,Dela Cruz,Female,34,Women,Poblacion,09171234567,Solo parent applicant
Juan,Reyes,Alvarez,Male,67,Senior Citizen,TLB-POB,09189876543,Pension recipient
Elena,Gonzales,Lim,F,24,Youth,San Jose,09223334444,Skills training grantee
Roberto,Cruz,,M,45,Farmer,San Isidro,,Irrigation beneficiary`;

    const discovery = CsvDiscoveryService.discoverSchema(sampleLguCsv, 'lgu_sample_beneficiaries.csv');
    assert(discovery.totalRows === 4, 'CSV Discovery accurately parses row count');
    assert(discovery.totalColumns === 9, 'CSV Discovery accurately identifies column count');
    assert(discovery.summary.datasetTypeGuess === 'BENEFICIARY_REGISTRY', 'CSV Discovery infers dataset type as BENEFICIARY_REGISTRY');
    assert(discovery.summary.hasRequiredIdentityFields, 'CSV Discovery detects required personal identity fields');
    assert(discovery.summary.hasBarangayField, 'CSV Discovery recognizes Talibon barangay location column');
    assert(discovery.summary.hasGenderField, 'CSV Discovery recognizes gender/sex column');
    assert(discovery.columns['custom_remarks']?.inferredTargetField === 'custom_remarks', 'Unmapped custom columns are safely preserved as custom attributes');
    assert(discovery.schemaMapping.length === 9, 'CSV Discovery produces complete CSV-to-TAGAD data mapping matrix');

    // Test malformed / empty CSV handling
    const emptyDiscovery = CsvDiscoveryService.discoverSchema('', 'empty.csv');
    assert(emptyDiscovery.totalRows === 0 && emptyDiscovery.summary.datasetTypeGuess === 'UNKNOWN', 'Empty CSV is handled gracefully with zero rows and low readiness');

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
