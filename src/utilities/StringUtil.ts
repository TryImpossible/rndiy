/**
 * 是否为空
 * @param str
 */
export const isEmpty = (str: string) => str.length === 0;

/**
 * 是否为空白
 * @param str
 */
export const isBlank = (str: string) => trim(str).length === 0;

/**
 * 是否相等
 * @param str1
 * @param str2
 */
export const equals = (str1: string, str2: string) => str1 === str2;

/**
 * 反转字符串
 * @param str
 */
export const reverse = (str: string) =>
  str
    .split('')
    .reverse()
    .join('');

/**
 * 去除全部空格
 * @param str
 */
export const trim = (str: string) => str.replace(/\s+/g, '');

/**
 * 去除左边空格
 * @param str
 */
export const triml = (str: string) => str.replace(/^\s*/g, '');

/**
 * 去除右边空格
 * @param str
 */
export const trimr = (str: string) => str.replace(/\s*$/g, '');

/**
 * 去除前后空格
 * @param str
 */
export const trimlr = (str: string) => str.replace(/(^\s*)|(\s*$)/g, '');

// export function StringBuffer() {
//   this._strings_ = new Array();
// }

// StringBuffer.prototype.append = (str: string) => {
//   this._strings_.push(str);
// };

// StringBuffer.prototype.toString = () => {
//   this._strings_.join('');
// };
