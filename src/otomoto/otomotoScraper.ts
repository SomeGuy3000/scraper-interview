import { Credentials } from "../models/credentials.model";
import { Page } from "puppeteer";
import { FuelType, Offer, TransmissionType } from "../models/offer.model";
import { Context } from "../models/context.model";
import { runInPage } from "../scraping/runInPage";
import { getWatchedOffersTitledLinks, scrapeOffer } from "./otomotoFunctions";

export class OtomotoScraper {
  constructor(private readonly pageFactory: () => Promise<Page>) {}

  async scrape(credentials: Credentials): Promise<Offer[]> {
    return runInPage(this.pageFactory, async (page: Page) => {
      await this.login(page, credentials);
      const titledLinks = await this.getWatchedOffersTitledLinks(page);
      return await this.scrapeLinks(page, titledLinks);
    });
  }

  private async scrapeLinks(page, titledLinks: TitledLink[]) {
    const offers: Offer[] = [];
    for (const titledLink of titledLinks) {
      const offer = await this.scrapeOffer(page, titledLink);
      offers.push(offer);
    }
    return offers;
  }

  private async login(page: Page, credentials: Credentials) {
    await page.goto("https://www.otomoto.pl/konto/");
    await page.type("input.userEmail", credentials.username);
    await page.type("input.userPass", credentials.password);

    await Promise.all([
      page.waitForNavigation(),
      page.evaluate(() => (document.querySelector("[data-testid=sign-in-button]") as HTMLButtonElement).click()),
    ]);
  }

  private async getWatchedOffersTitledLinks(page: Page): Promise<TitledLink[]> {
    await page.goto("https://www.otomoto.pl/obserwowane");
    return await page.evaluate(getWatchedOffersTitledLinks);
  }

  private async scrapeOffer(page: Page, titledLink: TitledLink) {
    await page.goto(titledLink.link);
    const context: Context = {
      data: {
        title: titledLink.title,
      },
      extras: {
        FuelType,
        TransmissionType,
      },
    };
    return await page.evaluate(scrapeOffer, { ...context });
  }
}

interface TitledLink {
  title: string;
  link: string;
}
