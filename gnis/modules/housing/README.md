# Housing Module

## Overview

The Housing module provides geospatial data and analytics for housing, real estate, and residential development across the GNIS infrastructure.

## Data Categories

### 1. Housing Units
- Single-family homes
- Multi-family buildings
- Apartments and condominiums
- Mobile homes and manufactured housing

### 2. Affordable Housing
- Public housing developments
- Section 8 properties
- Low-Income Housing Tax Credit (LIHTC) properties
- Rent-controlled units

### 3. Market Data
- Home prices and valuations
- Rental rates
- Vacancy rates
- Sales volume and trends

### 4. Housing Access
- Fair housing compliance
- Accessibility features (ADA)
- Transit proximity
- Service proximity (schools, hospitals, stores)

## Schema Extension

The Housing module extends the canonical geo-object with:

```json
{
  "properties": {
    "housing": {
      "type": "residential | commercial | mixed",
      "units": 150,
      "affordableUnits": 30,
      "medianRent": 2500,
      "medianPrice": 750000,
      "yearBuilt": 1985,
      "lastRenovated": 2020,
      "accessibility": {
        "adaCompliant": true,
        "elevators": 2,
        "ramps": true
      },
      "amenities": ["parking", "laundry", "gym"],
      "transitAccess": {
        "nearestStation": "Metro Center",
        "distanceMeters": 450,
        "walkScore": 92
      }
    }
  }
}
```

## Data Sources

- **HUD (Housing and Urban Development)**: Affordable housing data
- **Census Bureau**: Housing unit counts and characteristics
- **Local Property Records**: Valuation and sales data
- **Fair Housing Centers**: Compliance and accessibility data

## Use Cases

1. **Affordable Housing Analysis**: Identify gaps in affordable housing supply
2. **Housing Market Trends**: Track price and rental trends
3. **Accessibility Mapping**: Map ADA-compliant housing options
4. **Transit-Oriented Development**: Identify areas for TOD investment
5. **Fair Housing Compliance**: Monitor and enforce fair housing laws

---

**Status**: ✅ Active  
**Maintained by**: Housing Data Team
