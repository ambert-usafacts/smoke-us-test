import { base } from '$app/paths';
import { csvParse, tsvParse } from 'd3-dsv';

export async function load({ fetch, params }) {
  const city_response = await fetch(`${base}/cities_with_enough_data.csv`);
  const city_csv = await city_response.text();

  const cbsa_response = await fetch(`${base}/cbsa_boundaries.csv`);
  const cbsa_txt = await cbsa_response.text();

  const projection_response = await fetch(`${base}/us-states.topojson.json`)

  const projection_txt = await projection_response.text()
  return {
      city_data: csvParse(city_csv),
      cbsa: csvParse(cbsa_txt),
      us_states: JSON.parse(projection_txt)
  };
}
