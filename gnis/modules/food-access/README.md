# Food Access Module

## Overview

The Food Access module provides geospatial intelligence on food availability, nutrition resources, and food desert identification.

## Data Categories

### 1. Food Retailers
- Supermarkets and grocery stores
- Farmers markets
- Convenience stores
- Food cooperatives

### 2. Food Assistance
- SNAP-authorized retailers
- WIC vendors
- Food banks and pantries
- Meal distribution sites

### 3. Food Deserts
- Low-income areas with limited food access
- Distance to nearest supermarket
- Vehicle ownership rates
- Public transit access to food retailers

### 4. Nutrition Resources
- Community gardens
- Urban farms
- Nutrition education centers
- Healthy food initiatives

## Schema Extension

```json
{
  "properties": {
    "foodAccess": {
      "retailerType": "supermarket | convenience | farmers_market",
      "snapAuthorized": true,
      "wicVendor": true,
      "distanceToNearestSupermarket": 2.5,
      "vehicleOwnership": 0.65,
      "foodDesertStatus": "low_access",
      "healthyFoodAvailability": "medium",
      "operatingHours": {
        "monday": "08:00-22:00",
        "sunday": "09:00-20:00"
      },
      "acceptedPayments": ["cash", "credit", "snap", "wic"]
    }
  }
}
```

## Data Sources

- **USDA Food Access Research Atlas**: Food desert data
- **SNAP Retailer Locator**: SNAP-authorized stores
- **Local Health Departments**: Food safety and nutrition data
- **Farmers Market Directory**: Market locations and schedules

## Analysis Metrics

### Food Desert Criteria
- Urban: > 1 mile from supermarket
- Rural: > 10 miles from supermarket
- Low-income: Median family income ≤ 80% of state/metro median
- Low vehicle access: > 100 households without vehicle

### Healthy Food Availability Index
- 0.0-0.3: Low availability (food desert)
- 0.4-0.6: Medium availability
- 0.7-1.0: High availability (food oasis)

## Use Cases

1. **Food Desert Mapping**: Identify underserved areas
2. **SNAP Outreach**: Target enrollment efforts
3. **Urban Planning**: Site selection for new grocery stores
4. **Public Health**: Nutrition access analysis
5. **Emergency Response**: Food distribution planning

---

**Status**: ✅ Active  
**Maintained by**: Food Systems Team
