import { Context } from "../models/context.model";

export function getWatchedOffersTitledLinks() {
  return Array.from(document.getElementsByClassName("om-title")).map(
    (element) => ({
      title: element.textContent!.trim(),
      link: (element as HTMLAnchorElement).href,
    })
  );
}

export function scrapeOffer(context: Context) {
  const location = getLocation();
  const vatInvoice = getVatInvoice();
  const price = getPrice();
  const year = getOfferParam("Rok produkcji") as number;
  const mileage = getOfferParam("Przebieg") as number;
  const bodyType = getOfferParam("Typ") as string;
  const fuelType = getFuelType();
  const transmissionType = getTransmissionType();

  return {
    title: context.data.title,
    location,
    vatInvoice,
    price,
    year,
    mileage,
    bodyType,
    fuelType,
    transmissionType,
  };

  function getLocation() {
    return document
      .getElementsByClassName("seller-box__seller-address__label")[0]
      .textContent!.trim();
  }

  function getVatInvoice() {
    return document
      .getElementsByClassName("offer-price__details")[0]
      .textContent!.includes("VAT");
  }

  function getPrice() {
    return Number(
      /\d+/
        .exec(
          document.getElementsByClassName("offer-price_number")[0].textContent!
        )![0]
        .replace(/ /g, "")
    );
  }

  function getOfferParam(paramName: string): any {
    return Array.from(document.getElementsByClassName("offer-params__item"))
      .filter(
        (element) =>
          element
            .getElementsByClassName("offer-params__label")[0]
            .textContent!.trim() === paramName
      )[0]
      .getElementsByClassName("offer-params__value")[0]
      .textContent!.trim();
  }

  function getFuelType() {
    return getOfferParam("Rodzaj paliwa") === "Benzyna"
      ? context.extras.FuelType.GAS
      : context.extras.FuelType.DIESEL;
  }

  function getTransmissionType() {
    return getOfferParam("Skrzynia biegów") !== "Manualna"
      ? context.extras.TransmissionType.MANUAL
      : context.extras.TransmissionType.AUTO;
  }
}
