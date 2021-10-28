import { Geography } from "./geography";
import { Instrument } from "./instrument";
import { Sector } from "./sector";
import { YearRange } from "./yearRange";

export interface Filters {
  geographyFilters: Geography[];
  instrumentFilters: Instrument[];
  sectorFilters: Sector[];
  yearFilters: YearRange;
}