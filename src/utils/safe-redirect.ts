/**
 * Validates that a redirect target is a safe, same-origin relative path.
 * Rejects absolute URLs, protocol-relative URLs, and other schemes
 * that could be used in an open redirect attack.
 */
export function getSafeRedirect(target: unknown, fallback = '/'): string {
  if (typeof target !== 'string' || target.length === 0) {
    return fallback
  }

  // Must start with a single "/" and not "//" (protocol-relative)
  if (!target.startsWith('/') || target.startsWith('//')) {
    return fallback
  }

  // Block embedded backslashes (some browsers normalise "\/\" → "//")
  if (target.includes('\\')) {
    return fallback
  }

  return target
}
