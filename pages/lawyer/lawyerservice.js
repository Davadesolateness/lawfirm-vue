import {apiGetLawyerInfoById} from "@/api/lawyerapi";

// 根据id查询数据
export const getLawyerInfoById = (id) => {
    return apiGetLawyerInfoById(id);
}

export default {getLawyerInfoById}