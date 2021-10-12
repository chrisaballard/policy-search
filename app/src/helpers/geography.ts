export const getCountryNameFromCode = (code: string, geos): string => {
  const match = geos.filter((geo) => code === geo.code)
  return match[0].name;
}