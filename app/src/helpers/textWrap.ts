/**
 * Wraps a string around each character/letter
 *
 * @param {string} str The string to transform
 * @param {string} tmpl Template that gets interpolated
 * @returns {string} The given input as splitted by chars/letters
 */
 export function wrapChars(str, tmpl) {
  return str.replace(/\w/g, tmpl || "<span>$&</span>");
}

/**
 * Wraps a string around each word
 *
 * @param {string} str The string to transform
 * @param {string} tmpl Template that gets interpolated
 * @returns {string} The given input splitted by words
 */
 export function wrapWords(str, tmpl) {
  return str.replace(/\w+/g, tmpl || "<span>$&</span>");
}

/**
 * Wraps a string around each line
 *
 * @param {string} str The string to transform
 * @param {string} tmpl Template that gets interpolated
 * @returns {string} The given input splitted by lines
 */
 export function wrapLines(str, tmpl) {
  return str.replace(/.+$/gm, tmpl || "<span>$&</span>");
}