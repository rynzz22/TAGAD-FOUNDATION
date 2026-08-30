# TAGAD STATISTICAL TABLE LAYOUT CONTRACTS (69 PSA CBMS TABLES)
**System:** Talibon Analytics for Gender and Development (TAGAD)  
**Version:** `v2.0.0`  
**Status:** `[CANONICAL CONTRACT SPECIFICATION]`  
**Engineering Directive:** BUILD WHAT IS VERIFIED • VALIDATE WHAT IS IMPLEMENTED • DESIGN WHAT IS UNKNOWN • NEVER FABRICATE GOVERNMENT DATA  

---

## 1. Layout Contract Architecture

Official PSA CBMS tabulations are published as cross-tabulated matrix spreadsheets. TAGAD establishes a strict **Conceptual Layout Contract** that separates:
1. **Thematic Intent & Dimensions (`[VERIFIED]`):** The demographic, socio-economic, and geographic variables targeted by the table.
2. **Physical Column Positions & Banner Depth (`[UNKNOWN]` until authentic file inspection):** The exact number of header banner rows, column indices, and cell coordinates.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       LAYOUT ADAPTER CONTRACT PATTERN                       │
├─────────────────────────────────────────────────────────────────────────────┤
│ 1. Header Banner Detection: 1 to 4 rows deep, multi-level spans.            │
│ 2. Stub/Spatial Axis: First column(s) resolve to Barangay / Municipal Total.│
│ 3. Dimension Axes: Column headers map to JSONB dimension tuples.            │
│ 4. Fact Cell: Numeric matrix intersection parsed to Decimal(18,4).          │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Table Layout Contracts (Tables 1 through 70)

### Domain 1: Demography & Population
* **Table 1: Summary statistics**
  * *Expected Spatial Grain:* Municipal / Barangay (`[VERIFIED]`)
  * *Dimensions:* `[]` (Baseline population aggregates)
  * *Measures:* Responding Households (`count`), Covered Population (`count`), Average Household Size (`average`)
  * *Layout Type:* Multicolumn Metric Table | *Physical Layout:* `[UNKNOWN]`
* **Table 2: Households by size**
  * *Expected Spatial Grain:* Municipal / Barangay (`[VERIFIED]`)
  * *Dimensions:* `household_size_bracket` (e.g. 1, 2, 3, 4, 5, 6+)
  * *Measures:* Household Count (`count`)
  * *Layout Type:* 2D Matrix Cross-tab | *Physical Layout:* `[UNKNOWN]`
* **Table 24: Population by sex**
  * *Expected Spatial Grain:* Municipal / Barangay (`[VERIFIED]`)
  * *Dimensions:* `sex` (`Male`, `Female`, `Total`)
  * *Measures:* Population Count (`count`), Sex Ratio (`ratio`)
  * *Layout Type:* 2D Matrix Cross-tab | *Physical Layout:* `[UNKNOWN]`
* **Table 25: Population by age group**
  * *Expected Spatial Grain:* Municipal / Barangay (`[VERIFIED]`)
  * *Dimensions:* `sex` $\times$ `age_group` (5-year cohorts: 0-4, 5-9, ... 80+)
  * *Measures:* Population Count (`count`)
  * *Layout Type:* 3D Matrix Cross-tab (Nested Headers) | *Physical Layout:* `[UNKNOWN]`
* **Table 26: Population by ethnicity**
  * *Expected Spatial Grain:* Municipal / Barangay (`[VERIFIED]`)
  * *Dimensions:* `ethnicity` / `indigenous_affiliation`
  * *Measures:* Population Count (`count`)
  * *Layout Type:* 2D Matrix Cross-tab | *Physical Layout:* `[UNKNOWN]`
* **Table 27: Senior citizen ID**
  * *Expected Spatial Grain:* Municipal / Barangay (`[VERIFIED]`)
  * *Dimensions:* `senior_id_ownership` (`With ID`, `Without ID`), `sex`
  * *Measures:* Population Aged 60+ Count (`count`)
  * *Layout Type:* 2D/3D Matrix Cross-tab | *Physical Layout:* `[UNKNOWN]`

---

