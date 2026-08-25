export interface FallbackOffice {
  id: string;
  code: string;
  name: string;
  headName: string | null;
  isActive: boolean;
}

export interface FallbackBarangay {
  id: string;
  code: string;
  name: string;
  captainName: string | null;
}

export const FALLBACK_OFFICES: FallbackOffice[] = [
  { id: 'off-mpdc', code: 'MPDC', name: 'Municipal Planning and Development Coordinator', headName: 'Engr. Planning Officer', isActive: true },
  { id: 'off-mswdo', code: 'MSWDO', name: 'Municipal Social Welfare and Development Office', headName: 'Maria Elena Santos, RSW', isActive: true },
  { id: 'off-mho', code: 'MHO', name: 'Municipal Health Office', headName: 'Dr. Roberto Lim, MD', isActive: true },
  { id: 'off-mao', code: 'MAO', name: 'Municipal Agriculture Office', headName: 'Arturo Fernandez, Agronomist', isActive: true },
  { id: 'off-gfps', code: 'MO-GFPS', name: 'Mayor’s Office - GAD Focal Point System', headName: 'Atty. GAD Focal Officer', isActive: true },
];

export const FALLBACK_BARANGAYS: FallbackBarangay[] = [
  { id: 'brgy-bag', name: 'Bagacay', code: 'TLB-BAG', captainName: 'Hon. Juan Bagacay' },
  { id: 'brgy-bal', name: 'Balintawak', code: 'TLB-BAL', captainName: 'Hon. Pedro Balintawak' },
  { id: 'brgy-bur', name: 'Burgos', code: 'TLB-BUR', captainName: 'Hon. Mateo Burgos' },
  { id: 'brgy-bus', name: 'Busalian', code: 'TLB-BUS', captainName: 'Hon. Rosa Busalian' },
  { id: 'brgy-cal', name: 'Calituban', code: 'TLB-CAL', captainName: 'Hon. Carlos Calituban' },
  { id: 'brgy-cat', name: 'Cataban', code: 'TLB-CAT', captainName: 'Hon. Teresa Cataban' },
  { id: 'brgy-gui', name: 'Guindacpan', code: 'TLB-GUI', captainName: 'Hon. Andres Guindacpan' },
  { id: 'brgy-mag', name: 'Magsaysay', code: 'TLB-MAG', captainName: 'Hon. Ramon Magsaysay' },
  { id: 'brgy-mah', name: 'Mahanay', code: 'TLB-MAH', captainName: 'Hon. Lucia Mahanay' },
  { id: 'brgy-noc', name: 'Nocnocan', code: 'TLB-NOC', captainName: 'Hon. Felipe Nocnocan' },
  { id: 'brgy-pob', name: 'Poblacion', code: 'TLB-POB', captainName: 'Hon. Manuel Poblacion' },
  { id: 'brgy-riz', name: 'Rizal', code: 'TLB-RIZ', captainName: 'Hon. Jose Rizal' },
  { id: 'brgy-sag', name: 'San Agustin', code: 'TLB-SAG', captainName: 'Hon. Agustin Santos' },
  { id: 'brgy-sca', name: 'San Carlos', code: 'TLB-SCA', captainName: 'Hon. Carlos Reyes' },
  { id: 'brgy-sfr', name: 'San Francisco', code: 'TLB-SFR', captainName: 'Hon. Francisco Cruz' },
  { id: 'brgy-sis', name: 'San Isidro', code: 'TLB-SIS', captainName: 'Hon. Isidro Labrador' },
  { id: 'brgy-sjo', name: 'San Jose', code: 'TLB-SJO', captainName: 'Hon. Josefa San Jose' },
  { id: 'brgy-spe', name: 'San Pedro', code: 'TLB-SPE', captainName: 'Hon. Pedro Bautista' },
  { id: 'brgy-sro', name: 'San Roque', code: 'TLB-SRO', captainName: 'Hon. Roque Alcantara' },
  { id: 'brgy-stn', name: 'Santo Niño', code: 'TLB-STN', captainName: 'Hon. Niño Valenzuela' },
  { id: 'brgy-sik', name: 'Sikatuna', code: 'TLB-SIK', captainName: 'Hon. Datu Sikatuna' },
  { id: 'brgy-sub', name: 'Suba', code: 'TLB-SUB', captainName: 'Hon. Marina Suba' },
  { id: 'brgy-tan', name: 'Tanghaligi', code: 'TLB-TAN', captainName: 'Hon. Leon Tanghaligi' },
  { id: 'brgy-til', name: 'Tilmobo', code: 'TLB-TIL', captainName: 'Hon. Gabriel Tilmobo' },
  { id: 'brgy-zam', name: 'Zamora', code: 'TLB-ZAM', captainName: 'Hon. Jacinto Zamora' },
];

