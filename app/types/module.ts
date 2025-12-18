export interface Module {
  _id: string;
  name_en: string;
  description_en: string;
  studycredit: number;
  location: string;
  level: string;
  module_tags_en: string;
  start_date: string;
  available_spots: number;
  name_nl: string;
  description_nl: string;
  module_tags_nl: string;
}

export type Modules = Module[];
