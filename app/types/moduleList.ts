export interface ModuleListResponse {
  _id: string;
  name: string;
  description: string;
  location: string;
  studycredit: number;
}

export type Modules = ModuleListResponse[];
