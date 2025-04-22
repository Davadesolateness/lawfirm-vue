import http from "@/utils/http/index";

/**
 * 获取用户的所有订单列表
 * @param {Number} userId - 用户ID
 * @returns {Promise} - 返回订单列表数据的Promise
 */
export function apiGetUserOrders(userId) {
  return http.get("/order/getUserOrders", {
    userId: userId
  });
}

/**
 * 获取订单详情
 * @param {Number} orderId - 订单ID
 * @returns {Promise} - 返回订单详情数据的Promise
 */
export function apiGetOrderDetail(orderId) {
  return http.get("/order/getOrderDetail", {
    orderId: orderId
  });
}

/**
 * 按条件搜索订单
 * @param {Object} params - 搜索参数对象
 * @returns {Promise} - 返回搜索结果的Promise
 */
export function apiSearchOrders(params) {
  return http.post("/order/searchOrders", params);
}

/**
 * 分页获取订单列表
 * @param {Object} params - 分页参数
 * @returns {Promise} - 返回分页数据的Promise
 */
export function apiGetOrdersPage(params) {
  return http.post("/order/getOrdersPage", params);
} 