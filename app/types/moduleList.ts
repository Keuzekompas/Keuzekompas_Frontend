export interface ModuleListResponse {
  _id: string;
  name: string;
  description: string;
  location: string;
  studycredit: number;
}

export interface PaginatedModuleListResponse {
  modules: ModuleListResponse[];
  total: number;
  page: number;
  pageSize: number;
}

export type Modules = ModuleListResponse[];
