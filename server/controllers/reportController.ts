import { Request, Response } from 'express';
import ExcelJS from 'exceljs';
import PDFDocument from 'pdfkit';
import prisma from '../lib/prisma';

export const getGPBExcel = async (req: Request, res: Response) => {
  const { year, office } = req.query;
  const filter: any = {};
  if (year) filter.year = parseInt(year as string);
  if (office) filter.office = office;

  try {
    const plans = await prisma.gADPlan.findMany({ where: filter });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('GPB');

    worksheet.mergeCells('A1:K1');
    worksheet.getCell('A1').value = `GENDER AND BUDGET PLAN — Municipality of Talibon — ${year || 'All Years'}`;
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

    plans.forEach((plan, index) => {
      worksheet.addRow({
        no: index + 1,
        issue: plan.genderIssue,
        result: plan.gadResult,
        activity: plan.activity,
        indicator: plan.performanceIndicator,
        target: plan.targetGroup,
        timeline: plan.timeline,
        office: plan.responsibleOffice,
        budget: plan.budget,
        source: plan.fundSource,
        status: plan.status,
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=GPB_${year}.xlsx`);

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getGARExcel = async (req: Request, res: Response) => {
  const { year, office } = req.query;
  const filter: any = {};
  if (year) filter.year = parseInt(year as string);
  if (office) filter.office = office;

  try {
    const accs = await prisma.gADAccomplishment.findMany({
      where: { gadPlan: filter },
      include: { gadPlan: true }
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('GAR');

    worksheet.mergeCells('A1:J1');
    worksheet.getCell('A1').value = `GENDER AND DEVELOPMENT ACCOMPLISHMENT REPORT — Municipality of Talibon — ${year || 'All Years'}`;
    worksheet.getCell('A1').font = { bold: true, size: 16 };
    worksheet.getCell('A1').alignment = { horizontal: 'center' };

    worksheet.columns = [
      { header: 'No.', key: 'no', width: 5 },
      { header: 'Activity', key: 'activity', width: 30 },
      { header: 'Actual Output', key: 'output', width: 30 },
      { header: 'Beneficiaries (M)', key: 'm', width: 15 },
      { header: 'Beneficiaries (F)', key: 'f', width: 15 },
      { header: 'Total', key: 'total', width: 15 },
      { header: 'Budget Allocated', key: 'allocated', width: 15 },
      { header: 'Budget Used', key: 'used', width: 15 },
      { header: 'Utilization %', key: 'percent', width: 12 },
      { header: 'Remarks', key: 'remarks', width: 25 },
    ];

    accs.forEach((acc, index) => {
      const total = acc.actualBeneficiaryMale + acc.actualBeneficiaryFemale;
      const percent = (acc.actualBudgetUsed / acc.gadPlan.budget) * 100;
      worksheet.addRow({
        no: index + 1,
        activity: acc.gadPlan.activity,
        output: acc.actualOutput,
        m: acc.actualBeneficiaryMale,
        f: acc.actualBeneficiaryFemale,
        total,
        allocated: acc.gadPlan.budget,
        used: acc.actualBudgetUsed,
        percent: `${percent.toFixed(2)}%`,
        remarks: acc.remarks,
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=GAR_${year}.xlsx`);

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getBeneficiariesPDF = async (req: Request, res: Response) => {
  const { year } = req.query;
  const filter: any = { isArchived: false };
  if (year) {
    filter.dateEncoded = {
      gte: new Date(`${year}-01-01`),
      lte: new Date(`${year}-12-31`)
    };
  }

  try {
    const beneficiaries = await prisma.beneficiary.findMany({ where: filter });

    const doc = new PDFDocument({ margin: 30 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=Beneficiaries.pdf');
    doc.pipe(res);

    doc.fontSize(16).text('Municipality of Talibon', { align: 'center' });
    doc.fontSize(14).text('Beneficiary List Report', { align: 'center' });
    doc.moveDown();

    doc.fontSize(10);
    // Table Header
    const tableTop = 150;
    doc.text('Name', 30, tableTop);
    doc.text('Sex', 150, tableTop);
    doc.text('Age', 200, tableTop);
    doc.text('Barangay', 250, tableTop);
    doc.text('Sector', 350, tableTop);
    doc.text('Date', 450, tableTop);

    let y = tableTop + 20;
    beneficiaries.forEach(b => {
      if (y > 700) { doc.addPage(); y = 50; }
      doc.text(`${b.firstName} ${b.lastName}`, 30, y);
      doc.text(b.sex, 150, y);
      doc.text(b.age.toString(), 200, y);
      doc.text(b.barangay, 250, y);
      doc.text(b.sector, 350, y);
      doc.text(new Date(b.dateEncoded).toLocaleDateString(), 450, y);
      y += 15;
    });

    doc.end();
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
