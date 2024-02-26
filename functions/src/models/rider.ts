import {GeoPoint} from "firebase-admin/firestore";
import {Experience, User} from "../types";

export interface Rider extends User {
  location: GeoPoint;
  experience: Experience;
  isAuthorizedToCompete: boolean;
}
