import { FALLBACK_BARANGAYS, FALLBACK_OFFICES } from '../lib/fallbackStore';

export interface ColumnProfile {
  name: string;
  normalizedName: string;
  detectedType: 'string' | 'integer' | 'float' | 'boolean' | 'date' | 'enum' | 'mixed' | 'empty';
  totalValues: number;
  nonEmptyValues: number;
  emptyValues: number;
  uniqueValuesCount: number;
  sampleValues: string[];
  inferredTargetField: string | null;
  targetFieldConfidence: number; // 0 to 1
  isLikelyIdentifier: boolean;
  isLikelyBarangay: boolean;
  isLikelyOffice: boolean;
  isLikelySector: boolean;
  isLikelySex: boolean;
  isLikelyAgeOrBirthdate: boolean;
  unrecognizedCategoryValues: string[];
  notes: string[];
}

export interface CsvDiscoveryResult {
  filename?: string;
  totalRows: number;
  totalColumns: number;
  rawHeaders: string[];
  normalizedHeaders: string[];
  columns: Record<string, ColumnProfile>;
  schemaMapping: CsvToTagadFieldMapping[];
  potentialDuplicateColumns: string[];
  unknownColumns: string[];
  unsupportedColumns: string[];
  summary: {
    datasetTypeGuess: 'BENEFICIARY_REGISTRY' | 'PROGRAM_MONITORING' | 'ACCOMPLISHMENT_REPORT' | 'HOUSEHOLD_SURVEY' | 'UNKNOWN';
    readinessScore: number; // 0 to 100
    hasRequiredIdentityFields: boolean;
    hasBarangayField: boolean;
    hasGenderField: boolean;
    recommendations: string[];
  };
}

export interface CsvToTagadFieldMapping {
  sourceColumn: string;
  tagadDestinationField: string;
  targetModel: 'Beneficiary' | 'Household' | 'Program' | 'GADAccomplishment' | 'CustomAttribute';
  dataType: string;
  required: boolean;
  transformationRule: string;
  validationRule: string;
  defaultValue: string | null;
  notes: string;
}

// Canonical Talibon reference mappings
const KNOWN_SECTORS = [
  'WOMEN', 'SENIOR_CITIZEN', 'PWD', 'SOLO_PARENT', 'YOUTH', 'INDIGENT',
  'FARMER', 'FISHERFOLK', 'CHILDREN', 'LGBTQ', 'IP', '4PS'
];

const KNOWN_SEX_VALUES = ['MALE', 'FEMALE', 'M', 'F', 'LALAKE', 'BABAE', 'LALAKI', 'BABAYE', 'BOY', 'GIRL', 'MAN', 'WOMAN'];

