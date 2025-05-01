import http from "@/utils/http/index";


export function apiGetLawyerInfoById(id) {
    return http.get("/getLawyerInfoById", id, ({
        data: {
            id: id
        },
    }));
}

// 获取所有律师数据
export function apiGetAllLawyers() {
    return http.get("/lawyer/getAllLawyers",null,null);
}

// 搜索律师
export function apiSearchLawyers() {
    return http.get("/lawyer/getSearchLawyers",null,null);
}