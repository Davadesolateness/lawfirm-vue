import http from "@/utils/http/index";

export function getUserInfo(data) {
    return http.get("/getUserInfo",data,({
        data: data,
        options : {
            showLoading: false
        }
    }));
}