// Field alias heuristics
const FIELD_ALIASES: Record<string, { target: string; model: 'Beneficiary' | 'Household' | 'Program' | 'GADAccomplishment'; type: string; required: boolean }> = {
  // First Name
  firstname: { target: 'firstName', model: 'Beneficiary', type: 'string', required: true },
  first_name: { target: 'firstName', model: 'Beneficiary', type: 'string', required: true },
  fname: { target: 'firstName', model: 'Beneficiary', type: 'string', required: true },
  givenname: { target: 'firstName', model: 'Beneficiary', type: 'string', required: true },
  pangalan: { target: 'firstName', model: 'Beneficiary', type: 'string', required: true },
  
  // Last Name
  lastname: { target: 'lastName', model: 'Beneficiary', type: 'string', required: true },
  last_name: { target: 'lastName', model: 'Beneficiary', type: 'string', required: true },
  lname: { target: 'lastName', model: 'Beneficiary', type: 'string', required: true },
  surname: { target: 'lastName', model: 'Beneficiary', type: 'string', required: true },
  apelyido: { target: 'lastName', model: 'Beneficiary', type: 'string', required: true },

  // Middle Name
  middlename: { target: 'middleName', model: 'Beneficiary', type: 'string', required: false },
  middle_name: { target: 'middleName', model: 'Beneficiary', type: 'string', required: false },
  mname: { target: 'middleName', model: 'Beneficiary', type: 'string', required: false },
  middleinitial: { target: 'middleName', model: 'Beneficiary', type: 'string', required: false },
  mi: { target: 'middleName', model: 'Beneficiary', type: 'string', required: false },

  // Full Name (composite)
  fullname: { target: 'fullName', model: 'Beneficiary', type: 'string', required: false },
  full_name: { target: 'fullName', model: 'Beneficiary', type: 'string', required: false },
  name: { target: 'fullName', model: 'Beneficiary', type: 'string', required: false },
  beneficiary_name: { target: 'fullName', model: 'Beneficiary', type: 'string', required: false },

  // Sex / Gender
  sex: { target: 'sex', model: 'Beneficiary', type: 'enum(MALE,FEMALE)', required: true },
  gender: { target: 'sex', model: 'Beneficiary', type: 'enum(MALE,FEMALE)', required: true },
  kasarian: { target: 'sex', model: 'Beneficiary', type: 'enum(MALE,FEMALE)', required: true },

  // Age
  age: { target: 'age', model: 'Beneficiary', type: 'integer', required: true },
  edad: { target: 'age', model: 'Beneficiary', type: 'integer', required: true },

  // Birthdate
  birthdate: { target: 'birthdate', model: 'Beneficiary', type: 'date', required: false },
  birth_date: { target: 'birthdate', model: 'Beneficiary', type: 'date', required: false },
  dob: { target: 'birthdate', model: 'Beneficiary', type: 'date', required: false },
  date_of_birth: { target: 'birthdate', model: 'Beneficiary', type: 'date', required: false },
  birthday: { target: 'birthdate', model: 'Beneficiary', type: 'date', required: false },
  petsa_ng_kapanganakan: { target: 'birthdate', model: 'Beneficiary', type: 'date', required: false },

  // Sector
  sector: { target: 'sector', model: 'Beneficiary', type: 'string', required: true },
  vulnerability_sector: { target: 'sector', model: 'Beneficiary', type: 'string', required: true },
  category: { target: 'sector', model: 'Beneficiary', type: 'string', required: true },
  beneficiary_type: { target: 'sector', model: 'Beneficiary', type: 'string', required: true },
  sektor: { target: 'sector', model: 'Beneficiary', type: 'string', required: true },

  // Barangay
  barangay: { target: 'barangayCode', model: 'Beneficiary', type: 'string(code/name)', required: true },
  brgy: { target: 'barangayCode', model: 'Beneficiary', type: 'string(code/name)', required: true },
  barangay_name: { target: 'barangayCode', model: 'Beneficiary', type: 'string(code/name)', required: true },
  barangay_code: { target: 'barangayCode', model: 'Beneficiary', type: 'string(code/name)', required: true },
  bgy: { target: 'barangayCode', model: 'Beneficiary', type: 'string(code/name)', required: true },
  location: { target: 'barangayCode', model: 'Beneficiary', type: 'string(code/name)', required: false },

  // Address
  address: { target: 'addressStreet', model: 'Beneficiary', type: 'string', required: false },
  street: { target: 'addressStreet', model: 'Beneficiary', type: 'string', required: false },
  purok: { target: 'addressStreet', model: 'Beneficiary', type: 'string', required: false },
  sitio: { target: 'addressStreet', model: 'Beneficiary', type: 'string', required: false },
  address_street: { target: 'addressStreet', model: 'Beneficiary', type: 'string', required: false },

  // Contact Number
  contact: { target: 'contactNumber', model: 'Beneficiary', type: 'string', required: false },
  contact_number: { target: 'contactNumber', model: 'Beneficiary', type: 'string', required: false },
  contact_no: { target: 'contactNumber', model: 'Beneficiary', type: 'string', required: false },
  contactno: { target: 'contactNumber', model: 'Beneficiary', type: 'string', required: false },
  phone: { target: 'contactNumber', model: 'Beneficiary', type: 'string', required: false },
  phone_no: { target: 'contactNumber', model: 'Beneficiary', type: 'string', required: false },
  mobile: { target: 'contactNumber', model: 'Beneficiary', type: 'string', required: false },
  mobile_no: { target: 'contactNumber', model: 'Beneficiary', type: 'string', required: false },
  cellphone: { target: 'contactNumber', model: 'Beneficiary', type: 'string', required: false },
  telephone: { target: 'contactNumber', model: 'Beneficiary', type: 'string', required: false },
  tel_no: { target: 'contactNumber', model: 'Beneficiary', type: 'string', required: false },
  remarks: { target: 'remarks', model: 'Beneficiary', type: 'string', required: false },

  // Household / 4Ps
  household_no: { target: 'householdNo', model: 'Household', type: 'string', required: false },
  hh_id: { target: 'householdNo', model: 'Household', type: 'string', required: false },
  is_4ps: { target: 'is4Ps', model: 'Household', type: 'boolean', required: false },
  four_ps: { target: 'is4Ps', model: 'Household', type: 'boolean', required: false },
  pantawid: { target: 'is4Ps', model: 'Household', type: 'boolean', required: false },
  is_indigent: { target: 'isIndigent', model: 'Household', type: 'boolean', required: false },

  // Office
  office: { target: 'officeCode', model: 'Beneficiary', type: 'string', required: false },
  department: { target: 'officeCode', model: 'Beneficiary', type: 'string', required: false },
  implementing_office: { target: 'officeCode', model: 'Beneficiary', type: 'string', required: false },
};

