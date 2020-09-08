import { FuelType, Offer, TransmissionType } from "../models/offer.model";
import * as assert from "assert";

export function validateOffers(offers: Offer[]) {
  assert.ok(offers.length);
  for (const offer of offers) {
    validateField("offer", offer, "object");
    validateField("offer.year", offer.year, "number");
    validateField("offer.price", offer.price, "number");
    validateField("offer.mileage", offer.mileage, "number");
    validateField("offer.vatInvoice", offer.vatInvoice, "boolean");
    validateField("offer.title", offer.title, "string");
    validateField("offer.location", offer.location, "string");
    validateField("offer.bodyType", offer.bodyType, "string");
    validateField("offer.fuelType", offer.fuelType, FuelType);
    validateField(
      "offer.transmissionType",
      offer.transmissionType,
      TransmissionType
    );
  }
}

function validateField(
  name: string,
  value: any,
  type: string | object,
  required: boolean = true
) {
  try {
    if (!required && !value) {
      return;
    }
    assert.ok(value !== undefined);
    assert.ok(value !== null);
    assert.ok(value !== "");

    if (typeof type === "string") {
      assert.ok(typeof value === type);
    } else {
      assert.ok(Object.values(type).includes(value));
    }
  } catch (e) {
    const message = `Invalid value of ${name}: ${type} = ${value}`;
    const stack = new Error(message).stack || "";
    e.stack =
      e.stack +
      "\nCaused by: " +
      stack.split("\n").slice(0, 2).join("\n") +
      "\n";
    throw e;
  }
}
