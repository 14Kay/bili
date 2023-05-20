/*
 * @Description: 
 * @Author: 14K
 * @Date: 2023-05-20 22:42:42
 * @LastEditTime: 2023-05-20 23:32:42
 * @LastEditors: 14K
 */
export interface RoomId {
    roomid: number;
}
export interface DanmakuData extends RoomId{
    msg: string;
    color?:  string
    fontsize?: string
}
export interface PostDanmakuData{
    msg: string
    bvid: string
    mode?: 1 | 4 | 5 | 7
    progress?: number
    color?: number
    fontsize?:  12 | 16 | 18 | 25 | 36 | 45 | 64
    pool?: 0 | 1 | 2
    oid?: number
}
export interface SendVideoDanmakuResponse{
    ttl: number
    data: {
        action: string
        dm_id: number
        dmid_str: string
        visible: boolean
    }
}