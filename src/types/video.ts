/*
 * @Description: 
 * @Author: 14K
 * @Date: 2023-05-20 16:38:17
 * @LastEditTime: 2023-05-20 23:37:19
 * @LastEditors: 14K
 */
import { VideoBaseInfo } from "./coins"
export interface PageListReturn {
    cid:       number;
    page:      number;
    from:      string;
    part:      string;
    duration:  number;
    vid:       string;
    weblink:   string;
    dimension: Dimension;
}

export interface VideoDetails extends VideoBaseInfo {
    desc_v2:   DescV2[];
    no_cache:  boolean;
    pages:     Page[];
    subtitle:  Subtitle;
    user_garb: UserGarb;
    is_story:  boolean;
    is_upower_exclusive: boolean;
    is_chargeable_season: boolean;
    is_upower_player:    boolean;
    label:     Label;
    is_season_display:   boolean;
    honor_reply:        HonorReply;
    like_icon: string
    need_jump_bv: string
    teenage_mode: number
    premiere: null
}
export interface PopularVideo extends Omit<VideoBaseInfo,'mission_id'>{
    mission_id?: number
    season_id?: number;
    short_link_v2: string;
    up_from_v2?:    number;
    first_frame:   string;
    pub_location?:  string;
    rcmd_reason:   RcmdReason
    ogv_info: null
}

interface RcmdReason{
    content: string
    corner_mark: number
}
interface HonorReply{
    honor:{
        aid: number
        type: number
        desc: string
        weekly_recommend_num: number
    }[]
}
interface Label {
    type: number;
}
interface DescV2 {
    raw_text: string;
    type:     number;
    biz_id:   number;
}

interface Dimension {
    width:  number;
    height: number;
    rotate: number;
}

interface Page {
    cid:       number;
    page:      number;
    from:      string;
    part:      string;
    duration:  number;
    vid:       string;
    weblink:   string;
    dimension: Dimension;
}

export interface StatResponse {
    aid:        number;
    bvid:       string;
    view:       number;
    danmaku:    number;
    reply:      number;
    favorite:   number;
    coin:       number;
    share:      number;
    like:       number;
    now_rank:   number;
    his_rank:   number;
    no_reprint: number;
    copyright:  1 | 2;
    argue_msg:  string;
    evaluation: string;
}

interface Subtitle {
    allow_submit: boolean;
    list:         any[];
}

interface UserGarb {
    url_image_ani_cut: string;
}


export interface FavlistResponse {
    code: 0 | -101 | -111 | -400 | -403 | 10003 | 11201 | 11202 | 11203 | 72010017
    data: {
        prompt: boolean
    }
}

export interface LikeResponse {
    code: 0 | -101 | -111 | -400 | -403 | 10003 | 65004 | 65006
    message: string
    ttl: number
}