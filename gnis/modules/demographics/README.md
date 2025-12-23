# Demographics Module

## Overview

The Demographics module provides population, census, and socioeconomic data for geographic areas at multiple scales (nation, state, county, tract, block).

## Data Categories

### 1. Population Characteristics
- Total population
- Population density
- Age distribution
- Gender distribution
- Household composition

### 2. Race and Ethnicity
- Racial categories (Census Bureau definitions)
- Hispanic/Latino ethnicity
- Ancestry and origin
- Language spoken at home

### 3. Economic Indicators
- Median household income
- Poverty rates
- Employment status
- Industry and occupation
- Educational attainment

### 4. Housing Characteristics
- Homeownership rates
- Housing costs (rent, mortgage)
- Housing units and vacancy
- Housing age and condition

## Schema Extension

```json
{
  "properties": {
    "demographics": {
      "population": {
        "total": 50000,
        "density": 2500,
        "year": 2020,
        "growthRate": 0.015
      },
      "age": {
        "median": 35.2,
        "under18": 0.22,
        "over65": 0.15
      },
      "race": {
        "white": 0.45,
        "black": 0.25,
        "asian": 0.20,
        "hispanic": 0.30,
        "other": 0.10
      },
      "economic": {
        "medianIncome": 75000,
        "povertyRate": 0.12,
        "unemploymentRate": 0.04,
        "giniIndex": 0.42
      },
      "education": {
        "highSchool": 0.88,
        "bachelors": 0.45,
        "graduate": 0.18
      },
      "housing": {
        "homeownershipRate": 0.62,
        "medianHomeValue": 450000,
        "medianRent": 2000,
        "vacancyRate": 0.05
      }
    }
  }
}
```

## Data Sources

- **US Census Bureau**: Decennial Census, ACS (American Community Survey)
- **BLS (Bureau of Labor Statistics)**: Employment and economic data
- **State Agencies**: State-level population estimates
- **Local Governments**: Municipal demographic data

## Analysis Metrics

### Demographic Diversity
- **Simpson's Diversity Index**: Measures racial/ethnic diversity
- **Segregation Indices**: Dissimilarity, isolation indices
- **Integration Score**: Multiracial neighborhood analysis

### Economic Vitality
- **Economic Mobility Index**: Opportunity for advancement
- **Gini Coefficient**: Income inequality measure (0-1)
- **Poverty Concentration**: Spatial clustering of poverty

### Social Vulnerability
- **CDC SVI**: Social Vulnerability Index
- **Factors**: Poverty, minority status, language, housing, disability

## Use Cases

1. **Resource Allocation**: Target services to high-need areas
2. **Equity Analysis**: Identify disparities and inequities
3. **Market Research**: Understand consumer demographics
4. **Policy Planning**: Evidence-based policy decisions
5. **Grant Applications**: Document community needs

## Privacy and Ethics

### Data Protection
- **Aggregation**: Data provided at census block level or higher
- **Suppression**: Small counts (<5) suppressed to protect privacy
- **Noise Injection**: Differential privacy applied to protect individuals

### Ethical Use
- Avoid reinforcing stereotypes or discrimination
- Use for equitable resource distribution
- Respect community concerns and feedback
- Follow fair housing and civil rights laws

---

**Status**: ✅ Active  
**Maintained by**: Demographics Analysis Team