### Domain 2: Living Conditions & Housing
* **Tables 11–15: Building Type, Roof, Outer Walls, Floor, Tenure Status**
  * *Expected Spatial Grain:* Municipal / Barangay (`[VERIFIED]`)
  * *Dimensions:* Material/Category specific per table (e.g. `roof_material`, `wall_material`, `tenure_status`)
  * *Measures:* Household Count (`count`), Proportion (`percent`)
  * *Layout Type:* 2D Matrix Cross-tab | *Physical Layout:* `[UNKNOWN]`
* **Tables 18–19: Access to Secure Tenure & Overcrowding Status**
  * *Expected Spatial Grain:* Municipal / Barangay (`[VERIFIED]`)
  * *Dimensions:* `tenure_security_status`, `overcrowding_status`
  * *Measures:* Household Count (`count`), Proportion (`percent`)
  * *Layout Type:* 2D Matrix Cross-tab | *Physical Layout:* `[UNKNOWN]`
* **Tables 49–51: Floor, Roof, Outer Wall Material Strength**
  * *Expected Spatial Grain:* Municipal / Barangay (`[VERIFIED]`)
  * *Dimensions:* `material_strength` (`Strong`, `Light`, `Salvaged`, `Mixed`)
  * *Measures:* Household Count (`count`), Proportion (`percent`)
  * *Layout Type:* 2D Matrix Cross-tab | *Physical Layout:* `[UNKNOWN]`

---

### Domain 3: Water, Sanitation & Hygiene (WASH)
* **Tables 5–6: Main Source of Water Supply & Drinking Water**
  * *Expected Spatial Grain:* Municipal / Barangay (`[VERIFIED]`)
  * *Dimensions:* `water_source_type` (Piped, Dug Well, Spring, Rainwater, Bottled, etc.)
  * *Measures:* Household Count (`count`)
  * *Layout Type:* 2D Matrix Cross-tab | *Physical Layout:* `[UNKNOWN]`
* **Tables 7, 9, 10: Drinking Water, Toilet & Handwashing Service Levels**
  * *Expected Spatial Grain:* Municipal / Barangay (`[VERIFIED]`)
  * *Dimensions:* `service_level` (`Safely Managed`, `Basic`, `Limited`, `Unimproved`, `No Facility/Surface Water`)
  * *Measures:* Household Count (`count`), Proportion (`percent`)
  * *Layout Type:* 2D Matrix Cross-tab | *Physical Layout:* `[UNKNOWN]`
* **Table 8: Type of Toilet Facility**
  * *Expected Spatial Grain:* Municipal / Barangay (`[VERIFIED]`)
  * *Dimensions:* `toilet_facility_type` (Flush to septic tank, Pit latrine, Open pit, None)
  * *Measures:* Household Count (`count`)
  * *Layout Type:* 2D Matrix Cross-tab | *Physical Layout:* `[UNKNOWN]`

---

### Domain 4: Education & Youth Development
* **Table 28: Schooling Status of 3-24 Years Old**
  * *Expected Spatial Grain:* Municipal / Barangay (`[VERIFIED]`)
  * *Dimensions:* `age_bracket` (3-5, 6-11, 12-15, 16-17, 18-24), `schooling_status` (`Attending`, `Not Attending`), `sex`
  * *Measures:* Population Count (`count`), Attendance Rate (`percent`)
  * *Layout Type:* 3D Multi-Header Cross-tab | *Physical Layout:* `[UNKNOWN]`
* **Table 29: Reason for Not Attending School (16-21yo)**
  * *Expected Spatial Grain:* Municipal / Barangay (`[VERIFIED]`)
  * *Dimensions:* `non_attendance_reason` (Financial, Employment, Marriage/Family, Illness, Distance), `sex`
  * *Measures:* Count (`count`)
  * *Layout Type:* 3D Multi-Header Cross-tab | *Physical Layout:* `[UNKNOWN]`
* **Table 41: Youth Engagement (NEET 15-24yo)**
  * *Expected Spatial Grain:* Municipal / Barangay (`[VERIFIED]`)
  * *Dimensions:* `sex`, `neet_status` (`In NEET`, `Not in NEET`)
  * *Measures:* Proportion (`percent`), Headcount (`count`)
  * *Layout Type:* 2D/3D Cross-tab | *Physical Layout:* `[UNKNOWN]`
