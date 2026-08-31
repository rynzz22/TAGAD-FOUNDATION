export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export function validateLoginInput(email: string, password: string): ValidationResult {
  const errors: Record<string, string> = {};

  if (!email || !email.trim()) {
    errors.email = 'Email address is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    errors.email = 'Please enter a valid official email address';
  }

  if (!password) {
    errors.password = 'Password is required';
  } else if (password.length < 6) {
    errors.password = 'Password must be at least 6 characters long';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateProgramInput(title: string, fiscalYear: number, officeId: string): ValidationResult {
  const errors: Record<string, string> = {};

  if (!title || title.trim().length < 3) {
    errors.title = 'Program title must be at least 3 characters';
  }

  const currentYear = new Date().getFullYear();
  if (!fiscalYear || fiscalYear < 2020 || fiscalYear > currentYear + 5) {
    errors.fiscalYear = `Fiscal year must be between 2020 and ${currentYear + 5}`;
  }

  if (!officeId) {
    errors.officeId = 'Implementing Office is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
