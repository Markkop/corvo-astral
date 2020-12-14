import fs from 'fs'

/**
 * Open file.
 *
 * @param {string} path
 * @returns {any}
 */
export function openFile (path) {
  try {
    const file = fs.readFileSync(path)
    return JSON.parse(file)
  } catch (err) {
    console.error(err)
  }
}

/**
 * Write some data into file.
 *
 * @param {any} data
 * @param {string} path
 */
export function saveFile (data, path) {
  try {
    fs.writeFileSync(path, JSON.stringify(data, null, 2))
  } catch (err) {
    console.error(err)
  }
}
