import http from "@/utils/http/index";


export function apiGetLawyerInfoById(id) {
    return http.get("/getLawyerInfoById", id, ({
        data: {
            id: id
        },

    }));
}