import { OtomotoScraper } from "./otomoto/otomotoScraper";
import { Credentials } from "./models/credentials.model";
import { Offer } from "./models/offer.model";
import { runInBrowser } from "./scraping/runInBrowser";
import { validateOffers } from "./validation/otomotoValidator";

function getEnv(envName: string): string {
  const value = process.env[envName];
  if (value) {
    return value;
  } else {
    throw `Could not find environment variable: ${envName}`;
  }
}

(async () => {
  const credentials: Credentials = {
    username: getEnv("OTOMOTO_USERNAME"),
    password: getEnv("OTOMOTO_PASSWORD"),
  };

  const offers: Offer[][] = await runInBrowser(async (browser) =>
    new OtomotoScraper(() => browser.newPage()).scrape(credentials)
  );

  validateOffers(offers);

  console.log(JSON.stringify(offers, null, 2));
})().catch((err) => console.error(err));
