/*
 * @Description: 
 * @Author: 14K
 * @Date: 2023-05-19 13:59:34
 * @LastEditTime: 2023-05-20 00:33:41
 * @LastEditors: 14K
 */

import { Request } from "./../utils/request"
import { LoginQRcodeURL, LoginInfoResponse } from "./../types/login"
import { Credential } from "./../types/credential"
import  * as qrcode from "qrcode";
import { URLSearchParams } from 'url';
import { LoginError } from "./../error/login"
export class Login {
    constructor() {}
    
    private static getQRcodeURL(){
        return Request.get<LoginQRcodeURL>("https://passport.bilibili.com/qrcode/getLoginUrl")
    }
    private static async getQRloginInfo(oauthKey: string): Promise<LoginInfoResponse> {
        return Request.post<LoginInfoResponse>(
            "https://passport.bilibili.com/qrcode/getLoginInfo",{ oauthKey })
    }
    private static async renderQRcode(
        url: string,
        output: "string" | "buffer" | "terminal" = "buffer"){
        switch (output) {
            case "string": return qrcode.toString(url);
            case "buffer": return qrcode.toBuffer(url);
            case "terminal": {
                console.log("打开手机进行扫码，请在3分钟内完成");
                console.log(await qrcode.toString(url));
                return Promise.resolve();
            }
        }
    }
    static async loginWithQRcode(
        output: "string" | "buffer" | "terminal" = "buffer",
        callback: (credential: Credential) => any = function () { },){
        const qrcodeInfo = await this.getQRcodeURL()
        
        let countDown = 60;
        const checkScanResult = setInterval(async () => {
            const result = await this.getQRloginInfo(qrcodeInfo.data.oauthKey)
            if (typeof result.data !== 'number') {
                clearInterval(checkScanResult)
                const params = this.parseURLParams(result.data.url.split("?")[1])
                callback(new Credential(params['SESSDATA'], params['bili_jct'],{
                    uid: Number(params['DedeUserID']),
                    refreshToken: result.data.refresh_token,
                    dedeUserIdCkMd5: params['DedeUserID__ckMd5'],
                    timestamp: result.data.timestamp
                }))  
            }else{
                countDown--;
                if (countDown === 0) {
                    clearInterval(checkScanResult);
                    switch (result.data) {
                        case -1:
                            throw new LoginError("秘钥错误");
                        case -2:
                            throw new LoginError("密钥超时");
                        case -4:
                            throw new LoginError("未扫描");
                        case -5:
                            throw new LoginError("未确认");
                        default:
                            throw new LoginError("未知错误");
                    }
                }
            }
        }, 3000)
        return await this.renderQRcode(qrcodeInfo.data.url, output)
    }

    static parseURLParams(urlString: string): Record<string, string> {
      const parsedUrl = new URLSearchParams(urlString);
      const params: Record<string, string> = {};
      for (const [key, value] of parsedUrl.entries()) {
        params[key] = value;
      }
      return params;
    }
}