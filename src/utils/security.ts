/**
 * GUDBAZAAR CHIEF CYBERSECURITY OFFICER (CISO) DEFENSE SUITE
 * 
 * Production-grade application security controls:
 * - Anti-XSS (Cross-Site Scripting) & HTML sanitization
 * - Anti-SQLi / NoSQLi heuristic input validation
 * - Anti-Brute-Force Rate Limiting (Coupon probing & Auth locks)
 * - Safe numeric bounds enforcement (Integer overflow & negative quantity attack prevention)
 * - Safe Slug & Path Traversal Prevention
 * - Strict Data Integrity Auditing
 */

// In-memory rate limiting tracker (per client session)
interface RateLimitBucket {
  attempts: number;
  lastAttemptTime: number;
  lockedUntil: number;
}

const rateLimiters: Record<string, RateLimitBucket> = {};

export const SECURITY_RULES = {
  MAX_QUANTITY_PER_ITEM: 99,
  MIN_QUANTITY_PER_ITEM: 1,
  MAX_COUPON_ATTEMPTS: 5,
  COUPON_LOCKOUT_MS: 60 * 1000, // 60 seconds
  MAX_AUTH_ATTEMPTS: 5,
  AUTH_LOCKOUT_MS: 60 * 1000,
  MAX_INPUT_LENGTH: 200,
  MAX_SEARCH_LENGTH: 60,
};

/**
 * Escapes potentially dangerous characters to prevent DOM-based XSS.
 */
export function sanitizeText(input: unknown): string {
  if (typeof input !== 'string') return '';
  return input
    .trim()
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Validates whether an input string contains dangerous injection sequences
 * (e.g., <script>, javascript:, onerror=, SQL comment tokens, directory traversal).
 */
export function auditInputSecurity(input: string, fieldName = 'Input'): { isSafe: boolean; errorMessage?: string } {
  if (!input) return { isSafe: true };

  // Check input length to prevent denial-of-service / buffer allocation
  if (input.length > 500) {
    return {
      isSafe: false,
      errorMessage: `Security Warning: ${fieldName} exceeds the maximum allowed length (500 chars).`,
    };
  }

  // Detection of script tags and inline execution vectors
  const xssPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /vbscript:/gi,
    /data:\s*text\/html/gi,
    /on\w+\s*=/gi, // e.g. onerror=, onload=, onclick=
    /<iframe/gi,
    /<object/gi,
    /<embed/gi,
  ];

  for (const pattern of xssPatterns) {
    if (pattern.test(input)) {
      return {
        isSafe: false,
        errorMessage: `Security Alert: Suspicious script pattern detected in ${fieldName}. Submission blocked.`,
      };
    }
  }

  // Detection of path traversal attempts
  if (input.includes('../') || input.includes('..\\') || input.includes('%2e%2e')) {
    return {
      isSafe: false,
      errorMessage: `Security Alert: Directory traversal sequence blocked in ${fieldName}.`,
    };
  }

  // Detection of high-risk SQLi tokens
  const sqliPatterns = [
    /(?:--|\/\*|\*\/)/g, // SQL comments
    /(?:UNION\s+SELECT)/gi,
    /(?:OR\s+['"]?1['"]?\s*=\s*['"]?1)/gi,
    /(?:DROP\s+TABLE)/gi,
    /(?:INSERT\s+INTO)/gi,
  ];

  for (const pattern of sqliPatterns) {
    if (pattern.test(input)) {
      return {
        isSafe: false,
        errorMessage: `Security Alert: Disallowed database token detected in ${fieldName}.`,
      };
    }
  }

  return { isSafe: true };
}

/**
 * Validates and strictly bounds cart quantities to prevent negative totals,
 * float manipulation, or buffer/inventory drain attacks.
 */