export class CsvDiscoveryService {
  /**
   * Parse raw CSV content into rows and analyze its schema structure.
   */
  public static discoverSchema(rawCsvContent: string, filename?: string): CsvDiscoveryResult {
    if (!rawCsvContent || !rawCsvContent.trim()) {
      return {
        filename,
        totalRows: 0,
        totalColumns: 0,
        rawHeaders: [],
        normalizedHeaders: [],
        columns: {},
        schemaMapping: [],
        potentialDuplicateColumns: [],
        unknownColumns: [],
        unsupportedColumns: [],
        summary: {
          datasetTypeGuess: 'UNKNOWN',
          readinessScore: 0,
          hasRequiredIdentityFields: false,
          hasBarangayField: false,
          hasGenderField: false,
          recommendations: ['File is empty. Upload a non-empty CSV dataset with column headers.'],
        },
      };
    }

    const { headers, rows } = this.parseCsvLines(rawCsvContent);
    const totalRows = rows.length;
    const totalColumns = headers.length;

    const normalizedHeaders = headers.map((h) => this.normalizeHeader(h));
    const columns: Record<string, ColumnProfile> = {};
    const schemaMapping: CsvToTagadFieldMapping[] = [];
    const unknownColumns: string[] = [];
    const unsupportedColumns: string[] = [];
    const duplicateTracker = new Map<string, number>();

    const potentialDuplicateColumns: string[] = [];
    normalizedHeaders.forEach((nh, idx) => {
      const count = (duplicateTracker.get(nh) || 0) + 1;
      duplicateTracker.set(nh, count);
      if (count > 1) {
        potentialDuplicateColumns.push(headers[idx]);
      }
    });

    // Profile each column
    headers.forEach((header, colIndex) => {
      const norm = normalizedHeaders[colIndex];
      const columnValues = rows.map((r) => (r[colIndex] !== undefined ? String(r[colIndex]).trim() : ''));
      const nonEmptyValues = columnValues.filter((v) => v !== '');
      const uniqueValues = Array.from(new Set(nonEmptyValues));

      // Type inference
      const detectedType = this.inferColumnDataType(nonEmptyValues);

      // Check heuristics for reference lookups
      const isLikelyBarangay = this.checkIfBarangay(nonEmptyValues, norm);
      const isLikelyOffice = this.checkIfOffice(nonEmptyValues, norm);
      const isLikelySector = this.checkIfSector(nonEmptyValues, norm);
      const isLikelySex = this.checkIfSex(nonEmptyValues, norm);
      const isLikelyAgeOrBirthdate = norm.includes('age') || norm.includes('birth') || norm.includes('edad') || norm.includes('dob');
      const isLikelyIdentifier = norm.includes('id') || norm.includes('code') || norm.includes('no') || (uniqueValues.length === nonEmptyValues.length && nonEmptyValues.length > 5);

      // Match to known alias or target
      const aliasMatch = FIELD_ALIASES[norm];
      let inferredTargetField: string | null = null;
      let targetFieldConfidence = 0;
      let targetModel: 'Beneficiary' | 'Household' | 'Program' | 'GADAccomplishment' | 'CustomAttribute' = 'CustomAttribute';
      let dataType: string = detectedType;
      let required = false;
      let transformationRule = 'Preserve as-is (text string)';
      let validationRule = 'Optional text';
      let defaultValue: string | null = null;
      let notes = '';

      if (aliasMatch) {
        inferredTargetField = aliasMatch.target;
        targetModel = aliasMatch.model;
        targetFieldConfidence = 0.95;
        required = aliasMatch.required;
        dataType = aliasMatch.type;

        if (inferredTargetField === 'firstName' || inferredTargetField === 'lastName') {
          transformationRule = 'Trim whitespace, capitalize first letters';
          validationRule = 'Must be non-empty alphabetic string (min 2 chars)';
        } else if (inferredTargetField === 'sex') {
          transformationRule = "Normalize to 'MALE' or 'FEMALE'";
          validationRule = "Must be valid sex indicator ('MALE'|'FEMALE'|'M'|'F'|'Lalake'|'Babae')";
        } else if (inferredTargetField === 'age') {
          transformationRule = 'Parse integer; calculate from birthdate if birthdate provided';
          validationRule = 'Integer between 0 and 125';
        } else if (inferredTargetField === 'birthdate') {
          transformationRule = 'Parse ISO 8601 YYYY-MM-DD or MM/DD/YYYY to Date';
          validationRule = 'Valid historical date (past date)';
        } else if (inferredTargetField === 'barangayCode') {
          transformationRule = 'Match name or code to Talibon 33 canonical Barangay records';
          validationRule = 'Must match valid Talibon Barangay code (e.g. TLB-POB) or name (e.g. Poblacion)';
        } else if (inferredTargetField === 'sector') {
          transformationRule = 'Map to standard GAD Sector classification';
          validationRule = 'Categorical sector classification string';
          defaultValue = 'GENERAL';
        } else if (inferredTargetField === 'contactNumber') {
          transformationRule = 'Format to Philippine standard (09XXXXXXXXX or +639XXXXXXXXX)';
          validationRule = 'Optional 11-digit mobile or standard landline';
        }
      } else if (isLikelyBarangay) {
        inferredTargetField = 'barangayCode';
        targetModel = 'Beneficiary';
        targetFieldConfidence = 0.85;
        required = true;
        dataType = 'string(Barangay)';
        transformationRule = 'Match column values to Talibon 33 canonical Barangay records';
        validationRule = 'Must match valid Talibon Barangay code or name';
        notes = 'Inferred from matching Barangay values';
      } else if (isLikelySex) {
        inferredTargetField = 'sex';
        targetModel = 'Beneficiary';
        targetFieldConfidence = 0.85;
        required = true;
        dataType = 'enum(MALE,FEMALE)';
        transformationRule = "Normalize values to 'MALE' or 'FEMALE'";
        validationRule = "Must resolve to 'MALE' or 'FEMALE'";
        notes = 'Inferred from binary gender value distribution';
      } else if (isLikelySector) {
        inferredTargetField = 'sector';
        targetModel = 'Beneficiary';
        targetFieldConfidence = 0.8;
        required = true;
        dataType = 'string(Sector)';
        transformationRule = 'Map to standard GAD Sector';
        validationRule = 'Valid GAD Sector';
        defaultValue = 'GENERAL';
        notes = 'Inferred from vulnerable sector keywords';
      } else {
        unknownColumns.push(header);
        inferredTargetField = norm.startsWith('custom_') ? norm : `custom_${norm}`;
        targetFieldConfidence = 0.3;
        targetModel = 'CustomAttribute';
        transformationRule = 'Retain in custom attributes / metadata object';
        validationRule = 'Any string/number value';
        notes = 'Unmapped column: will be safely preserved in metadata without data loss';
      }

      const sampleValues = uniqueValues.slice(0, 5);

      columns[header] = {
        name: header,
        normalizedName: norm,
        detectedType,
        totalValues: columnValues.length,
        nonEmptyValues: nonEmptyValues.length,
        emptyValues: columnValues.length - nonEmptyValues.length,
        uniqueValuesCount: uniqueValues.length,
        sampleValues,
        inferredTargetField,
        targetFieldConfidence,
        isLikelyIdentifier,
        isLikelyBarangay,
        isLikelyOffice,
        isLikelySector,
        isLikelySex,
        isLikelyAgeOrBirthdate,
        unrecognizedCategoryValues: [],
        notes: notes ? [notes] : [],
      };

      schemaMapping.push({
        sourceColumn: header,
        tagadDestinationField: inferredTargetField || `metadata.${norm}`,
        targetModel,
        dataType,
        required,
        transformationRule,
        validationRule,
        defaultValue,
        notes: notes || (aliasMatch ? 'Direct standard mapping' : 'Custom mapped column'),
      });
    });

    // Determine Dataset Type & Readiness
    const mappedTargets = schemaMapping.map((m) => m.tagadDestinationField);
    const hasFirstName = mappedTargets.includes('firstName') || mappedTargets.includes('fullName');
    const hasLastName = mappedTargets.includes('lastName') || mappedTargets.includes('fullName');
    const hasSex = mappedTargets.includes('sex');
    const hasAgeOrDob = mappedTargets.includes('age') || mappedTargets.includes('birthdate');
    const hasBarangay = mappedTargets.includes('barangayCode');
    const hasSector = mappedTargets.includes('sector');

    const hasRequiredIdentityFields = hasFirstName && hasLastName && (hasAgeOrDob || hasSex);
    const hasBarangayField = hasBarangay;
    const hasGenderField = hasSex;

    let datasetTypeGuess: 'BENEFICIARY_REGISTRY' | 'PROGRAM_MONITORING' | 'ACCOMPLISHMENT_REPORT' | 'HOUSEHOLD_SURVEY' | 'UNKNOWN' = 'UNKNOWN';
    if (hasRequiredIdentityFields && hasBarangay) {
      datasetTypeGuess = 'BENEFICIARY_REGISTRY';
    } else if (normalizedHeaders.some((h) => h.includes('budget') || h.includes('actual') || h.includes('accomplishment') || h.includes('output'))) {
      datasetTypeGuess = 'ACCOMPLISHMENT_REPORT';
    } else if (normalizedHeaders.some((h) => h.includes('program') || h.includes('activity') || h.includes('gad_result') || h.includes('hgdg'))) {
      datasetTypeGuess = 'PROGRAM_MONITORING';
    } else if (normalizedHeaders.some((h) => h.includes('household') || h.includes('indigent') || h.includes('4ps') || h.includes('head'))) {
      datasetTypeGuess = 'HOUSEHOLD_SURVEY';
    }

    const recommendations: string[] = [];
    let readinessScore = 40;

    if (hasRequiredIdentityFields) readinessScore += 25;
    else recommendations.push('Missing explicit personal name or identity columns (First Name, Last Name).');

    if (hasBarangayField) readinessScore += 20;
    else recommendations.push('Missing Barangay column for geographic segregation.');

    if (hasGenderField) readinessScore += 15;
    else recommendations.push("Missing Gender/Sex column ('MALE' / 'FEMALE') for GAD disaggregation.");

    if (potentialDuplicateColumns.length > 0) {
      recommendations.push(`Duplicate column headers detected: ${potentialDuplicateColumns.join(', ')}.`);
      readinessScore -= 10;
    }

    if (unknownColumns.length > 0) {
      recommendations.push(`${unknownColumns.length} unmapped column(s) detected (${unknownColumns.join(', ')}). These will be safely preserved in custom attributes.`);
    }

    if (rows.length === 0) {
      recommendations.push('CSV contains headers but 0 data rows.');
      readinessScore = 10;
    }

    readinessScore = Math.max(0, Math.min(100, readinessScore));

    return {
      filename,
      totalRows,
      totalColumns,
      rawHeaders: headers,
      normalizedHeaders,
      columns,
      schemaMapping,
      potentialDuplicateColumns,
      unknownColumns,
      unsupportedColumns,
      summary: {
        datasetTypeGuess,
        readinessScore,
        hasRequiredIdentityFields,
        hasBarangayField,
        hasGenderField,
        recommendations,
      },
    };
  }

