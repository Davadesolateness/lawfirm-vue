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

/**
 * 创建通话订单
 * @param {Object} params - 通话订单参数
 * @param {Number} params.userId - 用户ID
 * @param {Number} params.lawyerId - 律师ID
 * @param {Number} params.duration - 预计通话时长（分钟）
 * @param {Number} params.fee - 费用
 * @returns {Promise} - 返回创建的订单信息
 */
export function apiCreateCallOrder(params) {
  return http.post("/order/createCallOrder", params);
}

/**
 * 完成通话订单
 * @param {Object} params - 通话完成参数
 * @param {String} params.orderId - 订单ID
 * @param {Number} params.actualDuration - 实际通话时长（分钟）
 * @param {Number} params.actualFee - 实际费用
 * @returns {Promise} - 返回订单完成结果
 */
export function apiCompleteCallOrder(params) {
  return http.post("/order/completeCallOrder", params);
}

/**
 * 扣减用户优惠次数
 * @param {Object} params - 扣减参数
 * @param {Number} params.userId - 用户ID
 * @param {String} params.orderId - 订单ID
 * @returns {Promise} - 返回扣减结果
 */
export function apiDeductUserDiscount(params) {
  return http.post("/user/deductDiscount", params);
}

/**
 * 获取用户优惠次数
 * @param {Number} userId - 用户ID
 * @returns {Promise} - 返回用户优惠次数信息
 */
export function apiGetUserDiscountInfo(userId) {
  return http.get("/user/getDiscountInfo", { userId });
} 