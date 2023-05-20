/*
 * @Description: 
 * @Author: 14K
 * @Date: 2023-05-20 12:40:09
 * @LastEditTime: 2023-05-20 16:35:53
 * @LastEditors: 14K
 */
import { AddCoinResponse, CoinsResponse, TripleResponse } from "./../types/coins";
import { Credential } from "./../types/credential";
import { Request } from "./../utils/request";
import { messages } from "./../common/code2message"
import { Return } from "./../types/common"
import { validateBV } from "./../utils/verifyBVid"
export class Coins {
    constructor(private credential: Credential) {}
    async getCoinsList(): Promise<CoinsResponse> {
        return Coins.getCoinsList(this.credential.uid, this.credential);
    }
    
    static async getCoinsList(vmid: number, credential: Credential): Promise<CoinsResponse> {
        return Request.get<CoinsResponse>(
            "https://api.bilibili.com/x/space/coin/video",
            { vmid },
            credential
        ) as Promise<CoinsResponse>
    }
    static async coin(bvid: string, credential: Credential, multiply: number = 1, like: boolean = true): Promise<Return<AddCoinResponse['code']>> {
        if (!validateBV(bvid)) throw new Error("bvid格式错误");
        return Request.post<AddCoinResponse>(
            "https://api.bilibili.com/x/web-interface/coin/add",
            {
                bvid,
                multiply,
                select_like: like,
                csrf: credential.csrf,
            },
            credential,
        ).then(res => {
            return {
                code: res.code,
                message: messages[String(res.code)]
            } as Return<AddCoinResponse['code']>
        });
    }
    static async triple(bvid: string, credential: Credential): Promise<Return<TripleResponse['code']>> {
        if (!validateBV(bvid)) throw new Error("bvid格式错误");
        return Request.post<TripleResponse>(
            "http://api.bilibili.com/x/web-interface/archive/like/triple",
            {
                bvid,
                csrf: credential.csrf,
            },
            credential,
        ).then(res => {
            return {
                code: res.code,
                message: messages[String(res.code)]
            } as Return<TripleResponse['code']>
        });
    }
}