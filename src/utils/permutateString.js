
/**
 * Get permutations from a given string recursively.
 *
 * @param {string} string
 * @returns {string[]} Array with permutations.
 */
export default function findPermutations (string) {
  if (!string || typeof string !== 'string' || string.length > 4) {
    return []
  } else if (string.length < 2) {
    return string
  }

  const permutationsArray = []

  for (let i = 0; i < string.length; i++) {
    const char = string[i]

    if (string.indexOf(char) !== i) { continue }

    const remainingChars = string.slice(0, i) + string.slice(i + 1, string.length)

    for (const permutation of findPermutations(remainingChars)) {
      permutationsArray.push(char + permutation)
    }
  }
  return permutationsArray
}
