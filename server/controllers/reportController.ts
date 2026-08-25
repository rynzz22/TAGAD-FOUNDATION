import { Request, Response } from 'express';
import ExcelJS from 'exceljs';
import PDFDocument from 'pdfkit';
import prisma from '../lib/prisma';

export const getGPBExcel = async (req: Request, res: Response) => {
  const { year, office } = req.query;
  const filter: any = {};
  if (year) filter.fiscalYear = parseInt(year as string);
  if (office) {
    filter.office = { OR: [{ code: office as string }, { name: office as string }] };
  }

  try {
    const plans = await prisma.gADPlan.findMany({
      where: filter,
      include: {
        office: true,
        items: true,
      }
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('GPB');

    worksheet.mergeCells('A1:K1');
    worksheet.getCell('A1').value = `GENDER AND DEVELOPMENT PLAN AND BUDGET — Municipality of Talibon — ${year || 'All Years'}`;
    worksheet.getCell('A1').font = { bold: true, size: 16 };
    worksheet.getCell('A1').alignment = { horizontal: 'center' };

    worksheet.columns = [
      { header: 'No.', key: 'no', width: 5 },
      { header: 'Gender Issue', key: 'issue', width: 30 },
      { header: 'GAD Result', key: 'result', width: 30 },
      { header: 'Activity', key: 'activity', width: 30 },
      { header: 'Performance Indicator', key: 'indicator', width: 25 },
      { header: 'Target Group', key: 'target', width: 20 },
      { header: 'Timeline', key: 'timeline', width: 15 },
      { header: 'Responsible Office', key: 'office', width: 20 },
      { header: 'Budget', key: 'budget', width: 15 },
      { header: 'Fund Source', key: 'source', width: 15 },
      { header: 'Status', key: 'status', width: 12 },
    ];

    let rowIdx = 1;
    plans.forEach((plan) => {
      plan.items.forEach((item) => {
        worksheet.addRow({
          no: rowIdx++,
          issue: item.genderIssue,
          result: item.gadResult,
          activity: item.activity,
          indicator: item.performanceIndicator,
          target: item.targetGroup,
          timeline: item.timeline,
          office: item.responsibleOffice,
          budget: Number(item.budget),
          source: item.fundSource,
          status: plan.status,
        });
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=GPB_${year || 'ALL'}.xlsx`);

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getGARExcel = async (req: Request, res: Response) => {
  const { year, office } = req.query;
  const filter: any = {};
  if (year) filter.fiscalYear = parseInt(year as string);

  try {
    const accomplishments = await prisma.gADAccomplishment.findMany({
      where: filter,
      include: {
        program: { include: { office: true } },
        gadPlanItem: { include: { gadPlan: { include: { office: true } } } },
        attachments: true
      }
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('GAR');

    worksheet.mergeCells('A1:L1');
    worksheet.getCell('A1').value = `GAD ACCOMPLISHMENT REPORT — Municipality of Talibon — ${year || 'All Years'}`;
    worksheet.getCell('A1').font = { bold: true, size: 16 };
    worksheet.getCell('A1').alignment = { horizontal: 'center' };

    worksheet.columns = [
      { header: 'No.', key: 'no', width: 5 },
      { header: 'Activity / Program', key: 'activity', width: 30 },
      { header: 'Responsible Office', key: 'office', width: 20 },
      { header: 'Actual Output', key: 'actualOutput', width: 30 },
      { header: 'Approved Budget', key: 'approvedBudget', width: 15 },
      { header: 'Actual Budget Used', key: 'actualBudget', width: 15 },
      { header: 'Male Beneficiaries', key: 'male', width: 15 },
      { header: 'Female Beneficiaries', key: 'female', width: 15 },
      { header: 'Total Beneficiaries', key: 'total', width: 15 },
      { header: 'Variance / Remarks', key: 'remarks', width: 25 },
    ];

    accomplishments.forEach((acc, index) => {
      const activityTitle = acc.gadPlanItem?.activity || acc.program?.title || 'GAD Undertaking';
      const officeName = acc.gadPlanItem?.gadPlan?.office?.name || acc.program?.office?.name || 'LGU Talibon';
      const approvedBudget = acc.gadPlanItem?.budget ? Number(acc.gadPlanItem.budget) : (acc.program?.budgetTarget ? Number(acc.program.budgetTarget) : 0);

      worksheet.addRow({
        no: index + 1,
        activity: activityTitle,
        office: officeName,
        actualOutput: acc.actualOutput,
        approvedBudget,
        actualBudget: Number(acc.actualBudgetUsed),
        male: acc.actualMale,
        female: acc.actualFemale,
        total: acc.actualMale + acc.actualFemale,
        remarks: acc.remarks || acc.varianceExplanation || '',
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=GAR_${year || 'ALL'}.xlsx`);

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getBeneficiariesExcel = async (req: Request, res: Response) => {
  try {
    const beneficiaries = await prisma.beneficiary.findMany({
      where: { isArchived: false },
      include: { barangay: true, office: true },
      orderBy: { createdAt: 'desc' }
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Beneficiaries');

    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'First Name', key: 'firstName', width: 20 },
      { header: 'Last Name', key: 'lastName', width: 20 },
      { header: 'Sex', key: 'sex', width: 10 },
      { header: 'Age', key: 'age', width: 8 },
      { header: 'Barangay', key: 'barangay', width: 20 },
      { header: 'Sector', key: 'sector', width: 20 },
      { header: 'Office', key: 'office', width: 20 },
      { header: 'Date Encoded', key: 'dateEncoded', width: 15 },
    ];

    beneficiaries.forEach((b) => {
      worksheet.addRow({
        id: b.id.slice(0, 8),
        firstName: b.firstName,
        lastName: b.lastName,
        sex: b.sex,
        age: b.age,
        barangay: b.barangay.name,
        sector: b.sector,
        office: b.office?.code || b.officeId || '',
        dateEncoded: b.createdAt.toISOString().split('T')[0],
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=Beneficiaries_${new Date().getFullYear()}.xlsx`);

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getBeneficiariesPDF = async (req: Request, res: Response) => {
  try {
    const beneficiaries = await prisma.beneficiary.findMany({
      where: { isArchived: false },
      include: { barangay: true, office: true },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    const doc = new PDFDocument({ margin: 40 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Beneficiaries_Report.pdf`);

    doc.pipe(res);

    doc.fontSize(16).text('MUNICIPALITY OF TALIBON', { align: 'center' });
    doc.fontSize(12).text('Gender and Development (GAD) Beneficiary Registry', { align: 'center' });
    doc.moveDown();

    doc.fontSize(10).text(`Generated Date: ${new Date().toLocaleDateString()}`);
    doc.text(`Total Records Displayed: ${beneficiaries.length}`);
    doc.moveDown();

    beneficiaries.forEach((b, i) => {
      doc.fontSize(9).text(
        `${i + 1}. ${b.lastName}, ${b.firstName} | Sex: ${b.sex} | Age: ${b.age} | Brgy: ${b.barangay.name} | Sector: ${b.sector}`
      );
    });

    doc.end();
  } catch (error) {
    res.status(500).json({ message: 'Server error generating PDF' });
  }
};
