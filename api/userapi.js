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
            userId: id
        },

    }));
}

// 通过id获取法人用户详情
export function apiGetCorporateDetails(id) {
    return http.get("/user/getCorporateDetails", id, ({
        data: {
            userId: id
        },
    }));
}

// 上传用户头像
export function apiUploadAvatar(file) {
    const formData = new FormData();
    formData.append('file', file);
    
    return http.post("/user/uploadAvatar", formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}

// 更新用户头像
export function apiUpdateAvatar(userId, avatarUrl) {
    return http.post("/user/updateAvatar", {
        userId: userId,
        avatarUrl: avatarUrl
    });
}