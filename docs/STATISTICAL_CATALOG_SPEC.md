# TAGAD STATISTICAL TABLE CATALOG SPECIFICATION (69 PSA CBMS TABLES)
**Talibon Analytics for Gender and Development (TAGAD)**  
**Version:** v2.0.0  
**Source Authority:** Philippine Statistics Authority (PSA) Community-Based Monitoring System (CBMS) Tabulation Plan  
**Status:** CANONICAL 69-TABLE CATALOG SPECIFICATION  

---

## 1. Domain & Category Taxonomy

The 69 official PSA CBMS tables are organized into **9 Canonical Statistical Domains**:

```mermaid
mindmap
  root((TAGAD 69 PSA CBMS Catalog))
    1. Demography & Population
      Table 1: Responding HHs & Covered Population
      Table 2: Households by Size
      Table 24: Covered Population by Sex
      Table 25: Covered Population by Age & Sex
      Table 26: Covered Population by Ethnicity
      Table 27: Senior Citizen ID Ownership
    2. Living Conditions & Housing
      Table 11: Type of Building / Housing Unit
      Table 12: Roof Construction Material
      Table 13: Outer Walls Material
      Table 14: Floor Material
      Table 15: Housing & Lot Tenure Status
      Table 18: Access to Secure Tenure
      Table 19: Overcrowding Status
      Table 49-51: Floor, Roof, Wall Material Strength
    3. Water, Sanitation & Hygiene (WASH)
      Table 5: Main Source of Water Supply
      Table 6: Main Source of Drinking Water
      Table 7: Drinking Water Service Level
      Table 8: Type of Toilet Facility
      Table 9: Toilet Facility Service Level
      Table 10: Handwashing Facility Service Level
    4. Education & Youth Development
      Table 28: Schooling Status (3-24yo)
      Table 29: Reason Not Attending School (16-21yo)
      Table 41: Youth NEET (15-24yo)
      Table 42: SHS Graduates Not in School
      Table 43: TVET Graduates Not in School
      Table 48: Working Children Not in School
    5. Labor, Employment & Livelihood
      Table 30: Labor Force Participation Rate
      Table 31: LFPR by Sex
      Table 32: Employment, Unemployment, Underemployment
      Table 33: Farmers & Farm Workers
      Table 34: Fisherfolk & Fish Workers
      Table 35: Engagement in Child Labor
      Table 36-37: Working Children (Sex & Occupation)
      Table 38: Employed in Managerial Positions
      Table 39: Class of Worker
      Table 40: Industry Group
      Table 44: Manufacturing Industry Employment
      Table 45: Informal Employment (Self-employed & Unpaid)
      Table 46: Employed by Occupation Group & Sex
    6. Socio-Economic Welfare & Food Security
      Table 16: Availability of Electricity
      Table 17: Fuel / Energy for Cooking
      Table 20: Reliance on Clean Fuels / Tech
      Table 21: Food Insecurity Experience
      Table 22: Formal Financial Account by Type
      Table 23: Medical Treatment Non-Availment Reason
    7. Barangay Infrastructure & Community Services
      Table 3: Access to Internet
      Table 4: Perception on Neighborhood Night Safety
      Table 47: Access to Public Transportation
      Table 52: Garbage Collection Services by Barangay
      Table 53: Cellphone Network Signal by Barangay
      Table 54: Disaster Risk Reduction & Management (DRRM)
    8. Sustainable Development Goal (SDG) Target Indicators
      Table 55: SDG 1.4.1.3 (Electricity Access)
      Table 56: SDG 1.4.1.4 (Clean Cooking Fuel)
      Table 57: SDG 1.4.1.5.p1 (Basic Drinking Water)
      Table 58: SDG 1.4.1.6.p1a (Basic Sanitation)
      Table 59: SDG 1.4.1.6.p1b (Handwashing Facilities)
      Table 60: SDG 1.4.2.p1 (Secure Tenure)
      Table 61: SDG 1.4.s4 (Owned / Owner-like Housing)
      Table 62: SDG 5.5.2 (Women in Managerial Positions)
      Table 63: SDG 8.3.1 (Informal Employment Proportion)
      Table 64: SDG 8.5.2 (Unemployment Rate)
      Table 65: SDG 8.6.1 (Youth NEET Rate)
      Table 66: SDG 8.7.1.p1 (Child Labor Rate)
      Table 67: SDG 9.2.2 (Manufacturing Employment Proportion)
      Table 69: SDG 16.1.4.p1 (Perception of Night Safety)
      Table 70: SDG 17.8.1.p1 (Internet Exposure Proportion)
```