  /**
   * Helper to normalize header names
   */
  public static normalizeHeader(header: string): string {
    return header
      .trim()
      .toLowerCase()
      .replace(/[\s\-_]+/g, '_')
      .replace(/[^a-z0-9_]/g, '');
  }

  /**
   * Safe CSV Line Parser supporting quotes, commas, escapes, and variable delimiters
   */
  public static parseCsvLines(csvText: string): { headers: string[]; rows: string[][] } {
    const lines = csvText.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');
    const filteredLines = lines.filter((l) => l.trim().length > 0);

    if (filteredLines.length === 0) {
      return { headers: [], rows: [] };
    }

    const parseLine = (line: string): string[] => {
      const result: string[] = [];
      let current = '';
      let insideQuote = false;

      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
          if (insideQuote && line[i + 1] === '"') {
            current += '"';
            i++;
          } else {
            insideQuote = !insideQuote;
          }
        } else if (char === ',' && !insideQuote) {
          result.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      result.push(current.trim());
      return result;
    };

    const headers = parseLine(filteredLines[0]);
    const rows = filteredLines.slice(1).map((l) => parseLine(l));

    return { headers, rows };
  }

  private static inferColumnDataType(nonEmptyValues: string[]): 'string' | 'integer' | 'float' | 'boolean' | 'date' | 'enum' | 'mixed' | 'empty' {
    if (nonEmptyValues.length === 0) return 'empty';

    let integerCount = 0;
    let floatCount = 0;
    let booleanCount = 0;
    let dateCount = 0;

    const boolSet = new Set(['true', 'false', 'yes', 'no', '1', '0', 'y', 'n', 'oo', 'hindi']);

    for (const val of nonEmptyValues) {
      const clean = val.trim();
      if (/^-?\d+$/.test(clean)) {
        integerCount++;
      } else if (/^-?\d+(\.\d+)?$/.test(clean)) {
        floatCount++;
      } else if (boolSet.has(clean.toLowerCase())) {
        booleanCount++;
      } else if (!isNaN(Date.parse(clean)) && clean.length >= 6 && /\d/.test(clean)) {
        dateCount++;
      }
    }

    const total = nonEmptyValues.length;
    if (integerCount / total >= 0.85) return 'integer';
    if ((integerCount + floatCount) / total >= 0.85) return 'float';
    if (booleanCount / total >= 0.85) return 'boolean';
    if (dateCount / total >= 0.85) return 'date';

    const uniqueCount = new Set(nonEmptyValues.map((v) => v.toLowerCase())).size;
    if (uniqueCount <= 6 && total >= 5) return 'enum';

    return 'string';
  }

