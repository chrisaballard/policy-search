import { getGeographies } from "../api";

export const getCountryNameFromCode = async (code: string, geos): Promise<string> => {
  // const geos = await getGeographies();
  const match = geos.filter((geo) => code === geo.code)
  return match[0].name;
}