import { base } from '$app/paths';
import { csvParse, tsvParse } from 'd3-dsv';

export async function load({ fetch, params }) {
  const city_response = await fetch(`${base}/cities_with_enough_data.csv`);
  const city_csv = await city_response.text();

  const cbsa_response = await fetch(`${base}/2020_Gaz_cbsa_national.txt`, {headers: {
    'Content-Type': 'text/plain' // Specify the content type as text/plain
  }});
  const cbsa_txt = await cbsa_response.text();
  return {
      city_data: csvParse(city_csv),
      cbsa: tsvParse(cbsa_txt)
  };
}
