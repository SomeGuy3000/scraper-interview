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
  const year = getParamAsNumber("Rok produkcji") as number;
  const mileage = getParamAsNumber("Przebieg") as number;
  const bodyType = getOfferParam("Typ nadwozia") as string;
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
      /\d+/.exec(
        document
          .getElementsByClassName("offer-price__number")[0]
          .textContent!.replace(/ /g, "")
      )![0]
    );
  }

  function getOfferParam(paramName: string): any {
    let param;
    let paramList = Array.from(
      document.getElementsByClassName("offer-params__item")
    ).filter(
      (element) =>
        element
          .getElementsByClassName("offer-params__label")[0]
          .textContent!.trim() === paramName
    )[0];

    if (paramList) {
      param = paramList
        .getElementsByClassName("offer-params__value")[0]
        .textContent!.trim();
    }
    return param;
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
  function getParamAsNumber(paramName: string) {
    return Number(/\d+/.exec(getOfferParam(paramName).replace(/ /g, "")));
  }
}
