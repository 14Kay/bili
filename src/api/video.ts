/*
 * @Description: 
 * @Author: 14K
 * @Date: 2023-05-20 16:29:43
 * @LastEditTime: 2023-05-21 13:56:54
 * @LastEditors: 14K
 */
import { Credential } from "./../types/credential";
import { Request } from "./../utils/request";
import { messages } from "./../common/code2message"
import { Return } from "./../types/common"
import { validateBV } from "./../utils/verifyBVid"
import { VideoDetails, FavlistResponse, PopularVideo, LikeResponse} from "./../types/video"
import BvCode from "./../common/bvcode"
import { Coins } from "./coins"
import { Danmaku } from "./danmaku"
import { PostDanmakuData } from "./../types/danmaku"


export class Video{
    bvid: string
    constructor(bvid: string, private credential: Credential){
        if (!validateBV(bvid)) throw new Error("bvid格式错误");
        this.bvid = bvid;
    }
    async details(): Promise<VideoDetails> {
        return Request.get<VideoDetails>(
            "http://api.bilibili.com/x/web-interface/view",
            { bvid: this.bvid },
            this.credential,
        )
    }
    static async details(bvid: string): Promise<VideoDetails> {
        return Request.get<VideoDetails>(
            "http://api.bilibili.com/x/web-interface/view",
            { bvid },
        )
    }
    async desc(): Promise<string> {
        return Video.desc(this.bvid);
    }
    static async desc(bvid: string): Promise<string> {
        return Request.get<{ttl: number, data: string}>(
            "http://api.bilibili.com/x/web-interface/archive/desc",
            { bvid },
        ).then(res => {
            return res.data;
        });
    }
    static async getRandomBVid(count: number = 1): Promise<string[]> {
        if(count > 20 || count < 1) throw new Error("count不能大于20");
        const list = await Video.getPopular()
        const subset = Video.getRandomSubsetFromArray(list, count);
        return subset.map(item => item.bvid);
    }
    static async getPopular(): Promise<PopularVideo[]> {
        return Request.get<{
            ttl: number
            message: string
            data: {
                list: PopularVideo[]
                no_more: boolean
            }
        }>(
            "https://api.bilibili.com/x/web-interface/popular",
            { ps: 20, pn: 1 },
        ).then(res => res.data.list);
    }
    static getRandomSubsetFromArray<T>(array: T[], count: number): T[] {
        const subset: T[] = array.slice();

        for (let i = subset.length - 1; i > 0; i--) {
            const randomIndex = Math.floor(Math.random() * (i + 1));
            [subset[i], subset[randomIndex]] = [subset[randomIndex], subset[i]];
        }

        return subset.slice(0, count);
    }
      
    async triple(){
        return Coins.triple(this.bvid, this.credential);
    }
    async coin(multiply: 1 | 2 = 1, like: boolean = true){
        return Coins.coin(this.bvid, this.credential, multiply, like);
    }
    async like(like: boolean = true): Promise<Return<LikeResponse['code']>> {
        return Request.post<LikeResponse>(
            "https://api.bilibili.com/x/web-interface/archive/like",
            {
                bvid: this.bvid,
                like: like ? 1 : 2,
                csrf: this.credential.csrf,
            },
            this.credential,
        ).then(res => {
            return{
                code: res.code,
                message: messages[String(res.code)]
            } as Return<LikeResponse['code']>
        });
    }
    async favlist({ addMediaIds, delMediaIds }:{
        addMediaIds?: number[], delMediaIds?: number[]
    }): Promise<Return<FavlistResponse['code']>> {
        const bvcode = new BvCode();
        const rid: number = bvcode.bv2av(this.bvid);
        return Request.post<FavlistResponse>(
            "https://api.bilibili.com/x/v3/fav/resource/deal",
            {
                rid,
                type: 2,
                add_media_ids: addMediaIds?.join(",") ?? "",
                del_media_ids: delMediaIds?.join(",") ?? "",
                csrf: this.credential.csrf,
            },
            this.credential,
        ).then(res => {
            return {
                code: res.code,
                message: messages[String(res.code)]
            } as Return<FavlistResponse['code']>
        });
    }
    
    async sendDanmaku(input: PostDanmakuData){
        return await Danmaku.sendVideoDanmaku(input, this.credential);
    }
}