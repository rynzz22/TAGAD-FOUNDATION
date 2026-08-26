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

/**
 * Statutory reference data: 5 Official LGU Offices in Talibon
 */
export const FALLBACK_OFFICES: FallbackOffice[] = [
  { id: 'off-mpdc', code: 'MPDC', name: 'Municipal Planning and Development Coordinator', headName: 'Engr. Planning Officer', isActive: true },
  { id: 'off-mswdo', code: 'MSWDO', name: 'Municipal Social Welfare and Development Office', headName: 'Social Welfare Officer', isActive: true },
  { id: 'off-mho', code: 'MHO', name: 'Municipal Health Office', headName: 'Municipal Health Officer', isActive: true },
  { id: 'off-mao', code: 'MAO', name: 'Municipal Agriculture Office', headName: 'Municipal Agriculturist', isActive: true },
  { id: 'off-gfps', code: 'MO-GFPS', name: 'Mayor’s Office - GAD Focal Point System', headName: 'GAD Focal Coordinator', isActive: true },
];

/**
 * Statutory reference data: 25 Barangays of Talibon, Bohol
 */
export const FALLBACK_BARANGAYS: FallbackBarangay[] = [
  { id: 'brgy-bag', name: 'Bagacay', code: 'TLB-BAG', captainName: 'Hon. Barangay Captain' },
  { id: 'brgy-bal', name: 'Balintawak', code: 'TLB-BAL', captainName: 'Hon. Barangay Captain' },
  { id: 'brgy-bur', name: 'Burgos', code: 'TLB-BUR', captainName: 'Hon. Barangay Captain' },
  { id: 'brgy-bus', name: 'Busalian', code: 'TLB-BUS', captainName: 'Hon. Barangay Captain' },
  { id: 'brgy-cal', name: 'Calituban', code: 'TLB-CAL', captainName: 'Hon. Barangay Captain' },
  { id: 'brgy-cat', name: 'Cataban', code: 'TLB-CAT', captainName: 'Hon. Barangay Captain' },
  { id: 'brgy-gui', name: 'Guindacpan', code: 'TLB-GUI', captainName: 'Hon. Barangay Captain' },
  { id: 'brgy-mag', name: 'Magsaysay', code: 'TLB-MAG', captainName: 'Hon. Barangay Captain' },
  { id: 'brgy-mah', name: 'Mahanay', code: 'TLB-MAH', captainName: 'Hon. Barangay Captain' },
  { id: 'brgy-noc', name: 'Nocnocan', code: 'TLB-NOC', captainName: 'Hon. Barangay Captain' },
  { id: 'brgy-pob', name: 'Poblacion', code: 'TLB-POB', captainName: 'Hon. Barangay Captain' },
  { id: 'brgy-riz', name: 'Rizal', code: 'TLB-RIZ', captainName: 'Hon. Barangay Captain' },
  { id: 'brgy-sag', name: 'San Agustin', code: 'TLB-SAG', captainName: 'Hon. Barangay Captain' },
  { id: 'brgy-sca', name: 'San Carlos', code: 'TLB-SCA', captainName: 'Hon. Barangay Captain' },
  { id: 'brgy-sfr', name: 'San Francisco', code: 'TLB-SFR', captainName: 'Hon. Barangay Captain' },
  { id: 'brgy-sis', name: 'San Isidro', code: 'TLB-SIS', captainName: 'Hon. Barangay Captain' },
  { id: 'brgy-sjo', name: 'San Jose', code: 'TLB-SJO', captainName: 'Hon. Barangay Captain' },
  { id: 'brgy-spe', name: 'San Pedro', code: 'TLB-SPE', captainName: 'Hon. Barangay Captain' },
  { id: 'brgy-sro', name: 'San Roque', code: 'TLB-SRO', captainName: 'Hon. Barangay Captain' },
  { id: 'brgy-stn', name: 'Santo Niño', code: 'TLB-STN', captainName: 'Hon. Barangay Captain' },
  { id: 'brgy-sik', name: 'Sikatuna', code: 'TLB-SIK', captainName: 'Hon. Barangay Captain' },
  { id: 'brgy-sub', name: 'Suba', code: 'TLB-SUB', captainName: 'Hon. Barangay Captain' },
  { id: 'brgy-tan', name: 'Tanghaligi', code: 'TLB-TAN', captainName: 'Hon. Barangay Captain' },
  { id: 'brgy-til', name: 'Tilmobo', code: 'TLB-TIL', captainName: 'Hon. Barangay Captain' },
  { id: 'brgy-zam', name: 'Zamora', code: 'TLB-ZAM', captainName: 'Hon. Barangay Captain' },
];

/**
 * No hardcoded mock business data - Initial empty state
 */
export const FALLBACK_PROGRAMS: any[] = [];
export const FALLBACK_ACCOMPLISHMENTS: any[] = [];
export const FALLBACK_GAD_PLANS: any[] = [];

/**
 * Returns genuine unpopulated demographics structure (zero counts)
 */
export function getFallbackDemographicsData(year?: number, barangayId?: string) {
  const barangayList = FALLBACK_BARANGAYS.map((b) => ({
    id: b.id,
    barangay: b.name,
    female: 0,
    male: 0,
    total: 0,
  }));

  const targetList = barangayId
    ? barangayList.filter((b) => b.id === barangayId || b.barangay.toLowerCase() === barangayId.toLowerCase())
    : barangayList;

  return {
    totals: {
      totalBeneficiaries: 0,
      female: 0,
      male: 0,
      femalePercentage: 0,
      malePercentage: 0,
    },
    bySector: [],
    byBarangay: targetList,
  };
}

/**
 * Returns genuine unpopulated public dashboard structure (zero counts)
 */
export function getFallbackPublicDashboard(year?: number) {
  const currentYear = year || new Date().getFullYear();
  const demographics = getFallbackDemographicsData(currentYear);

  return {
    summary: {
      fiscalYear: currentYear,
      totalBeneficiaries: 0,
      totalMale: 0,
      totalFemale: 0,
      femalePercentage: 0,
      malePercentage: 0,
      activeProgramsCount: 0,
      totalBudgetAllocated: 0,
      totalBudgetUsed: 0,
      utilizationRate: 0,
    },
    bySector: [],
    byBarangay: demographics.byBarangay,
  };
}
