/*
 * @Description: 
 * @Author: 14K
 * @Date: 2023-05-20 12:45:50
 * @LastEditTime: 2023-05-20 17:02:04
 * @LastEditors: 14K
 */
export interface CoinsResponse {
    code: 0 | 53013 | -400
    ttl: number;
    data: VidoeInfo[] | null;
}

export interface VideoBaseInfo {
    bvid:      string;
    aid:       number;
    videos:    number;
    tid:       number;
    tname:     string;
    copyright: 1 | 2;
    pic:       string;
    title:     string;
    pubdate:   number;
    ctime:     number;
    desc:      string;
    state:     number;
    duration:  number;
    rights:    { [key: string]: number };
    owner:     Owner;
    stat:      Stat;
    dynamic:   string;
    cid:       number;
    dimension: Dimension;
    mission_id:    number
}
export interface VidoeInfo extends VideoBaseInfo{
    season_id: number;
    short_link_v2: string;
    up_from_v2:    number;
    first_frame:   string;
    pub_location:  string;
    coins:         number;
    time:          number;
    ip:            string;
    inter_video:   boolean;
    resource_type: string;
    subtitle:  string;
}

interface Owner {
    mid:  number;
    name: string;
    face: string;
}
export interface Stat {
    aid:        number;
    view:       number;
    danmaku:    number;
    reply:      number;
    favorite:   number;
    coin:       number;
    share:      number;
    now_rank:   number;
    his_rank:   number;
    like:       number;
    dislike:    number;
    vt:         number;
    vv:         number;
}

export interface Dimension {
    width:  number;
    height: number;
    rotate: number;
}

export interface AddCoinResponse {
    code: 0 | -101 | -102 | -104 | -111 | -400 | 10003 | 34002 | 34003 | 34004 | 34005
    ttl: number;
    data: {
        like: boolean;
    }
}

export interface TripleResponse {
    code:   0 | -101 | -111 | -400 | 10003
    ttl: number;
    data:{
        coin:     boolean;
        fav:      boolean;
        like:     boolean;
        multiply: 1 | 2;
   }
}