import http from "@/utils/http/index";

// 根据ID获取律师信息
export function apiGetLawyerById(id) {
    return http.get("/lawyer/getLawyerById", id, ({
        data: {
            id: id
        },

    }));
}

// 获取所有律师数据
export function apiGetAllLawyers() {
    return http.get("/lawyer/getAllLawyers", null, null);
}

// 搜索律师
export function apiSearchLawyers(params) {
    return http.post("/lawyer/searchLawyers", params);
}

// 更新律师信息
export function apiUpdateLawyerInfo(lawyerInfo) {
    return http.post("/lawyer/updateLawyerInfo", lawyerInfo);
}

// 获取律师订单历史
export function apiGetLawyerOrders(lawyerId) {
    return http.get("/lawyer/getOrders", null, {
        params: {
            lawyerId: lawyerId
        }
    });
}