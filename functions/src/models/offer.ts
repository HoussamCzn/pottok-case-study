import {GeoPoint} from "firebase-admin/firestore";
import {RentalTerms} from "../types";
import {Horse, Owner} from "../models";

export interface Offer {
  owner: Owner;
  location: GeoPoint;
  horse: Horse;
  terms: RentalTerms;
  price: number;
}
