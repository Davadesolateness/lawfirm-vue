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

// 通过id获取个人用户详情
export function apiGetIndividualDetails(id) {
    return http.get("/user/getIndividualDetails", id, ({
        data: {
            id: id
        },

    }));
}

// 通过id获取法人用户详情
export function apiGetCorporateDetails(id) {
    return http.get("/user/getCorporateDetails", id, ({
        data: {
            id: id
        },
    }));
}