/**
 * Capitalizes a string.
 *
 * @param {string} str
 * @returns {string}
 */
export function capitalize (str: string): string {
  if (typeof str !== 'string') return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * Normalize characters.
 *
 * @param {string} str
 * @returns {string}
 */
function normalizeCharacters (str) {
  const map = {
    a: 'á|à|ã|â|À|Á|Ã|Â',
    e: 'é|è|ê|É|È|Ê',
    i: 'í|ì|î|Í|Ì|Î',
    o: 'ó|ò|ô|õ|Ó|Ò|Ô|Õ',
    u: 'ú|ù|û|ü|Ú|Ù|Û|Ü',
    c: 'ç|Ç',
    n: 'ñ|Ñ'
  }
  str = str.toLowerCase()
  for (const pattern in map) {
    str = str.replace(new RegExp(map[pattern], 'g'), pattern)
  }
  return str
}

/**
 * Check if a text includes another text normalized or not.
 *
 * @param {string} text
 * @param {string} textToBeIncluded
 * @returns {string}
 */
export function hasTextOrNormalizedTextIncluded (text: string, textToBeIncluded: string): boolean {
  return normalizeCharacters(text).includes(normalizeCharacters(textToBeIncluded))
}
