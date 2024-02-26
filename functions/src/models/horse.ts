import {Experience} from "../types";

export interface Horse {
  name: string;
  breed: string;
  requiredExperience: Experience;
  isAuthorizedToCompete: boolean;
}
