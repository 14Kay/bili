/*
 * @Description: 
 * @Author: 14K
 * @Date: 2023-05-20 16:35:34
 * @LastEditTime: 2023-05-20 16:35:35
 * @LastEditors: 14K
 */
export function validateBV(bvid: string): boolean {
    const bvRegex = /^BV[0-9A-Za-z]{10}$/;
    return bvRegex.test(bvid);
}