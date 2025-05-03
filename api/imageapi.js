import http from "@/utils/http/index";


// 上传用户头像
export function apiUploadUserAvatar(url,filePath,userId) {
    return http.uploadFile(url, filePath, {
        formData: {userId}
    });
}

// 上传用户头像
export function apiGetAvatarById(id) {
    return http.get("/image/getAvatarById", id, ({
        data: {
            id: id
        },
    }));
}

export function apiGetIndividualDetails(id) {
    return http.get("/user/getIndividualDetails", id, ({
        data: {
            userId: id
        },

    }));
}