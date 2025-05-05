import http from "@/utils/http/index";

/**
 * 获取用户的所有订单列表
 * @param {Object} params - 参数对象
 * @param {Number} params.userId - 用户ID
 * @param {Number} [params.pageNum=1] - 页码，从1开始
 * @param {Number} [params.pageSize=10] - 每页记录数
 * @returns {Promise} - 返回订单列表数据的Promise
 */
export function apiGetUserOrders(params) {
  return http.get("/order/getUserOrders", {
    ...params
  });
}

/**
 * 获取律师的所有订单列表
 * @returns {Promise} - 返回订单列表数据的Promise
 * @param params
 */
export function apiGetLawyerOrders(params) {
  return http.get("/order/getLawyerOrders", {
    ...params
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
 * @param {String} params.keyword - 搜索关键词(用户名或律师名)
 * @param {Number} [params.pageNum=1] - 页码，从1开始
 * @param {Number} [params.pageSize=10] - 每页记录数
 * @returns {Promise} - 返回搜索结果的Promise
 */
export function apiSearchOrders(params) {
  return http.get("/order/searchOrders", {
    ...params
  });
}

/**
 * 分页获取订单列表
 * @param {Object} params - 分页参数
 * @returns {Promise} - 返回分页数据的Promise
 */
export function apiGetOrdersPage(params) {
  return http.post("/order/getOrdersPage", params);
} 