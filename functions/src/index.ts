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
  const rider = (await db.collection("riders").doc(params.riderId).get()).data() as Rider;
  const offers = await db.collection("offers").get();
  const matched: Array<Offer> = [];

  offers.forEach((offerDoc) => {
    const offerData = offerDoc.data() as Offer;
    const offerDistance = calculateDistance(rider.location, offerData.location);
    // TODO: Clean up this logic to make it more readable
    const matchesCriteria = offerData.horse.requiredExperience <= rider.experience &&
                                (params.maxDistance === undefined || offerDistance <= params.maxDistance) &&
                                (params.isAuthorizedToCompete === undefined || offerData.horse.isAuthorizedToCompete === params.isAuthorizedToCompete) &&
                                (params.horseBreed === undefined || offerData.horse.breed === params.horseBreed) &&
                                (params.maxPrice === undefined || offerData.price <= params.maxPrice) &&
                                (params.minDuration === undefined || offerData.terms.minDuration >= params.minDuration) &&
                                (params.maxWalkingDistance === undefined || offerData.terms.maxDistance <= params.maxWalkingDistance);

    if (matchesCriteria) {
      matched.push(offerData);
    }
  });

  return matched;
}

