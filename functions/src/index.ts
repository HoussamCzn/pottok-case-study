import * as admin from "firebase-admin";
import {Offer, Rider} from "./models";
import {distance as calculateDistance} from "./distance";
import {https, logger} from "firebase-functions/v2";

admin.initializeApp();
const db = admin.firestore();

// TODO: Move this elsewhere
interface OfferOptions {
  riderId: string;
  maxDistance?: number;
  isAuthorizedToCompete?: boolean;
  horseBreed?: string;
  maxPrice?: number;
  minDuration?: number;
  maxWalkingDistance?: number;
}

/**
 * This function checks if a value is defined.
 *
 * @template T The type of the value to check.
 * @param {T | undefined} value The value to check.
 * @return {boolean} True if the value is defined.
 */
function isDefined<T>(value: T | undefined): value is T {
  return value !== undefined;
}

/**
 * This function evaluates a filter between two values, returning true
 * if the condition is met or if one of the values is undefined. If the
 * RHS is undefined, the function assumes the condition is met.
 * If the LHS is undefined but RHS is defined, the function assumes the
 * condition is not met.
 *
 * @template T The type of the values.
 * @param {T | undefined} lhs The left-hand side value to evaluate.
 * @param {T | undefined} rhs The right-hand side value to compare against.
 * @param {function(T, T): boolean} predicate The predicate to evaluate.
 * @return {boolean} True if the condition is met or if a value is undefined.
 */
function evaluateFilter<T>(
  lhs: T | undefined, rhs: T | undefined,
  predicate: (a: T, b: T) => boolean): boolean {
  return !isDefined(rhs) || !isDefined(lhs) || predicate(lhs, rhs);
}

/**
 * This function is called when a rider is looking for offers that match their
 * preferences including experience, location, and additional filters like
 * competition authorization, horse breed, price, and distance constraints.
 *
 * @param {OfferOptions} params Parameters including riderId, maxDistance,
 * and optional filters.
 * @return {Promise<Array<Offer>>} A promise that will be resolved with an
 * array of offers that match the rider's preferences.
 */
async function matchingOffers(params: OfferOptions): Promise<Array<Offer>> {
  const rider = (await db.collection("riders")
    .doc(params.riderId)
    .get()).data() as Rider;
  const offers = await db.collection("offers").get();
  const matched: Array<Offer> = [];

  offers.forEach((document) => {
    const offer = document.data() as Offer;
    const distance = calculateDistance(rider.location, offer.location);
    const matches: Array<boolean> = [
      evaluateFilter(
        distance,
        params.maxDistance, (a, b) => a <= b),
      evaluateFilter(
        offer.horse.isAuthorizedToCompete,
        params.isAuthorizedToCompete, (a, b) => a === b),
      evaluateFilter(
        offer.horse.breed,
        params.horseBreed, (a, b) => a === b),
      evaluateFilter(
        offer.price,
        params.maxPrice, (a, b) => a <= b),
      evaluateFilter(
        offer.terms.minDuration,
        params.minDuration, (a, b) => a >= b),
      evaluateFilter(
        offer.terms.maxDistance,
        params.maxWalkingDistance, (a, b) => a <= b),
    ];
    if (matches.every((value: boolean) => value == true)) {
      matched.push(offer);
    }
  });

  return matched;
}

export const offers = https.onRequest(async (req, res) => {
  const {
    riderId, maxDistance, isAuthorizedToCompete,
    horseBreed, maxPrice, minDuration, maxWalkingDistance,
  } = req.body;
  if (!riderId) {
    res.status(400).send("An ID is required to find matching offers.");
    return;
  }

  const params: OfferOptions = {
    riderId:
        riderId,
    maxDistance:
        maxDistance ? parseInt(maxDistance) : undefined,
    isAuthorizedToCompete:
        isAuthorizedToCompete ? Boolean(isAuthorizedToCompete) : undefined,
    horseBreed:
        horseBreed,
    maxPrice:
        maxPrice ? parseInt(maxPrice) : undefined,
    minDuration:
        minDuration ? parseInt(minDuration) : undefined,
    maxWalkingDistance:
        maxWalkingDistance ? parseInt(maxWalkingDistance) : undefined,
  };

  try {
    const offers = await matchingOffers(params);
    res.status(200).send(offers);
  } catch (e) {
    logger.error(e); // TODO: Remove this line after testing
    res.status(500).send(e);
  }
});