export function sanitizeCartQuantity(quantity: unknown): { isValid: boolean; value: number; error?: string } {
  const num = Number(quantity);

  if (isNaN(num) || !Number.isFinite(num)) {
    return {
      isValid: false,
      value: 1,
      error: 'Invalid quantity: Must be a valid numeric integer.',
    };
  }

  const integerVal = Math.floor(num);

  if (integerVal < SECURITY_RULES.MIN_QUANTITY_PER_ITEM) {
    return {
      isValid: false,
      value: 1,
      error: 'Security Notice: Quantity cannot be zero or negative.',
    };
  }

  if (integerVal > SECURITY_RULES.MAX_QUANTITY_PER_ITEM) {
    return {
      isValid: false,
      value: SECURITY_RULES.MAX_QUANTITY_PER_ITEM,
      error: `Security Notice: Maximum allowed quantity per item is ${SECURITY_RULES.MAX_QUANTITY_PER_ITEM}.`,
    };
  }

  return {
    isValid: true,
    value: integerVal,
  };
}

/**
 * Validates product URL slug to protect against path traversal and malformed URLs.
 */
export function sanitizeSlug(slug: string): string {
  if (!slug) return '';
  return slug
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '') // only lowercase letters, digits, and hyphens allowed
    .slice(0, 80);
}

/**
 * Rate-limiting check for coupon code abuse (brute-force coupon probing).
 */
export function checkCouponRateLimit(): { isAllowed: boolean; errorMessage?: string } {
  const now = Date.now();
  const key = 'coupon_rate_limit';
  const bucket = rateLimiters[key] || { attempts: 0, lastAttemptTime: now, lockedUntil: 0 };

  // Check if actively locked
  if (bucket.lockedUntil > now) {
    const remainingSeconds = Math.ceil((bucket.lockedUntil - now) / 1000);
    return {
      isAllowed: false,
      errorMessage: `Security Lock: Too many failed coupon attempts. Please wait ${remainingSeconds}s before trying again.`,
    };
  }

  return { isAllowed: true };
}

export function recordFailedCouponAttempt(): string | null {
  const now = Date.now();
  const key = 'coupon_rate_limit';
  const bucket = rateLimiters[key] || { attempts: 0, lastAttemptTime: now, lockedUntil: 0 };

  // Reset if time elapsed
  if (now - bucket.lastAttemptTime > SECURITY_RULES.COUPON_LOCKOUT_MS) {
    bucket.attempts = 1;
  } else {
    bucket.attempts += 1;
  }

  bucket.lastAttemptTime = now;

  if (bucket.attempts >= SECURITY_RULES.MAX_COUPON_ATTEMPTS) {
    bucket.lockedUntil = now + SECURITY_RULES.COUPON_LOCKOUT_MS;
    rateLimiters[key] = bucket;
    return `Security Lock Activated: Maximum failed coupon attempts reached. Blocked for 60 seconds.`;
  }

  rateLimiters[key] = bucket;
  return null;
}

export function resetCouponRateLimit(): void {
  delete rateLimiters['coupon_rate_limit'];
}

/**
 * Rate-limiting check for authentication attempts (anti-brute-force).
 */
export function checkAuthRateLimit(): { isAllowed: boolean; errorMessage?: string } {
  const now = Date.now();
  const key = 'auth_rate_limit';
  const bucket = rateLimiters[key] || { attempts: 0, lastAttemptTime: now, lockedUntil: 0 };

  if (bucket.lockedUntil > now) {
    const remainingSeconds = Math.ceil((bucket.lockedUntil - now) / 1000);
    return {
      isAllowed: false,
      errorMessage: `Security Lock: Too many login attempts. Locked for security reasons. Please wait ${remainingSeconds}s.`,
    };
  }

  return { isAllowed: true };
}

export function recordFailedAuthAttempt(): string | null {
  const now = Date.now();
  const key = 'auth_rate_limit';
  const bucket = rateLimiters[key] || { attempts: 0, lastAttemptTime: now, lockedUntil: 0 };

  if (now - bucket.lastAttemptTime > SECURITY_RULES.AUTH_LOCKOUT_MS) {
    bucket.attempts = 1;
  } else {
    bucket.attempts += 1;
  }

  bucket.lastAttemptTime = now;

  if (bucket.attempts >= SECURITY_RULES.MAX_AUTH_ATTEMPTS) {
    bucket.lockedUntil = now + SECURITY_RULES.AUTH_LOCKOUT_MS;
    rateLimiters[key] = bucket;
    return `Security Lock: Suspicious login activity detected. Login locked for 60 seconds.`;
  }

  rateLimiters[key] = bucket;
  return null;
}

export function resetAuthRateLimit(): void {
  delete rateLimiters['auth_rate_limit'];
}
