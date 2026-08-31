export type IngestionStep =
  | 'UPLOAD'
  | 'DISCOVERY'
  | 'MAPPING'
  | 'PREVIEW'
  | 'CONFIRM'
  | 'EXECUTING'
  | 'SUCCESS'
  | 'ERROR';

export type IngestionDatasetType =
  | 'BENEFICIARY_REGISTRY'
  | 'HOUSEHOLD_SURVEY'
  | 'PROGRAM_CATALOG'
  | 'GAD_ACCOMPLISHMENT';

export type DuplicateStrategy = 'SKIP' | 'UPDATE' | 'APPEND';
export type IngestionMode = 'STRICT' | 'TOLERANT';

export interface ColumnProfile {
  name: string;
  normalizedName: string;
  detectedType: string;
  totalValues: number;
  nonEmptyValues: number;
  emptyValues: number;
  uniqueValuesCount: number;
  sampleValues: string[];
  inferredTargetField: string | null;
  targetFieldConfidence: number;
  isLikelyIdentifier: boolean;
  isLikelyBarangay: boolean;
  isLikelyOffice: boolean;
  isLikelySector: boolean;
  isLikelySex: boolean;
  isLikelyAgeOrBirthdate: boolean;
  unrecognizedCategoryValues: string[];
  notes: string[];
}

export interface CsvToTagadFieldMapping {
  sourceColumn: string;
  tagadDestinationField: string;
  targetModel: string;
  dataType: string;
  required: boolean;
  transformationRule: string;
  validationRule: string;
  defaultValue: string | null;
  notes: string;
}

export interface CsvDiscoverySummary {
  datasetTypeGuess: IngestionDatasetType | 'UNKNOWN';
  readinessScore: number;
  hasRequiredIdentityFields: boolean;
  hasBarangayField: boolean;
  hasGenderField: boolean;
  recommendations: string[];
}

export interface CsvDiscoveryResult {
  filename?: string;
  totalRows: number;
  totalColumns: number;
  rawHeaders: string[];
  normalizedHeaders: string[];
  columns: Record<string, ColumnProfile>;
  schemaMapping: CsvToTagadFieldMapping[];
  potentialDuplicateColumns: string[];
  unknownColumns: string[];
  unsupportedColumns: string[];
  summary: CsvDiscoverySummary;
}

export interface RowValidationIssue {
  rowNumber: number;
  field: string;
  value: any;
  severity: 'ERROR' | 'WARNING';
  message: string;
}

export interface IngestionPreviewRow {
  rowNumber: number;
  status: 'VALID' | 'WARNING' | 'ERROR' | 'DUPLICATE';
  canonicalData: Record<string, any>;
  rawRow: Record<string, string>;
  issues: RowValidationIssue[];
  isDuplicate?: boolean;
  existingId?: string;
}

export interface IngestionPreviewResult {
  datasetType: IngestionDatasetType;
  totalRows: number;
  validRows: number;
  warningRows: number;
  errorRows: number;
  duplicateRows: number;
  duplicateStrategy: DuplicateStrategy;
  ingestionMode: IngestionMode;
  targetOfficeId: string | null;
  targetOfficeName?: string | null;
  canProceed: boolean;
  sampleRows: IngestionPreviewRow[];
  rowIssues: RowValidationIssue[];
}

export interface IngestionExecutionSummary {
  batchId: string;
  datasetType: IngestionDatasetType;
  filename?: string;
  duplicateStrategy: DuplicateStrategy;
  ingestionMode: IngestionMode;
  totalRows: number;
  insertedCount: number;
  updatedCount: number;
  skippedCount: number;
  errorCount: number;
  processingTimeMs: number;
  errors: RowValidationIssue[];
  warnings: RowValidationIssue[];
  success: boolean;
}

export interface ColumnMappingSelection {
  sourceColumn: string;
  targetField: string;
  required: boolean;
  confidence: number;
}

export interface ReferenceOffice {
  id: string;
  code: string;
  name: string;
  isActive: boolean;
}

export interface ReferenceBarangay {
  id: string;
  code: string;
  name: string;
}

export interface CanonicalFieldOption {
  field: string;
  label: string;
  required?: boolean;
  description?: string;
  datasetTypes: IngestionDatasetType[];
}
