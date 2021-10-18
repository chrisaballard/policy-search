import { Geography } from "./geography";
import { Instrument } from "./instrument";
import { Sector } from "./sector";

export interface Filters {
  geographyFilters: Geography[];
  instrumentFilters: Instrument[];
  sectorFilters: Sector[];
}