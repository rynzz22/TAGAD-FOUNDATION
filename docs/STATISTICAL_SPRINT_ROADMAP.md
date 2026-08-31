# TAGAD STATISTICAL DOMAIN SPRINT ROADMAP
**Talibon Analytics for Gender and Development (TAGAD)**  
**Version:** v2.0.0  
**Status:** CANONICAL ENGINEERING SPRINT DECOMPOSITION  

---

## Roadmap Overview

```
                          CURRENT VERIFIED BASELINE
                       (Sprint 6 Qualified + 69 Catalog)
                                      │
                                      ▼
             ┌─────────────────────────────────────────────────┐
             │ SPRINT 7 PHASE 4: DATASET GOVERNANCE & EXPORT   │  <-- IMMEDIATE NEXT WORK
             │ • Dataset Lifecycle (DRAFT -> PUBLISHED)        │
             │ • Dataset Rollback & Withdrawal Engine          │
             │ • Office-Scoped CSV/PDF Report Exporters        │
             └────────────────────────┬────────────────────────┘
                                      │
                                      ▼
             ┌─────────────────────────────────────────────────┐
             │ SPRINT 8: STATISTICAL CATALOG UX & BROWSER      │
             │ • Interactive 69-Table Directory                │
             │ • Domain Filter & Table Detail Views            │
             │ • Indicator & Dimension Glossary                │
             └────────────────────────┬────────────────────────┘
                                      │
                                      ▼
             ┌─────────────────────────────────────────────────┐
             │ SPRINT 9: STATISTICAL INGESTION ENGINE          │  <-- BLOCKED ON RAW CSVs
             │ • Multi-Header Banner Discovery                 │
             │ • Matrix Unpivoting & Observation Persistence   │
             │ • Sum Reconciliation & Suppression Rules        │
             └────────────────────────┬────────────────────────┘
                                      │
                                      ▼
             ┌─────────────────────────────────────────────────┐
             │ SPRINT 10: GAD BASELINE SYNC & SDG DASHBOARDS   │
             │ • GAD Plan Target Sync with CBMS Baselines      │
             │ • Public Demographic & SDG 5.5.2 Dashboards     │
             └─────────────────────────────────────────────────┘
```

---

## Detailed Sprint Specifications

### SPRINT 7 PHASE 4: Statistical Dataset Governance & Export Engine
* **Status:** `[READY FOR SPRINT IMPLEMENTATION]`
* **Dependencies:** Sprint 7 Phase 1 Mother Schema (`tagad_statistical_*`)
* **Scope:**
  * **Backend:** Implement dataset state transitions (`DRAFT` $\to$ `VALIDATED` $\to$ `OFFICIAL` $\to$ `PUBLISHED` $\to$ `WITHDRAWN`) with strict `SUPER_ADMIN`/`ADMIN` authorization. Build cascading rollback engine.
  * **Export:** Implement office-scoped CSV/PDF export endpoints for GAD Plans and Beneficiary summaries using `exceljs` and `pdfkit`.
  * **Security:** Audit logging for dataset lifecycle mutations.
  * **QA:** Integration tests for lifecycle transitions and rollback scenarios.

---

### SPRINT 8: Statistical Catalog & Category UX
* **Status:** `[DESIGNED - UNBLOCKED]`
* **Dependencies:** Sprint 7 Phase 4
* **Scope:**
  * **Frontend:** Build master table directory with domain filters (9 domains), search bar, and table detail pages.
  * **API:** Expose paginated `/api/statistical-catalog` and `/api/statistical-catalog/:tableCode`.
  * **QA:** E2E UI testing of 69-table browsing and dimension lookup.

---

### SPRINT 9: Physical Statistical Ingestion Engine
* **Status:** **`[BLOCKED ON AUTHENTIC PSA RAW FILES]`**
* **Dependencies:** Physical delivery of sample CSV/XLSX for Tables 1, 2, 24, 25, 62.
* **Scope:**
  * **Backend:** Multi-header banner parser, matrix unpivoter, and chunked `StatisticalObservation` persistence.
  * **Validation:** Row sum reconciliation against municipal totals.

---

### SPRINT 10: GAD Baseline Synchronization & Public SDG Portal
* **Status:** `[FUTURE]`
* **Dependencies:** Sprint 9 Ingested Observations
* **Scope:**
  * **Analytics:** Synchronize GAD Plan baseline targets with published CBMS observation facts.
  * **Public UI:** Render SDG 5.5.2 (Women in Leadership) and SDG demographic widgets on public portal.
