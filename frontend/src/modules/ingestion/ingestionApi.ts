import api from '../../api/axios';
import {
  CsvDiscoveryResult,
  IngestionPreviewResult,
  IngestionExecutionSummary,
  IngestionDatasetType,
  DuplicateStrategy,
  IngestionMode,
  ReferenceOffice,
  ReferenceBarangay,
} from './types';

export interface PreviewRequestPayload {
  csvContent: string;
  filename?: string;
  datasetType?: IngestionDatasetType;
  confirmedMappings?: Array<{ sourceColumn: string; targetField: string }> | Record<string, string>;
  duplicateStrategy?: DuplicateStrategy;
  ingestionMode?: IngestionMode;
  targetOfficeId?: string | null;
}

export interface ExecuteRequestPayload {
  csvContent: string;
  filename?: string;
  datasetType?: IngestionDatasetType;
  confirmedMappings?: Array<{ sourceColumn: string; targetField: string }> | Record<string, string>;
  duplicateStrategy?: DuplicateStrategy;
  ingestionMode?: IngestionMode;
  targetOfficeId?: string | null;
}

export const ingestionApi = {
  /**
   * Step 1 -> 2: Discover and profile raw CSV schema
   */
  async discoverSchema(csvContent: string, filename?: string): Promise<CsvDiscoveryResult> {
    const response = await api.post('/admin/ingestion/discover-schema', {
      csvContent,
      filename: filename || 'dataset.csv',
    });
    return response.data?.data as CsvDiscoveryResult;
  },

  /**
   * Step 2 -> 3: Generate dry-run preview and row-level validation matrix
   */
  async generatePreview(payload: PreviewRequestPayload): Promise<IngestionPreviewResult> {
    const response = await api.post('/admin/ingestion/preview', payload);
    return response.data?.data as IngestionPreviewResult;
  },

  /**
   * Step 3 -> 4: Execute transactional batch ingestion
   */
  async executeIngestion(payload: ExecuteRequestPayload): Promise<IngestionExecutionSummary> {
    const response = await api.post('/admin/ingestion/execute', payload);
    return response.data?.data as IngestionExecutionSummary;
  },

  /**
   * Load canonical LGU offices for target office selection (Admin role)
   */
  async getOffices(): Promise<ReferenceOffice[]> {
    try {
      const response = await api.get('/admin/offices');
      return (response.data?.data || []) as ReferenceOffice[];
    } catch {
      // Fallback to public offices endpoint
      try {
        const publicRes = await api.get('/public/offices');
        return (publicRes.data?.data || []) as ReferenceOffice[];
      } catch {
        return [];
      }
    }
  },

  /**
   * Load canonical 25 Talibon barangays for display/filtering
   */
  async getBarangays(): Promise<ReferenceBarangay[]> {
    try {
      const response = await api.get('/admin/barangays');
      return (response.data?.data || []) as ReferenceBarangay[];
    } catch {
      try {
        const publicRes = await api.get('/public/barangays');
        return (publicRes.data?.data || []) as ReferenceBarangay[];
      } catch {
        return [];
      }
    }
  },
};
