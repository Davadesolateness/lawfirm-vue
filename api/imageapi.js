import http from "@/utils/http/index";


// 上传法人、个人用户头像
export function apiUploadUserAvatar(url,filePath,userId) {
    return http.uploadFile(url, filePath, {
        formData: {userId}
    });
}

// 上传律师用户头像
export function apiUploadLawyerAvatar(url,filePath,userId) {
    return http.uploadFile(url, filePath, {
        formData: {userId}
    });
}

// 上传管理员头像
export function apiUploadAdminAvatar(url,filePath,userId) {
    return http.uploadFile(url, filePath, {
        formData: {userId}
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