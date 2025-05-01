import http from "@/utils/http/index";

// 用户注册
export function userRegister(data) {
    return http.post("/auth/registerUser", data);
}

// 律师申请注册
export function lawyerRegister(data) {
    return http.post("/auth/register", data);
} 