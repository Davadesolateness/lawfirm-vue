import request from "@/utils/request";

export function getUserInfo(data){
    return request({
        url: "/getUserInof",
        method: "POST",
        data: data,
        headers: {
            "Content-Type": "application/json"
        }
    });
}
