import {http} from "@/utils/http";

export function getUserInfo(data) {
    return http.get({
        url: "/getUserInfo",
        data: data,
        headers: {
            "Content-Type": "application/json"
        }
    });
}
