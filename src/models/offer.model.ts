export interface Offer {
  title: string;
  location: string;
  vatInvoice: boolean;
  price: number;
  year: number;
  mileage: number;
  bodyType: string;
  fuelType: FuelType;
  transmissionType: TransmissionType;
}

export enum FuelType {
  GAS = "GAS",
  DIESEL = "DIESEL",
}

export enum TransmissionType {
  AUTO = "AUTO",
  MANUAL = "MANUAL",
}
