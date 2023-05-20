/*
 * @Description: 
 * @Author: 14K
 * @Date: 2023-05-19 11:46:30
 * @LastEditTime: 2023-05-20 16:15:39
 * @LastEditors: 14K
 */
import { Request } from "./../utils/request"
import { Credential } from "./../types/credential"
import { UserInfoResponse, UserInfoFromSearch, UserInfo, SearchUserResponse } from "./../types/user"
import { Coins } from "./coins"
import { messages } from "./../common/code2message"

export class User{
    constructor(private credential: Credential){}
    static async info(mid: number): Promise<UserInfoResponse<UserInfo>>{
        return Request.get<UserInfoResponse<UserInfo>>(
            "https://api.bilibili.com/x/space/acc/info",
            { mid },
        )
    }

    static async checkNickname(nickname: string): Promise<{code: number,message: string}> {
        return Request.get<{}>(
            "https://passport.bilibili.com/web/generic/check/nickname",
            { nickname },
        ).then(res => {
            const messages = {
                "0":     "昵称未被注册",
                "2001":  "该昵称已被他人使用",
                "40002": "昵称包含敏感信息",
                "40004": "昵称不可包含除-和_以外的特殊字符",
                "40005": "昵称过长（超过16字符）",
                "40006": "昵称过短（少于2字符）",
                "40014": "昵称已存在",
            }
            return {
                code: res.code,
                message: messages[String(res.code)]
            }
        });
    }
    private async follow(uid: number, act: 1 | 2 | 3 | 4 = 1, from: 11 | 14 | 115 | 222 = 11,): Promise<{code: number, message: string}> {
        return this.modifyRelation(uid, act, from);
    }
    private async unfollow(uid: number, from: 11 | 14 | 115 | 222 = 11, ): Promise<{code: number, message: string}> {
        return this.modifyRelation(uid, 2, from);
    }
    static async searchUser(keyword: string): Promise<UserInfoFromSearch[]> {
        return Request.get<UserInfoResponse<SearchUserResponse>>(
            "https://app.bilibili.com/x/v2/search/type",
            {
                keyword,
                build: 63800200,
                order: "fans",
                type: 2,
            },
        ).then(res => res.data.items || []);
    }

    private async modifyRelation(fid: number, act: 1 | 2 | 3 | 4 | 5 | 6 | 7 = 1, from: 11 | 14 | 115 | 222 = 11): Promise<{code: number, message: string}> {
        if(!fid) throw new Error("fid is required");
        return Request.get<{ttl: number}>(
            "https://api.bilibili.com/x/relation/modify",
            {
                fid,
                act,
                re_src: from,
                csrf: this.credential.csrf,
            },
        ).then(res => {
            return {
                code: res.code,
                message: messages[String(res.code)]
            }
        });
    }
    private async getCoinHistory(){
        return Coins.getCoinsList(this.credential.uid, this.credential);
    }
}