* **Tables 42–43: SHS & TVET Graduates Not Attending School by Employment Status**
  * *Expected Spatial Grain:* Municipal / Barangay (`[VERIFIED]`)
  * *Dimensions:* `employment_status` (`Employed`, `Unemployed`, `Not in Labor Force`), `sex`
  * *Measures:* Count (`count`)
  * *Layout Type:* 2D/3D Cross-tab | *Physical Layout:* `[UNKNOWN]`
* **Table 48: Working Children Aged 5-17yo Not in School**
  * *Expected Spatial Grain:* Municipal / Barangay (`[VERIFIED]`)
  * *Dimensions:* `age_group` (5-9, 10-14, 15-17), `sex`
  * *Measures:* Count (`count`)
  * *Layout Type:* 3D Cross-tab | *Physical Layout:* `[UNKNOWN]`

---

### Domain 5: Labor, Employment & Livelihood
* **Tables 30–32: Labor Force Participation, Employment, Unemployment, Underemployment**
  * *Expected Spatial Grain:* Municipal / Barangay (`[VERIFIED]`)
  * *Dimensions:* `labor_status` (`In Labor Force`, `Employed`, `Unemployed`, `Underemployed`), `sex`
  * *Measures:* Rate (`percent`), Headcount (`count`)
  * *Layout Type:* 3D Multi-Header Cross-tab | *Physical Layout:* `[UNKNOWN]`
* **Tables 33–34: Farmers, Farm Workers, Fisherfolk & Fish Workers**
  * *Expected Spatial Grain:* Municipal / Barangay (`[VERIFIED]`)
  * *Dimensions:* `subsector` (`Farming`, `Fishing`), `sex`
  * *Measures:* Proportion (`percent`), Headcount (`count`)
  * *Layout Type:* 2D/3D Cross-tab | *Physical Layout:* `[UNKNOWN]`
* **Tables 35–37: Child Labor & Working Children (Occupation Group & Sex)**
  * *Expected Spatial Grain:* Municipal / Barangay (`[VERIFIED]`)
  * *Dimensions:* `child_labor_status`, `occupation_group`, `sex`
  * *Measures:* Headcount (`count`), Proportion (`percent`)
  * *Layout Type:* 3D Multi-Header Cross-tab | *Physical Layout:* `[UNKNOWN]`
* **Table 38: Employed Persons in Managerial Positions by Sex**
  * *Expected Spatial Grain:* Municipal / Barangay (`[VERIFIED]`)
  * *Dimensions:* `managerial_level`, `sex` (`Male`, `Female`)
  * *Measures:* Headcount (`count`), Proportion (`percent`)
  * *Layout Type:* 2D Cross-tab | *Physical Layout:* `[UNKNOWN]`
* **Tables 39, 40, 46: Class of Worker, Industry Group & Occupation Group**
  * *Expected Spatial Grain:* Municipal / Barangay (`[VERIFIED]`)
  * *Dimensions:* `class_of_worker`, `industry_major_group`, `occupation_major_group`, `sex`
  * *Measures:* Count (`count`), Distribution (`percent`)
  * *Layout Type:* 3D Multi-Header Cross-tab | *Physical Layout:* `[UNKNOWN]`
* **Tables 44–45: Manufacturing Industry & Informal Employment**
  * *Expected Spatial Grain:* Municipal / Barangay (`[VERIFIED]`)
  * *Dimensions:* `informal_employment_type` (Self-employed, Unpaid Family Worker), `sex`
  * *Measures:* Proportion (`percent`), Headcount (`count`)
  * *Layout Type:* 2D/3D Cross-tab | *Physical Layout:* `[UNKNOWN]`

---

### Domain 6: Socio-Economic Welfare & Food Security
* **Tables 16, 17, 20: Availability of Electricity, Cooking Fuel, Clean Fuels**
  * *Expected Spatial Grain:* Municipal / Barangay (`[VERIFIED]`)
  * *Dimensions:* `energy_source_type`, `clean_fuel_reliance`
  * *Measures:* Household Count (`count`), Proportion (`percent`)
  * *Layout Type:* 2D Cross-tab | *Physical Layout:* `[UNKNOWN]`
