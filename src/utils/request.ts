/*
 * @Description: 
 * @Author: 14K
 * @Date: 2023-05-19 14:07:33
 * @LastEditTime: 2023-05-20 00:44:19
 * @LastEditors: 14K
 */
import axios, { Method } from "axios";
import FormData from "form-data";
import * as qs from "qs";
import { Credential } from "./../types/credential";

interface PublicKey {
    code: number
    message?: string
}

type WithoutCode<T> = T extends { code: number } ? Omit<T, 'code'> : T;

type PublicResponse<T> = WithoutCode<T> & PublicKey;

export class Request {
    static userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36";
    static referer = "https://www.bilibili.com";

    static async request<Response>(url: string, method: Method, params: Object = {},
        data?: string | Object | FormData, credential?: Credential): Promise<PublicResponse<Response>> {
        const headers = {
            "User-Agent": this.userAgent,
            "Referer": this.referer,
            "Cookie": credential?.cookieStr || "",
            "Content-Type": this.getContentType(data)
        };

        return axios<PublicResponse<Response>>(url, {
            method,
            headers,
            params,
            data,
        }).then(res => res.data);
    }

    static async get<Response>(url: string, params: Object = {}, credential?: Credential): Promise<PublicResponse<Response>> {
        return this.request<Response>(url, "GET", params, {}, credential);
    }

    static async post<Response>(url: string, data: string | Object | FormData, credential?: Credential): Promise<PublicResponse<Response>> {
        if (typeof data === 'object' && data !== null) {
            if (data.constructor === FormData) {
              data = qs.stringify(data);
            }
        }
        return this.request<Response>(url, "POST", {}, data, credential);
    }
    static getContentType(data: string | Object | FormData | undefined): string {
        if (typeof data === 'object' && data !== null) {
            if (data.constructor === FormData) {
              return data.getHeaders()['content-type'];
            }
        }
        return "application/x-www-form-urlencoded";
    }
}