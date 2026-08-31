import api from './axios';
import {
  StatisticalTableCatalogItem,
  DomainSummary,
  StatisticalDimensionItem,
  CatalogFilterParams,
} from '../types/statisticalCatalog';

export interface PaginatedTablesResponse {
  data: StatisticalTableCatalogItem[];
  total: number;
  page?: number;
  limit?: number;
  totalPages?: number;
}

export const getStatisticalTables = async (
  params?: CatalogFilterParams
): Promise<StatisticalTableCatalogItem[] | PaginatedTablesResponse> => {
  const response = await api.get('/statistical-catalog/tables', { params });
  return response.data?.data || response.data;
};

export const getStatisticalTableByCode = async (
  tableCodeOrNumber: string | number
): Promise<StatisticalTableCatalogItem> => {
  const response = await api.get(`/statistical-catalog/tables/${tableCodeOrNumber}`);
  return response.data?.data || response.data;
};

export const getStatisticalDomains = async (): Promise<DomainSummary[]> => {
  const response = await api.get('/statistical-catalog/domains');
  return response.data?.data || response.data;
};

export const getStatisticalDimensions = async (): Promise<StatisticalDimensionItem[]> => {
  const response = await api.get('/statistical-catalog/dimensions');
  return response.data?.data || response.data;
};