export const FALLBACK_PROGRAMS = [
  {
    id: 'prog-001',
    title: 'Maternal and Child Nutrition & First 1000 Days Support Initiative',
    description: 'Supplemental feeding, micronutrient supplementation, lactation stations, and prenatal health classes for pregnant mothers and lactating women across coastal and island barangays.',
    sector: 'Health',
    fiscalYear: 2026,
    status: 'ACTIVE',
    budgetTarget: 650000,
    budgetActual: 420000,
    targetMale: 80,
    targetFemale: 380,
    actualMale: 65,
    actualFemale: 320,
    office: 'MHO',
    officeName: 'Municipal Health Office',
    officeId: 'off-mho',
  },
  {
    id: 'prog-002',
    title: 'Livelihood Capital Assistance & Entrepreneurship for Solo Parents & Rural Women',
    description: 'Micro-enterprise seed grants, financial literacy coaching, and food processing equipment provision for registered solo mothers and vulnerable rural women associations.',
    sector: 'Social Protection',
    fiscalYear: 2026,
    status: 'ACTIVE',
    budgetTarget: 800000,
    budgetActual: 530000,
    targetMale: 60,
    targetFemale: 290,
    actualMale: 45,
    actualFemale: 245,
    office: 'MSWDO',
    officeName: 'Municipal Social Welfare and Development Office',
    officeId: 'off-mswdo',
  },
  {
    id: 'prog-003',
    title: 'Women in Agri-Fisheries Capacity Building & Seaweed Value Addition',
    description: 'Modernization of post-harvest drying facilities, seaweed processing techniques, and sustainable seaweed farming equipment for women fisherfolk in coastal barangays.',
    sector: 'Agriculture',
    fiscalYear: 2026,
    status: 'ACTIVE',
    budgetTarget: 500000,
    budgetActual: 310000,
    targetMale: 110,
    targetFemale: 230,
    actualMale: 95,
    actualFemale: 185,
    office: 'MAO',
    officeName: 'Municipal Agriculture Office',
    officeId: 'off-mao',
  },
  {
    id: 'prog-004',
    title: 'Barangay VAW Desk Officers Capability Building & Gender Sensitivity Training',
    description: 'Intensive case management workshops, legal referral protocol certification, and standard intake tools deployment for all 25 Barangay VAW Desk officers.',
    sector: 'Governance',
    fiscalYear: 2026,
    status: 'COMPLETED',
    budgetTarget: 350000,
    budgetActual: 345000,
    targetMale: 40,
    targetFemale: 160,
    actualMale: 38,
    actualFemale: 154,
    office: 'MO-GFPS',
    officeName: 'Mayor’s Office - GAD Focal Point System',
    officeId: 'off-gfps',
  },
  {
    id: 'prog-005',
    title: 'Gender-Responsive Campus Clinics & Adolescent Reproductive Health Education',
    description: 'Life-skills training, teen center enhancements, and peer counseling workshops in public high schools to reduce early pregnancy and promote gender equality.',
    sector: 'Education',
    fiscalYear: 2026,
    status: 'ACTIVE',
    budgetTarget: 400000,
    budgetActual: 240000,
    targetMale: 180,
    targetFemale: 260,
    actualMale: 140,
    actualFemale: 215,
    office: 'MSWDO',
    officeName: 'Municipal Social Welfare and Development Office',
    officeId: 'off-mswdo',
  },
  {
    id: 'prog-006',
    title: 'Gender-Responsive and PWD-Accessible Public Sanitation Facilities',
    description: 'Construction and retrofitting of gender-separated, safe, well-lit, and PWD-accessible restroom facilities in Talibon Public Market and municipal bus terminals.',
    sector: 'Infrastructure',
    fiscalYear: 2026,
    status: 'ACTIVE',
    budgetTarget: 1200000,
    budgetActual: 890000,
    targetMale: 600,
    targetFemale: 750,
    actualMale: 480,
    actualFemale: 610,
    office: 'MPDC',
    officeName: 'Municipal Planning and Development Coordinator',
    officeId: 'off-mpdc',
  },
  {
    id: 'prog-007',
    title: 'Universal Health Care & Cervical Cancer Screening for Women Constituents',
    description: 'Free Pap smear, VIA screening, breast examination, and reproductive wellness clinics across rural health units.',
    sector: 'Health',
    fiscalYear: 2025,
    status: 'COMPLETED',
    budgetTarget: 550000,
    budgetActual: 542000,
    targetMale: 0,
    targetFemale: 450,
    actualMale: 0,
    actualFemale: 438,
    office: 'MHO',
    officeName: 'Municipal Health Office',
    officeId: 'off-mho',
  },
  {
    id: 'prog-008',
    title: 'Emergency Assistance and Relief for VAWC Survivors and Families in Crisis',
    description: 'Immediate shelter, psycho-social debriefing, legal assistance, and crisis relief aid for victims of gender-based violence.',
    sector: 'Social Protection',
    fiscalYear: 2025,
    status: 'COMPLETED',
    budgetTarget: 450000,
    budgetActual: 440000,
    targetMale: 20,
    targetFemale: 140,
    actualMale: 18,
    actualFemale: 136,
    office: 'MSWDO',
    officeName: 'Municipal Social Welfare and Development Office',
    officeId: 'off-mswdo',
  },
];

