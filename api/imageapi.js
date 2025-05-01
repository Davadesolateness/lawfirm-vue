import http from "@/utils/http/index";


// 上传用户头像
export function apiUploadUserAvatar(url,filePath,userId) {
    return http.uploadFile(url, filePath, {
        formData: {userId}
    });
}