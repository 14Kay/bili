/*
 * @Description: 
 * @Author: 14K
 * @Date: 2023-05-20 22:40:30
 * @LastEditTime: 2023-05-21 00:24:02
 * @LastEditors: 14K
 */
import { Credential } from "./../types/credential";
import { Request } from "./../utils/request";
import { danmakuMessages } from "./../common/code2message"
import { Return } from "./../types/common"
import { PostDanmakuData, SendVideoDanmakuResponse } from "./../types/danmaku"
import { Video } from "./video"
export class Danmaku{
    constructor(private credential: Credential){}
    async sendLiveRoomDanmaku(msg: string, roomid: number, color: string = "16777215",fontsize: number = 24): Promise<boolean> {
        return Request.post(
            "https://api.live.bilibili.com/msg/send",
            {
                csrf_token: this.credential.csrf,
                bubble: 0,
                csrf: this.credential.csrf,
                fontsize,
                color,
                msg,
                rnd: Math.ceil(new Date().getTime()/1000),
                mode: 1,
                roomid
            }
            , this.credential,
        ).then(res => res.code === 0);
    }
    async sendVideoDanmaku(input: PostDanmakuData){
        return await Danmaku.sendVideoDanmaku(input, this.credential);
    }
    static async sendVideoDanmaku(input: PostDanmakuData, credential: Credential): Promise<Return<number>> {
        const oid = input.oid || (await Video.details(input.bvid)).aid;
        const data = {
            csrf: credential.csrf,
            rnd: Math.ceil(new Date().getTime()/1000),
            mode: 1,
            pool: 0,
            fontsize: 25,
            color: 16777215,
            progress: 0,
            oid,
            type: 1,
            ...input
        }
        return Request.post<SendVideoDanmakuResponse>(
            "https://api.live.bilibili.com/msg/send",
            data,
            credential
        ).then(res => {
            return {
                code: res.code,
                message: danmakuMessages[String(res.code)]
            }
        });
    }
}