export const FALLBACK_ACCOMPLISHMENTS = [
  {
    id: 'acc-001',
    fiscalYear: 2026,
    quarter: 1,
    activityTitle: 'Maternal Nutrition Package & Prenatal Care Distribution',
    office: 'Municipal Health Office',
    actualOutput: 'Conducted 12 community nutrition sessions and distributed 320 maternal milk and iron supplement kits across 8 island barangays.',
    actualBudgetUsed: 195000,
    actualMale: 25,
    actualFemale: 295,
    totalBeneficiaries: 320,
    outputSummary: 'Full attendance recorded in Calituban, Guindacpan, and Mahanay island communities.',
  },
  {
    id: 'acc-002',
    fiscalYear: 2026,
    quarter: 1,
    activityTitle: 'Barangay VAW Desk Officers Capability Training Batch 1',
    office: 'Mayor’s Office - GAD Focal Point System',
    actualOutput: 'Trained 50 barangay personnel (VAW desk officers, councilors on women, and BNS) on gender-sensitive incident intake protocols.',
    actualBudgetUsed: 175000,
    actualMale: 12,
    actualFemale: 38,
    totalBeneficiaries: 50,
    outputSummary: 'Standard VAWC logbooks and referral templates issued to 13 pilot barangays.',
  },
  {
    id: 'acc-003',
    fiscalYear: 2026,
    quarter: 2,
    activityTitle: 'Livelihood Toolkits Distribution for Solo Parents Federation',
    office: 'Municipal Social Welfare and Development Office',
    actualOutput: 'Awarded commercial baking, tailoring, and food carts toolkits to 75 qualified solo parent heads of households.',
    actualBudgetUsed: 310000,
    actualMale: 15,
    actualFemale: 60,
    totalBeneficiaries: 75,
    outputSummary: 'Post-distribution business mentoring arranged with DTI Negosyo Center Talibon.',
  },
  {
    id: 'acc-004',
    fiscalYear: 2026,
    quarter: 2,
    activityTitle: 'Modern Seaweed Processing Training for Coastal Fisherwomen',
    office: 'Municipal Agriculture Office',
    actualOutput: 'Completed 3-day practical training on Eucheuma seaweed processing and value-addition for 60 coastal women producers.',
    actualBudgetUsed: 140000,
    actualMale: 10,
    actualFemale: 50,
    totalBeneficiaries: 60,
    outputSummary: 'Initiated cooperative registration for Talibon Fisherwomen Seaweed Producers.',
  },
  {
    id: 'acc-005',
    fiscalYear: 2025,
    quarter: 4,
    activityTitle: 'Municipal GAD Summit & Women’s Month Community Assembly',
    office: 'Mayor’s Office - GAD Focal Point System',
    actualOutput: 'Convened 350 women leaders, sector representatives, and municipal officials for the annual GAD policy consultation and awards.',
    actualBudgetUsed: 220000,
    actualMale: 65,
    actualFemale: 285,
    totalBeneficiaries: 350,
    outputSummary: 'Adopted the 2026 GAD Policy Agenda recommendations for executive submission.',
  },
];

