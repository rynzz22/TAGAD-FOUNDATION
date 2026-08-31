import { CanonicalFieldOption, IngestionDatasetType } from './types';

export const CANONICAL_FIELD_OPTIONS: Record<IngestionDatasetType, CanonicalFieldOption[]> = {
  BENEFICIARY_REGISTRY: [
    { field: 'firstName', label: 'First Name (Required)', required: true, description: 'Given name of beneficiary', datasetTypes: ['BENEFICIARY_REGISTRY'] },
    { field: 'lastName', label: 'Last Name (Required)', required: true, description: 'Family name of beneficiary', datasetTypes: ['BENEFICIARY_REGISTRY'] },
    { field: 'middleName', label: 'Middle Name', required: false, description: 'Middle name or initial', datasetTypes: ['BENEFICIARY_REGISTRY'] },
    { field: 'fullName', label: 'Full Name (Composite)', required: false, description: 'Full combined name', datasetTypes: ['BENEFICIARY_REGISTRY'] },
    { field: 'sex', label: 'Sex / Gender (Required)', required: true, description: 'MALE or FEMALE', datasetTypes: ['BENEFICIARY_REGISTRY'] },
    { field: 'age', label: 'Age (Required)', required: true, description: 'Integer age in years', datasetTypes: ['BENEFICIARY_REGISTRY'] },
    { field: 'birthdate', label: 'Birthdate', required: false, description: 'Date of birth (ISO/YYYY-MM-DD)', datasetTypes: ['BENEFICIARY_REGISTRY'] },
    { field: 'sector', label: 'Sector (Required)', required: true, description: 'e.g. Women, Senior Citizen, PWD, Youth', datasetTypes: ['BENEFICIARY_REGISTRY'] },
    { field: 'barangay', label: 'Barangay (Required)', required: true, description: 'Official Talibon barangay name or code', datasetTypes: ['BENEFICIARY_REGISTRY'] },
    { field: 'addressStreet', label: 'Purok / Sitio / Street', required: false, description: 'Local street or zone address', datasetTypes: ['BENEFICIARY_REGISTRY'] },
    { field: 'contactNumber', label: 'Contact Number', required: false, description: 'Phone or mobile number', datasetTypes: ['BENEFICIARY_REGISTRY'] },
    { field: 'householdNo', label: 'Household Number', required: false, description: 'Assigned Household ID / 4Ps ID', datasetTypes: ['BENEFICIARY_REGISTRY'] },
    { field: 'is4Ps', label: '4Ps Beneficiary (Yes/No)', required: false, description: 'Pantawid Pamilya beneficiary flag', datasetTypes: ['BENEFICIARY_REGISTRY'] },
    { field: 'isIndigent', label: 'Indigent (Yes/No)', required: false, description: 'Indigency classification', datasetTypes: ['BENEFICIARY_REGISTRY'] },
    { field: 'program', label: 'Program / Service Availed', required: false, description: 'Name of GAD program or service', datasetTypes: ['BENEFICIARY_REGISTRY'] },
    { field: 'office', label: 'Implementing Office', required: false, description: 'LGU department code or name', datasetTypes: ['BENEFICIARY_REGISTRY'] },
    { field: 'remarks', label: 'Remarks / Notes', required: false, description: 'Additional notes', datasetTypes: ['BENEFICIARY_REGISTRY'] },
  ],
  HOUSEHOLD_SURVEY: [
    { field: 'householdNo', label: 'Household Number (Required)', required: true, description: 'Unique household identification number', datasetTypes: ['HOUSEHOLD_SURVEY'] },
    { field: 'barangay', label: 'Barangay (Required)', required: true, description: 'Official Talibon barangay name or code', datasetTypes: ['HOUSEHOLD_SURVEY'] },
    { field: 'headName', label: 'Head of Household Name', required: false, description: 'Full name of the household head', datasetTypes: ['HOUSEHOLD_SURVEY'] },
    { field: 'is4Ps', label: '4Ps Beneficiary (Yes/No)', required: false, description: '4Ps membership status', datasetTypes: ['HOUSEHOLD_SURVEY'] },
    { field: 'isIndigent', label: 'Indigent Status (Yes/No)', required: false, description: 'Indigent classification flag', datasetTypes: ['HOUSEHOLD_SURVEY'] },
    { field: 'income', label: 'Monthly Household Income', required: false, description: 'Monthly income in PHP', datasetTypes: ['HOUSEHOLD_SURVEY'] },
    { field: 'purok', label: 'Purok / Zone', required: false, description: 'Purok or zone within barangay', datasetTypes: ['HOUSEHOLD_SURVEY'] },
    { field: 'membersCount', label: 'Total Family Members', required: false, description: 'Count of household residents', datasetTypes: ['HOUSEHOLD_SURVEY'] },
    { field: 'remarks', label: 'Remarks / Notes', required: false, description: 'Survey enumerator notes', datasetTypes: ['HOUSEHOLD_SURVEY'] },
  ],
  PROGRAM_CATALOG: [
    { field: 'title', label: 'Program Title (Required)', required: true, description: 'Title or name of GAD program', datasetTypes: ['PROGRAM_CATALOG'] },
    { field: 'sector', label: 'Target Sector (Required)', required: true, description: 'Target beneficiary sector', datasetTypes: ['PROGRAM_CATALOG'] },
    { field: 'fiscalYear', label: 'Fiscal Year', required: false, description: 'Implementation year (e.g. 2026)', datasetTypes: ['PROGRAM_CATALOG'] },
    { field: 'budgetTarget', label: 'Budget Target (PHP)', required: false, description: 'Approved GAD budget allocation', datasetTypes: ['PROGRAM_CATALOG'] },
    { field: 'targetMale', label: 'Target Male Beneficiaries', required: false, description: 'Target male participant count', datasetTypes: ['PROGRAM_CATALOG'] },
    { field: 'targetFemale', label: 'Target Female Beneficiaries', required: false, description: 'Target female participant count', datasetTypes: ['PROGRAM_CATALOG'] },
    { field: 'office', label: 'Implementing Office', required: false, description: 'Responsible LGU department', datasetTypes: ['PROGRAM_CATALOG'] },
    { field: 'status', label: 'Status', required: false, description: 'DRAFT, ACTIVE, COMPLETED, CANCELLED', datasetTypes: ['PROGRAM_CATALOG'] },
  ],
  GAD_ACCOMPLISHMENT: [
    { field: 'programTitle', label: 'Program Title / Reference (Required)', required: true, description: 'Associated GAD program name or ID', datasetTypes: ['GAD_ACCOMPLISHMENT'] },
    { field: 'actualBudget', label: 'Actual Budget Expended (PHP)', required: false, description: 'Disbursed budget amount', datasetTypes: ['GAD_ACCOMPLISHMENT'] },
    { field: 'actualMale', label: 'Actual Male Beneficiaries', required: false, description: 'Actual male participants served', datasetTypes: ['GAD_ACCOMPLISHMENT'] },
    { field: 'actualFemale', label: 'Actual Female Beneficiaries', required: false, description: 'Actual female participants served', datasetTypes: ['GAD_ACCOMPLISHMENT'] },
    { field: 'accomplishmentDetails', label: 'Accomplishment Narrative', required: false, description: 'Key milestones achieved', datasetTypes: ['GAD_ACCOMPLISHMENT'] },
    { field: 'challengesEncountered', label: 'Challenges / Bottlenecks', required: false, description: 'Issues met during execution', datasetTypes: ['GAD_ACCOMPLISHMENT'] },
    { field: 'dateReported', label: 'Date Reported', required: false, description: 'Accomplishment reporting date', datasetTypes: ['GAD_ACCOMPLISHMENT'] },
  ],
};

export const DATASET_TYPE_LABELS: Record<IngestionDatasetType, { label: string; description: string }> = {
  BENEFICIARY_REGISTRY: {
    label: 'Beneficiary Registry',
    description: 'Citizen demographic profiles, sectors, and availed services',
  },
  HOUSEHOLD_SURVEY: {
    label: 'Household Survey',
    description: 'Household numbers, poverty status, and socio-economic survey data',
  },
  PROGRAM_CATALOG: {
    label: 'Program Catalog',
    description: 'GAD PPAs, budget allocations, and gender target beneficiaries',
  },
  GAD_ACCOMPLISHMENT: {
    label: 'GAD Accomplishments',
    description: 'Actual expenditures, physical accomplishment narratives, and gender counts',
  },
};

export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
