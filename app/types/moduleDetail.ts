export interface ModuleDetailResponse {
  _id: string;
  name: string;
  description: string;
  location: string;
  studycredit: number;
  level: string;
  available_spots: number;
  start_date: string;
  module_tags: string | string[];
}

export type Modules = ModuleDetailResponse[];
