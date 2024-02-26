# Strategy
- [Strategy](#strategy)
  - [Overview](#overview)
  - [Matching Criteria](#matching-criteria)
  - [Functionality](#functionality)

## Overview

The matching function in this system is designed to match riders with horse rental offers based on specified criteria. This document outlines the strategy employed by the matching function to ensure riders are presented with offers that best meet their preferences and requirements.

## Matching Criteria

The matching function considers the following criteria to match riders with offers:

- **Experience Level**: Ensures the rider's experience level meets or exceeds the minimum required experience level for the horse. It cannot be higher than the rider's experience level.
- **Location**: Matches offers based on the rider's location and specified maximum distance to the offer's location.
- **Competition Authorization**: Filters offers based on whether the horse is authorized to compete, if specified by the rider.
- **Horse Breed**: Matches offers based on the preferred horse breed, if specified by the rider.
- **Price**: Filters offers based on the maximum price willing to be paid by the rider.
- **Minimum Duration**: Ensures the offer's minimum rental duration meets the rider's requirements.
- **Maximum Walking Distance**: Filters offers based on the maximum walking distance to the horse's location, if specified.

## Functionality

The matching function operates as follows:

1. **Retrieve Rider Information**: Fetches the rider's details, including location and experience level, based on the provided rider ID.
2. **Fetch Offers**: Retrieves all offers from the database.
3. **Filter Offers**: Iterates through each offer and applies the following checks:
   - The horse's required experience level does not exceed the rider's experience.
   - The distance between the rider's location and the offer's location is within the specified maximum distance. **If none is specified, the rider's location is discarded**.
   - If competition authorization is required, the horse is authorized to compete.
   - The offer matches the specified horse breed, if any. **It is sensible to mispells**.
   - The offer's price does not exceed the specified maximum price.
   - The offer's minimum duration meets or exceeds the rider's requirement. **It is counted in days**.
   - The offer's maximum walking distance is within the specified limit, if any.

4. **Matched Offers**: Compiles a list of offers that meet all specified criteria.