export const FALLBACK_GAD_PLANS = [
  {
    id: 'plan-001',
    fiscalYear: 2026,
    office: 'MSWDO',
    officeName: 'Municipal Social Welfare and Development Office',
    officeId: 'off-mswdo',
    totalBudget: 4500000,
    gadBudget: 950000,
    status: 'APPROVED',
    items: [
      {
        id: 'item-001',
        genderIssue: 'Economic vulnerability and lack of independent income among solo parents and marginalized rural women',
        gadResult: 'Enhanced household economic self-reliance through sustainable micro-enterprises and technical livelihood skills',
        activity: 'Livelihood Seed Grants and Entrepreneurship Training for Solo Parents and Women in Need',
        performanceIndicator: 'At least 120 women and solo parents provided with startup capital and certified business coaching',
        targetGroup: 'Registered Solo Parents and Marginalized Women',
        timeline: 'Q1 - Q3 2026',
        responsibleOffice: 'MSWDO',
        budget: 550000,
        fundSource: 'General Fund (5% GAD)',
      },
      {
        id: 'item-002',
        genderIssue: 'High incidence of teenage pregnancy and lack of comprehensive adolescent reproductive health guidance',
        gadResult: 'Increased awareness on reproductive health rights, early pregnancy prevention, and gender equality among youth',
        activity: 'Adolescent Reproductive Health Workshops and Teen Wellness Desk Establishment in High Schools',
        performanceIndicator: '15 campus seminars held reaching 600 students across 6 municipal high schools',
        targetGroup: 'In-school and Out-of-school Adolescents (Ages 13-19)',
        timeline: 'Q2 - Q4 2026',
        responsibleOffice: 'MSWDO / DepEd',
        budget: 400000,
        fundSource: 'General Fund (5% GAD)',
      },
    ],
  },
  {
    id: 'plan-002',
    fiscalYear: 2026,
    office: 'MHO',
    officeName: 'Municipal Health Office',
    officeId: 'off-mho',
    totalBudget: 6200000,
    gadBudget: 1100000,
    status: 'APPROVED',
    items: [
      {
        id: 'item-003',
        genderIssue: 'Elevated rates of maternal anemia and child undernutrition in remote island barangays of Talibon',
        gadResult: 'Improved nutritional status of pregnant women and infants during the first 1,000 days of life',
        activity: 'Intensive First 1,000 Days Maternal Nutrition and Micronutrient Supplementation Caravan',
        performanceIndicator: '450 pregnant and lactating women provided with complete prenatal micronutrient packages and monitoring',
        targetGroup: 'Pregnant and Lactating Mothers in Island Barangays',
        timeline: 'Q1 - Q4 2026',
        responsibleOffice: 'MHO',
        budget: 700000,
        fundSource: 'General Fund (5% GAD)',
      },
      {
        id: 'item-004',
        genderIssue: 'Low accessibility of preventive cervical and breast cancer screening among rural women constituents',
        gadResult: 'Early detection and timely medical intervention for reproductive health malignancies',
        activity: 'Community-Based Cervical Cancer (VIA) and Clinical Breast Examination Mobile Clinics',
        performanceIndicator: '500 adult women screened across all 25 barangays with free referral support',
        targetGroup: 'Women of Reproductive Age (21-55 years old)',
        timeline: 'Q2 - Q3 2026',
        responsibleOffice: 'MHO',
        budget: 400000,
        fundSource: 'General Fund (5% GAD)',
      },
    ],
  },
  {
    id: 'plan-003',
    fiscalYear: 2026,
    office: 'MO-GFPS',
    officeName: 'Mayor’s Office - GAD Focal Point System',
    officeId: 'off-gfps',
    totalBudget: 3800000,
    gadBudget: 850000,
    status: 'APPROVED',
    items: [
      {
        id: 'item-005',
        genderIssue: 'Uneven capability and compliance of Barangay VAW Desks in handling GBV incident intake and reporting',
        gadResult: '100% operational, gender-sensitive, and compliant Barangay VAW Desks across all 25 barangays',
        activity: 'Capability Building, Legal Protocol Certification, and Standard Equipment for Barangay VAW Desks',
        performanceIndicator: '25 Barangay VAW Desk officers certified and equipped with standardized case intake tools',
        targetGroup: 'Barangay VAW Desk Officers, BNS, and PNP Women’s Desk',
        timeline: 'Q1 - Q2 2026',
        responsibleOffice: 'MO-GFPS / DILG / PNP',
        budget: 450000,
        fundSource: 'General Fund (5% GAD)',
      },
      {
        id: 'item-006',
        genderIssue: 'Need for comprehensive sex-disaggregated database and gender statistics for evidence-based policymaking',
        gadResult: 'Maintained and updated Talibon Analytics for GAD (TAGAD) digital platform and data encoding',
        activity: 'GAD Database Maintenance, Citizen Demographics Profiling, and Annual GPB Monitoring',
        performanceIndicator: 'Quarterly updated municipal sex-disaggregated dashboard and published GAD AR report',
        targetGroup: 'LGU Planners, GFPS Members, and Public Constituents',
        timeline: 'Q1 - Q4 2026',
        responsibleOffice: 'MO-GFPS / MPDC',
        budget: 400000,
        fundSource: 'General Fund (5% GAD)',
      },
    ],
  },
];

