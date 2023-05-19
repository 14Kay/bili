/*
 * @Description: 
 * @Author: 14K
 * @Date: 2023-05-19 15:57:12
 * @LastEditTime: 2023-05-19 17:08:35
 * @LastEditors: 14K
 */

interface LoginPublicResponse {
    status: string
    ts: number
}
export interface LoginQRcodeURL extends LoginPublicResponse{
    data: {
        url: string
        oauthKey: string
    }
}

export interface LoginInfoSuccess {
    url: string;
    refresh_token: string;
    timestamp: number;
}
export interface LoginInfoResponse extends LoginPublicResponse{
    data: LoginInfoSuccess | -1 | -2 | -4 | -5
}
