import {Horse} from "../models";
import {User} from "../types";

export interface Owner extends User {
  horses: Array<Horse>;
}