---

## 2. Canonical 69-Table Master Register

| Table # | Tab Name | Official PSA Table Title | Canonical Domain | Classification | Expected Unit |
| :---: | :--- | :--- | :--- | :--- | :--- |
| **Table 1** | Summary statistics | Responding Households, Covered Population and Average Household Size | Demography & Population | Aggregated Statistics | Count / Average |
| **Table 2** | Households by size | Distribution of Households by Number of Household Members | Demography & Population | Aggregated Statistics | Households |
| **Table 3** | Access to internet | Distribution of Households by Access to Internet | Community Infrastructure | Aggregated Statistics | Households |
| **Table 4** | Perception on safety | Distribution of Respondents by Perception on Safety while Walking Alone in their Neighborhood at Night | Peace, Security & Safety | Aggregated Statistics | Respondents |
| **Table 5** | Main source of water supply | Distribution of Households by Main Source of Water Supply | Water, Sanitation & Hygiene | Aggregated Statistics | Households |
| **Table 6** | Main source of drinking water | Distribution of Households by Main Source of Drinking Water | Water, Sanitation & Hygiene | Aggregated Statistics | Households |
| **Table 7** | Drinking water service level | Distribution of Households by Service Level of Drinking Water | Water, Sanitation & Hygiene | Indicator / Aggregates | Households / Rate |
| **Table 8** | Toilet facility | Distribution of Households by Type of Toilet Facility | Water, Sanitation & Hygiene | Aggregated Statistics | Households |
| **Table 9** | Toilet facility service level | Distribution of Households by Service Level of Toilet Facility | Water, Sanitation & Hygiene | Indicator / Aggregates | Households / Rate |
| **Table 10** | Handwashing facility | Distribution of Households by Service Level of Handwashing Facility | Water, Sanitation & Hygiene | Indicator / Aggregates | Households / Rate |
| **Table 11** | Building type | Distribution of Households by Type of Building/Housing Unit they Occupy | Living Conditions & Housing | Aggregated Statistics | Households |
| **Table 12** | Roof material | Distribution of Households by Type of Material Used in the Roof of the Building they Occupy | Living Conditions & Housing | Aggregated Statistics | Households |
| **Table 13** | Outer walls material | Distribution of Households by Type of Material Used in the Outer Walls of the Building/Housing Unit they Occupy | Living Conditions & Housing | Aggregated Statistics | Households |
| **Table 14** | Floor material | Distribution of Households by Type of Material Used in the Floor of the Housing Unit they Occupy | Living Conditions & Housing | Aggregated Statistics | Households |
| **Table 15** | Residence tenure status | Distribution of Households by Tenure Status of the Housing Unit and Lot they Occupy | Living Conditions & Housing | Aggregated Statistics | Households |
| **Table 16** | Access to electricity | Distribution of Households by Availability of Electricity in the Building/Housing Unit they Occupy | Socio-Economic Welfare | Aggregated Statistics | Households |
| **Table 17** | Fuel for cooking | Distribution of Households by Fuel/Energy Source Used for Cooking | Socio-Economic Welfare | Aggregated Statistics | Households |
| **Table 18** | Access to secure tenure | Distribution of Households by Access to Secure Tenure | Living Conditions & Housing | Aggregated Statistics | Households |
| **Table 19** | Overcrowding status | Distribution of Households by Overcrowding Status | Living Conditions & Housing | Aggregated Statistics | Households |
| **Table 20** | Reliance on clean fuel | Distribution of Households by Reliance on Clean Fuels/Technology | Socio-Economic Welfare | Aggregated Statistics | Households |
| **Table 21** | Food insecurity experience | Number of Households that Experienced Food Insecurity | Socio-Economic Welfare | Aggregated Statistics | Households |
| **Table 22** | Financial account | Number of Households with Formal Financial Account by Type | Socio-Economic Welfare | Aggregated Statistics | Households |
| **Table 23** | Medical treatment nonavailment | Number of Households with Member/s who got Ill/Sick/Injured but did not Avail Medical Treatment by Main Reason | Socio-Economic Welfare | Aggregated Statistics | Households |
| **Table 24** | Population by sex | Distribution of Covered Population by Sex | Demography & Population | Aggregated Statistics | Persons |
| **Table 25** | Population by age group | Distribution of Covered Population by Age Group and Sex | Demography & Population | Aggregated Statistics | Persons |
| **Table 26** | Population by ethnicity | Distribution of Covered Population by Ethnicity | Demography & Population | Aggregated Statistics | Persons |
| **Table 27** | Senior citizen ID | Distribution of Covered Population 60 Years Old and Over by Ownership of Senior Citizen ID | Demography & Population | Aggregated Statistics | Persons (60+) |
| **Table 28** | Schooling status of 3-24yo | Distribution of Covered Population 3 to 24 Years Old by Schooling Status | Education & Youth | Aggregated Statistics | Persons (3-24) |
| **Table 29** | Not schooling reason of 16-21yo | Distribution of Covered Population 16 to 21 Years Old who are not Attending School by Sex and Reason | Education & Youth | Aggregated Statistics | Persons (16-21) |
| **Table 30** | Labor force participation (LFP) | Labor Force Participation Rate among Covered Population 15 Years Old and Over Excluding Overseas Filipino Workers | Labor & Employment | Indicator | Percent (%) |
| **Table 31** | LFP by sex | Labor Force Participation Rate among Covered Population 15 Years Old and Over Excluding Overseas Filipino Workers by Sex | Labor & Employment | Indicator | Percent (%) |
| **Table 32** | Key employment statistics | Employment, Unemployment and Underemployment among Covered Population 15 Years Old and Over Excluding Overseas Filipino Workers by Sex | Labor & Employment | Aggregated Statistics | Persons / Rate |
| **Table 33** | Farmers and farm workers | Proportion of Farmers and Farm Workers among Covered Population 15 Years Old and Over Excluding Overseas Filipino Workers | Labor & Employment | Indicator | Percent (%) |
| **Table 34** | Fisherfolk and fish workers | Proportion of Fisherfolk and Fish Workers among Covered Population 15 Years Old and Over Excluding Overseas Filipino Workers | Labor & Employment | Indicator | Percent (%) |
| **Table 35** | Child labor | Distribution of Covered Population 5 to 17 Years Old by Engagement to Child Labor | Labor & Employment | Aggregated Statistics | Persons (5-17) |
| **Table 36** | Working children by sex | Distribution of Working Children aged 5 to 17 Years Old by Sex | Labor & Employment | Aggregated Statistics | Persons (5-17) |
| **Table 37** | Working children by occupation | Distribution of Working Children aged 5 to 17 Years Old by Occupation Group | Labor & Employment | Aggregated Statistics | Persons (5-17) |
| **Table 38** | Employed managers | Distribution of Employed Persons in Managerial Positions by Sex | Labor & Employment | Aggregated Statistics | Persons |
| **Table 39** | Class of workers | Distribution of Covered Population 15 Years Old and Over Excluding Overseas Filipino Workers who are Employed by Class of Worker | Labor & Employment | Aggregated Statistics | Persons (15+) |
| **Table 40** | Industry group | Distribution of Covered Population 15 Years Old and Over Excluding Overseas Filipino Workers who are Employed by Industry Group | Labor & Employment | Aggregated Statistics | Persons (15+) |
| **Table 41** | Youth engagement | Proportion of Youth not in Education, Employment or Training among Covered Population 15 to 24 Years Old | Education & Youth | Indicator | Percent (%) |
| **Table 42** | SHS graduate not in school | Distribution of Senior High School Graduate not Attending School by Employment Status | Education & Youth | Aggregated Statistics | Persons |
| **Table 43** | TVET graduate not in school | Distribution of Covered Population 15 Years Old and Over who are Technical and Vocational Education and Training Graduates not Attending School by Employment Status | Education & Youth | Aggregated Statistics | Persons (15+) |
| **Table 44** | Manufacturing Industry | Proportion of Employed Individuals Engaged in the Manufacturing Industry | Labor & Employment | Indicator | Percent (%) |
| **Table 45** | Informal employment | Proportion of Employed Individuals Who Are Self‑Employed and Unpaid Family Workers | Labor & Employment | Indicator | Percent (%) |
| **Table 46** | Employed by occupation group | Distribution of Employed Persons by Occupation Group and by Sex | Labor & Employment | Aggregated Statistics | Persons |
| **Table 47** | Public transportation | Distribution of Households by Access to Public Transportation | Community Infrastructure | Aggregated Statistics | Households |
| **Table 48** | Working children not in school | Distribution of Working Children Aged 5 to 17 Years Old Who are Not in School by Age and Sex | Education & Youth | Aggregated Statistics | Persons (5-17) |
| **Table 49** | Floor material strength | Distribution of Households by Strength of Floor Materials | Living Conditions & Housing | Aggregated Statistics | Households |
| **Table 50** | Roof material strength | Distribution of Households by Strength of Roof Materials | Living Conditions & Housing | Aggregated Statistics | Households |
| **Table 51** | Outer wall material strength | Distribution of Households by Strength of Outer Wall Materials | Living Conditions & Housing | Aggregated Statistics | Households |
| **Table 52** | Waste collection | Availability of Garbage Collection Services by Barangay | Barangay Governance & Services | Aggregated Statistics | Barangays / HH |
| **Table 53** | Network signal | Availability of Cellphone Network Signal by Barangay | Barangay Governance & Services | Aggregated Statistics | Barangays / Signal |
| **Table 54** | DRRM | Presence of Disaster Risk Reduction and Management Measures by Barangay | Barangay Governance & Services | Aggregated Statistics | Barangays / Facilities |
| **Table 55** | SDG 1.4.1.3 | Proportion of Households with Access to Electricity | SDG Indicators | Indicator | Percent (%) |
| **Table 56** | SDG 1.4.1.4 | Proportion of Households with Primary Reliance on Clean Fuels and Technology | SDG Indicators | Indicator | Percent (%) |
| **Table 57** | SDG 1.4.1.5.p1 | Proportion of Households with Access to Basic Drinking Water Services | SDG Indicators | Indicator | Percent (%) |
| **Table 58** | SDG 1.4.1.6.p1a | Proportion of Households with Access to Basic Sanitation Services | SDG Indicators | Indicator | Percent (%) |
| **Table 59** | SDG 1.4.1.6.p1b | Proportion of Households with Access to Handwashing Facility with Soap and Water | SDG Indicators | Indicator | Percent (%) |
| **Table 60** | SDG 1.4.2.p1 | Proportion of Households with Access to Secure Tenure | SDG Indicators | Indicator | Percent (%) |
| **Table 61** | SDG 1.4.s4 | Proportion of Households with Owned or Owner-like Possession of Housing Units | SDG Indicators | Indicator | Percent (%) |
| **Table 62** | SDG 5.5.2 | Proportion of Women in Managerial Positions | SDG Indicators (GAD Priority) | Indicator | Percent (%) |
| **Table 63** | SDG 8.3.1 | Proportion of Self-employed and Unpaid Family Workers | SDG Indicators | Indicator | Percent (%) |
| **Table 64** | SDG 8.5.2 | Unemployment Rate | SDG Indicators | Indicator | Percent (%) |
| **Table 65** | SDG 8.6.1 | Proportion of Youth (Aged 15-24 Years) Not in Education, Employment, or Training (NEET Rate) | SDG Indicators | Indicator | Percent (%) |
| **Table 66** | SDG 8.7.1.p1 | Proportion of Children Aged 5–17 Years Engaged in Child Labour | SDG Indicators | Indicator | Percent (%) |
| **Table 67** | SDG 9.2.2 | Manufacturing Employment as a Proportion of Total Employment | SDG Indicators | Indicator | Percent (%) |
| **Table 69** | SDG 16.1.4.p1 | Proportion of Households that Feel Safe Walking Alone Around their Area at Night | SDG Indicators | Indicator | Percent (%) |
| **Table 70** | SDG 17.8.1.p1 | Proportion of Households with Exposure to the Internet | SDG Indicators | Indicator | Percent (%) |
