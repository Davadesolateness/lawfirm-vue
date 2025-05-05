import http from "@/utils/http/index";


// 上传用户头像
export function apiUploadUserAvatar(url,filePath,userId) {
    return http.uploadFile(url, filePath, {
        formData: {userId}
    });
}

export function apiUploadLawyerAvatar(url,filePath,lawyerId) {
    return http.uploadFile(url, filePath, {
        formData: {lawyerId}
    });
}


// 根据ID获取头像
export function apiGetAvatarById(userId) {
    return http.get("/image/getAvatar", null, {
        params: {
            userId: userId
        }
    });
}

// 根据ID获取律师头像
export function apiGetLawyerAvatarById(lawyerId) {
    return http.get("/image/getLawyerAvatar", null, {
        params: {
            lawyerId: lawyerId
        }
    });
}

export function apiGetIndividualDetails(id) {
    return http.get("/user/getIndividualDetails", id, ({
        data: {
            userId: id
        },

    }));
}