// Generates consistent, high-fidelity demographic data for all 25 barangays
export function getFallbackDemographicsData(year?: number, barangayId?: string) {
  const brgyMultiplier: Record<string, number> = {
    'brgy-pob': 1.6,
    'brgy-cal': 1.4,
    'brgy-san': 1.3,
    'brgy-gui': 1.2,
    'brgy-san-c': 1.1,
    'brgy-mag': 1.0,
    'brgy-bag': 0.9,
    'brgy-bal': 0.85,
    'brgy-bur': 0.8,
    'brgy-bus': 0.95,
    'brgy-cat': 0.9,
    'brgy-mah': 0.85,
    'brgy-noc': 0.75,
    'brgy-riz': 1.05,
    'brgy-sag': 0.95,
    'brgy-sca': 0.9,
    'brgy-sfr': 0.85,
    'brgy-sis': 0.8,
    'brgy-sjo': 0.95,
    'brgy-spe': 0.85,
    'brgy-sro': 1.0,
    'brgy-stn': 0.9,
    'brgy-sik': 0.8,
    'brgy-sub': 1.1,
    'brgy-tan': 0.75,
    'brgy-til': 0.7,
    'brgy-zam': 0.8,
  };

  const barangayList = FALLBACK_BARANGAYS.map((b) => {
    const mult = brgyMultiplier[b.id] || 1.0;
    const baseFemale = Math.round(52 * mult);
    const baseMale = Math.round(33 * mult);
    const total = baseFemale + baseMale;
    return {
      id: b.id,
      barangay: b.name,
      female: baseFemale,
      male: baseMale,
      total: total,
    };
  });

  const targetList = barangayId
    ? barangayList.filter((b) => b.id === barangayId || b.barangay.toLowerCase() === barangayId.toLowerCase())
    : barangayList;

  const totalFemale = targetList.reduce((acc, curr) => acc + curr.female, 0);
  const totalMale = targetList.reduce((acc, curr) => acc + curr.male, 0);
  const totalBeneficiaries = totalFemale + totalMale;

  const sectors = [
    { sector: 'Women (General / Maternal)', count: Math.round(totalBeneficiaries * 0.32) },
    { sector: 'Senior Citizens', count: Math.round(totalBeneficiaries * 0.22) },
    { sector: '4Ps Beneficiaries', count: Math.round(totalBeneficiaries * 0.18) },
    { sector: 'Solo Parents', count: Math.round(totalBeneficiaries * 0.14) },
    { sector: 'Persons with Disability (PWD)', count: Math.round(totalBeneficiaries * 0.09) },
    { sector: 'Youth & Adolescent', count: Math.round(totalBeneficiaries * 0.05) },
  ];

  return {
    totals: {
      totalBeneficiaries,
      female: totalFemale,
      male: totalMale,
      femalePercentage: totalBeneficiaries > 0 ? (totalFemale / totalBeneficiaries) * 100 : 0,
      malePercentage: totalBeneficiaries > 0 ? (totalMale / totalBeneficiaries) * 100 : 0,
    },
    bySector: sectors.map((s) => ({
      sector: s.sector,
      count: s.count,
      percentage: totalBeneficiaries > 0 ? (s.count / totalBeneficiaries) * 100 : 0,
    })),
    byBarangay: targetList,
  };
}

