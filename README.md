# Pottok Case Study
- [Pottok Case Study](#pottok-case-study)
  - [Overview](#overview)
  - [Prerequisites](#prerequisites)
  - [Explanation](#explanation)
  - [Usage](#usage)
    - [Matching Offers](#matching-offers)
  - [Database Schema](#database-schema)
    - [Structures](#structures)
  - [License](#license)

## Overview

This system is designed to match riders with horse rental offers that meet their specific needs and preferences. The system filters offers based on experience level, location, competition authorization, horse breed, price, and distance constraints.

## Prerequisites

- Node.js (v18.x or later)
- Firebase CLI
- A Firebase project

## Explanation

For more details on how the matching algorithm was imagined, please refer to the [STRATEGY](STRATEGY.md) document.

## Usage

You can try by yourself the API from Insomnia or Postman as the API is hosted.
Here is the API link: [https://offers-itv4wefyzq-uc.a.run.app](https://offers-itv4wefyzq-uc.a.run.app)

### Matching Offers

- The system exposes a Cloud Function endpoint to find matching offers based on the rider's preferences.
- Send a **POST** request to the deployed Cloud Function URL with the rider's preferences in the body:

```json
{
  "riderId": "0Uv03WFJKT2uWPSKwtzF",
  "maxDistance": 2500000,
  "isAuthorizedToCompete": true,
  "horseBreed": "Russian Heavy Draft",
  "maxPrice": 150,
  "minDuration": 10,
  "maxWalkingDistance": 5000
}
```

- The response will include an array of offers that match the criteria.

## Database Schema

The system uses Firestore to manage the data. Here's an overview of the collections and their documents:

- **Horses**: Included as part of the offers, detailing the horse's breed, required experience, and competition eligibility.
- **Riders**: Stores information about riders, including their experience level and location.
- **Owners**: Stores information about owners, such as their horses.
- **Offers**: Contains rental offers with details about the horse, rental terms, and owner.

### Structures

**Horses Collection**

```json
{
  "name": "John",
  "breed": "An awesome horse breed",
  "requiredExperience": 5,
  "isAuthorizedToCompete": true
}
```

**Owners Collection**

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "horses": [{
    // ...
  }]
}
```

**Riders Collection**

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "location": { "_latitude": 0, "_longitude": 0 },
  "experience": 5,
  "isAuthorizedToCompete": true
}
```

**Offers Collection**

```json
{
  "owner": { "Ref": "Owners/owner123" },
  "location": { "_latitude": 0, "_longitude": 0 },
  "horse": { "Ref": "Horses/horse123" },
  "terms": { "minDuration": 60, "maxDistance": 1000 },
  "price": 300
}
```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE.md) file for more informations.