* **Table 21: Households Experiencing Food Insecurity**
  * *Expected Spatial Grain:* Municipal / Barangay (`[VERIFIED]`)
  * *Dimensions:* `food_insecurity_severity` (Mild, Moderate, Severe)
  * *Measures:* Household Count (`count`), Prevalence (`percent`)
  * *Layout Type:* 2D Cross-tab | *Physical Layout:* `[UNKNOWN]`
* **Table 22: Formal Financial Account by Type**
  * *Expected Spatial Grain:* Municipal / Barangay (`[VERIFIED]`)
  * *Dimensions:* `account_type` (Bank, E-Money/GCash/Maya, Microfinance, Cooperative)
  * *Measures:* Household Count (`count`)
  * *Layout Type:* 2D Cross-tab | *Physical Layout:* `[UNKNOWN]`
* **Table 23: Medical Treatment Non-Availment by Main Reason**
  * *Expected Spatial Grain:* Municipal / Barangay (`[VERIFIED]`)
  * *Dimensions:* `non_availment_reason` (Cost of medicine/consultation, Distance, No companion, Fear)
  * *Measures:* Household Count (`count`)
  * *Layout Type:* 2D Cross-tab | *Physical Layout:* `[UNKNOWN]`

---

### Domain 7: Barangay Infrastructure & Community Services
* **Tables 3, 4, 47: Internet Access, Night Safety Perception, Public Transportation**
  * *Expected Spatial Grain:* Municipal / Barangay (`[VERIFIED]`)
  * *Dimensions:* `internet_access_type`, `safety_perception` (Safe, Unsafe), `transport_mode`
  * *Measures:* Household / Respondent Count (`count`), Proportion (`percent`)
  * *Layout Type:* 2D Cross-tab | *Physical Layout:* `[UNKNOWN]`
* **Tables 52, 53, 54: Waste Collection, Network Signal, DRRM Measures by Barangay**
  * *Expected Spatial Grain:* Barangay Grain (`[VERIFIED]`)
  * *Dimensions:* `service_presence` (`Available`, `Not Available`), `signal_type` (2G, 3G, 4G, 5G), `drrm_facility_type`
  * *Measures:* Binary Indicator / Count
  * *Layout Type:* Multi-column Indicator Grid | *Physical Layout:* `[UNKNOWN]`

---

### Domain 8 & 9: SDG & Priority GAD Indicators
* **Tables 55–61: SDG 1.4.1 & 1.4.2 Basic Services & Tenure Security**
  * *Expected Spatial Grain:* Municipal / Barangay (`[VERIFIED]`)
  * *Dimensions:* `indicator_code` (SDG 1.4.1.3, 1.4.1.4, 1.4.1.5.p1, 1.4.1.6.p1a, 1.4.1.6.p1b, 1.4.2.p1, 1.4.s4)
  * *Measures:* Proportion (`percent`)
  * *Layout Type:* 2D Indicator Grid | *Physical Layout:* `[UNKNOWN]`
* **Table 62: SDG 5.5.2 Proportion of Women in Managerial Positions (`[PRIORITY GAD]`)**
  * *Expected Spatial Grain:* Municipal / Barangay (`[VERIFIED]`)
  * *Dimensions:* `sex` (`Female`), `position_type` (`Managerial`)
  * *Measures:* Proportion (`percent`)
  * *Layout Type:* Indicator Fact Table | *Physical Layout:* `[UNKNOWN]`
* **Tables 63–67, 69, 70: SDG 8, 9, 16, 17 Indicators (Informal, Unemployment, NEET, Child Labor, Manufacturing, Safety, Internet)**
  * *Expected Spatial Grain:* Municipal / Barangay (`[VERIFIED]`)
  * *Dimensions:* `indicator_code` (SDG 8.3.1, 8.5.2, 8.6.1, 8.7.1.p1, 9.2.2, 16.1.4.p1, 17.8.1.p1)
  * *Measures:* Proportion / Rate (`percent`)
  * *Layout Type:* 2D Indicator Grid | *Physical Layout:* `[UNKNOWN]`