export function getFallbackPublicDashboard(year?: number) {
  const currentYear = year || new Date().getFullYear();
  const programs = FALLBACK_PROGRAMS.filter((p) => p.fiscalYear === currentYear || currentYear >= 2026);
  const accomplishments = FALLBACK_ACCOMPLISHMENTS.filter((a) => a.fiscalYear === currentYear || currentYear >= 2026);

  const totalBudgetAllocated = programs.reduce((acc, curr) => acc + curr.budgetTarget, 0) || 3900000;
  const totalBudgetUsed = accomplishments.reduce((acc, curr) => acc + curr.actualBudgetUsed, 0) || 1040000;
  const utilizationRate = totalBudgetAllocated > 0 ? (totalBudgetUsed / totalBudgetAllocated) * 100 : 0;

  const demographics = getFallbackDemographicsData(currentYear);

  return {
    summary: {
      fiscalYear: currentYear,
      totalBeneficiaries: demographics.totals.totalBeneficiaries,
      totalMale: demographics.totals.male,
      totalFemale: demographics.totals.female,
      femalePercentage: demographics.totals.femalePercentage,
      malePercentage: demographics.totals.malePercentage,
      activeProgramsCount: programs.filter((p) => p.status === 'ACTIVE').length || 4,
      totalBudgetAllocated,
      totalBudgetUsed,
      utilizationRate,
    },
    bySector: demographics.bySector,
    byBarangay: demographics.byBarangay,
  };
}
