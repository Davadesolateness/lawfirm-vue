import http from "@/utils/http/index";

export function apiGetUserInfo() {
    return http.get("/getUserInfo", null, null);
}


export function apiGetUserInfoById(id) {
    return http.get("/getUserInfoById", id, ({
        data: {
            id: id
        },

    }));
}