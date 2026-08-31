# TAGAD STATISTICAL DOMAIN — FINAL ENGINEERING SPRINT ROADMAP
**System:** Talibon Analytics for Gender and Development (TAGAD)  
**Version:** `v2.0.0`  
**Status:** `[CANONICAL SPECIFICATION — SPRINT DECOMPOSITION]`  
**Engineering Directive:** BUILD WHAT IS VERIFIED • VALIDATE WHAT IS IMPLEMENTED • DESIGN WHAT IS UNKNOWN • NEVER FABRICATE GOVERNMENT DATA  

---

## 1. Roadmap Architecture Overview

```
                               CURRENT VERIFIED BASELINE
                            (Sprint 6 Qualified + 6 Mother Models)
                                           │
                                           ▼
             ┌───────────────────────────────────────────────────────────┐
             │ SPRINT 7 PHASE 4: DATASET GOVERNANCE & EXPORT ENGINE      │ <-- IMMEDIATE NEXT SPRINT
             │ • Dataset Lifecycle State Machine (DRAFT -> PUBLISHED)    │
             │ • Dataset Cascading Withdrawal & Rollback Engine          │
             │ • Office-Scoped CSV/PDF Exporters (exceljs, pdfkit)       │
             └─────────────────────────────┬─────────────────────────────┘
                                           │
                                           ▼
             ┌───────────────────────────────────────────────────────────┐
             │ SPRINT 8: STATISTICAL CATALOG & CATEGORY UX BROWSER       │ <-- UNBLOCKED
             │ • Interactive 69-Table Directory & 9 Domain Filters       │
             │ • Table Detail Pages, Dimensions Glossary & Metadata      │
             │ • Paginated /api/statistical-catalog API Endpoints        │
             └─────────────────────────────┬─────────────────────────────┘
                                           │
                                           ▼
             ┌───────────────────────────────────────────────────────────┐
             │ SPRINT 9: PHYSICAL STATISTICAL INGESTION ENGINE           │ <-- BLOCKED ON REAL CSVs
             │ • Multi-Header Banner Discovery (1-4 Rows)                │
             │ • Matrix Unpivoting into 1D StatisticalObservations       │
             │ • Barangay Resolution & Sum Reconciliation Engine         │
             └─────────────────────────────┬─────────────────────────────┘
                                           │
                                           ▼
             ┌───────────────────────────────────────────────────────────┐
             │ SPRINT 10: GAD BASELINE SYNC & PUBLIC SDG DASHBOARDS      │ <-- FUTURE
             │ • GAD Plan Baseline Metric Auto-Sync from CBMS Facts      │
             │ • Public Demographic & SDG 5.5.2 (Women in Leadership) UI │
             └───────────────────────────────────────────────────────────┘
```

---

## 2. Sprint Specifications

### SPRINT 7 PHASE 4: Statistical Dataset Governance & Export Engine
* **Sprint Name:** `SPRINT-7-PHASE-4-GOVERNANCE-EXPORT`
* **Objective:** Implement the dataset publication state machine, cascading rollback mechanisms, and operational CSV/PDF report exporters.
* **Prerequisites:** Sprint 7 Phase 1 Mother Schema (`tagad_statistical_*`).
* **Backend Work:**
  * Implement dataset lifecycle transition controller (`/api/admin/statistical-datasets/:id/status`).
  * Implement cascading withdrawal engine (marks observations inactive without breaking historical audit trails).
  * Build office-scoped CSV/PDF export endpoints for GAD Plans and Beneficiaries using `exceljs` and `pdfkit`.
* **Frontend Work:**
  * Add Dataset Status Badge and Action Dropdowns to Admin Workspace.
  * Add Export Button with modal filters (Date range, office scope, format).
* **Database Work:** None (leveraging existing `publicationStatus` enum and `tagad_audit_logs`).
* **Security & DPO Work:** Enforce `SUPER_ADMIN` requirement for `PUBLISHED` state transition.
* **QA & Test Work:** Integration tests for lifecycle transitions (`DRAFT` $\to$ `VALIDATED` $\to$ `OFFICIAL` $\to$ `PUBLISHED` $\to$ `WITHDRAWN`) and rollback scenarios.
* **Acceptance Criteria:**
  1. Only `SUPER_ADMIN` can transition datasets to `PUBLISHED`.
  2. Withdrawn datasets immediately disappear from public demographic summaries.
  3. PDF export renders official Talibon LGU header, GAD item table, and sign-off blocks.

---

### SPRINT 8: Statistical Catalog & Category UX Browser
* **Sprint Name:** `SPRINT-8-STATISTICAL-CATALOG-UX`
* **Objective:** Build an interactive frontend browser and API for the 69 PSA CBMS statistical tables.
* **Prerequisites:** Sprint 7 Phase 4.
* **Backend Work:**
  * Expose paginated `/api/statistical-catalog` with query filters (`domain`, `classification`, `search`).
  * Expose single table detail endpoint `/api/statistical-catalog/:tableCode`.
* **Frontend Work:**
  * Build master Table Catalog page (`/admin/statistical-catalog`) with domain tabs, search bar, and verification badges.
  * Build Table Detail View showing full PSA title, domain, expected dimensions, indicators, and survey round history.
* **QA & Test Work:** E2E UI testing of catalog search, filtering across all 9 domains, and table detail rendering.
* **Acceptance Criteria:**
  1. All 69 tables searchable by code, title, and domain.
  2. Verification status badge clearly displayed on every table card (`[VERIFIED]` vs `[UNVERIFIED]`).

---

### SPRINT 9: Physical Statistical Ingestion Engine
* **Sprint Name:** `SPRINT-9-STATISTICAL-INGESTION-ENGINE`
* **Objective:** Implement matrix cross-tab unpivoting, multi-header banner discovery, and observation persistence.
* **Prerequisites:** **`[BLOCKED ON AUTHENTIC PSA CBMS RAW CSV/XLSX FILES]`**
* **Backend Work:**
  * Build multi-row header banner detector.
  * Build 2D matrix unpivoter generating 1D `StatisticalObservation` fact tuples.
  * Implement mathematical sum reconciliation ($\sum \text{Barangays} == \text{Municipal Total}$).
* **Frontend Work:**
  * Build multi-step Statistical Ingestion Wizard (`Upload` $\to$ `Banner Detection` $\to$ `Matrix Mapping` $\to$ `Reconciliation Preview` $\to$ `Confirm`).
* **QA & Test Work:** Integration testing with authentic PSA sample files for Tables 1, 2, 24, 25, 62.
* **Acceptance Criteria:**
  1. Accurately unpivots 2D cross-tab matrix cells into 1D observation facts with JSONB dimensions.
  2. Reconciles row sums against municipal totals with $\pm 0.01$ tolerance.

---

### SPRINT 10: GAD Baseline Synchronization & Public SDG Dashboards
* **Sprint Name:** `SPRINT-10-GAD-SYNC-SDG-DASHBOARDS`
* **Objective:** Auto-populate GAD Plan baseline figures from published CBMS observations and render public SDG widgets.
* **Prerequisites:** Sprint 9 Ingested Observations.
* **Backend Work:** Expose public aggregate endpoints for SDG 5.5.2 (Women in Leadership) and demographic metrics.
* **Frontend Work:** Render SDG indicators and demographic visualizer on the public transparency portal.
* **QA & Test Work:** Security audit ensuring zero unpublished observations leak to public consumers.
