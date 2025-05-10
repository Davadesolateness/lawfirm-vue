import http from "@/utils/http/index";

// 获取管理员详细信息
// 根据ID获取律师信息
export function apiGetAdminById(id) {
  return http.get("/admin/getAdministratorById", id, ({
    data: {
      id: id
    },

  }));
}