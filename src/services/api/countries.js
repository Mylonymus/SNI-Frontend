import citiesByCountries from '@/services/statics/citiesByCountries.json'

export function getAllCountries() {
  return Object.keys(citiesByCountries)
}
export function getCitiesByCountry(country) {
  return citiesByCountries[country]
}