  private static checkIfBarangay(values: string[], header: string): boolean {
    if (header.includes('barangay') || header.includes('brgy')) return true;
    const talibonNames = FALLBACK_BARANGAYS.map((b) => b.name.toLowerCase());
    const talibonCodes = FALLBACK_BARANGAYS.map((b) => b.code.toLowerCase());

    let matchCount = 0;
    for (const val of values) {
      const lower = val.toLowerCase().trim();
      if (talibonNames.some((n) => lower.includes(n)) || talibonCodes.includes(lower)) {
        matchCount++;
      }
    }
    return values.length > 0 && matchCount / values.length >= 0.5;
  }

  private static checkIfOffice(values: string[], header: string): boolean {
    if (header.includes('office') || header.includes('department')) return true;
    const officeCodes = FALLBACK_OFFICES.map((o) => o.code.toLowerCase());
    let matchCount = 0;
    for (const val of values) {
      const lower = val.toLowerCase().trim();
      if (officeCodes.includes(lower)) matchCount++;
    }
    return values.length > 0 && matchCount / values.length >= 0.5;
  }

  private static checkIfSector(values: string[], header: string): boolean {
    if (header.includes('sector') || header.includes('category') || header.includes('vulnerability') || header.includes('sektor')) return true;
    if (header.includes('remark') || header.includes('comment') || header.includes('note')) return false;
    let matchCount = 0;
    for (const val of values) {
      const upper = val.toUpperCase().trim().replace(/[\s\-_]+/g, '_');
      if (KNOWN_SECTORS.some((s) => s === upper || upper.startsWith(s + '_') || upper.endsWith('_' + s))) matchCount++;
    }
    return values.length > 0 && matchCount / values.length >= 0.6;
  }

  private static checkIfSex(values: string[], header: string): boolean {
    if (header === 'sex' || header === 'gender' || header === 'kasarian') return true;
    let matchCount = 0;
    for (const val of values) {
      const upper = val.toUpperCase().trim();
      if (KNOWN_SEX_VALUES.includes(upper)) matchCount++;
    }
    return values.length > 0 && matchCount / values.length >= 0.6;
  }
}
