/**
 * Capitalizes a string.
 *
 * @param {string} str
 * @returns {string}
 */
export function capitalize (str) {
  if (typeof str !== 'string') return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}
