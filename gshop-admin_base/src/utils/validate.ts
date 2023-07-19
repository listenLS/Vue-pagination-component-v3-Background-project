/**
 * 判断是否是外链
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternalFn(path: string) {
  return /^(https?:|mailto:|tel:)/.test(path)
}