/*
 * @Description: 
 * @Author: 14K
 * @Date: 2023-05-19 15:15:58
 * @LastEditTime: 2023-05-20 00:39:44
 * @LastEditors: 14K
 */
export class Credential {
    public cookie: {
        SESSDATA: string;
        bili_jct: string;
    };
    public cookieStr: string;
    public csrf: string;
    public uid: number;
    public devId!: string;
    public refreshToken!: string;
    public timestamp: number;
    public dedeUserIdCkMd5: string;

    constructor(SESSDATA: string, biliJct: string,
        extraData?: {
            uid?: number, devId?: string, refreshToken?: string,
            timestamp?: number, dedeUserIdCkMd5?: string
        }) {
        this.cookie = { SESSDATA, bili_jct: biliJct };
        this.csrf = biliJct;
        this.uid = extraData?.uid ?? 0;
        this.refreshToken = extraData?.refreshToken ?? "";
        this.timestamp = extraData?.timestamp ?? Date.now();
        this.dedeUserIdCkMd5 = extraData?.dedeUserIdCkMd5 ?? "";
        this.cookieStr = this.formatCookie(this.cookie)
        if (extraData?.devId) {
            if (!/[\dA-F]{8}-[\dA-F]{4}-4[\dA-F]{3}-[\dA-F]{4}-[\dA-F]{12}/.test(extraData?.devId)) {
                throw new Error("dev_id不符合规范,请重新生成");
            }
        }
        else {
            this.devId = this.generateDevId()
        }
        return this;
    }
    generateDevId(): string {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (name: string) => {
            const randomInt = 16 * Math.random() | 0;
            return (name === "x" ? randomInt : 3 & randomInt | 8).toString(16).toUpperCase();
        });
    }
    formatCookie(cookie: { SESSDATA: string; bili_jct: string }): string {
        return Object.entries(cookie)
            .map(([key, value]) => `${key}=${value}`)
            .join('; ');
    }
}