// +----------------------------------------------------------------------
// | CRMEB [ CRMEB赋能开发者，助力企业发展 ]
// +----------------------------------------------------------------------
// | Copyright (c) 2016~2021 https://www.crmeb.com All rights reserved.
// +----------------------------------------------------------------------
// | Licensed CRMEB并不是自由软件，未经许可不能去掉CRMEB相关版权
// +----------------------------------------------------------------------
// | Author: CRMEB Team <admin@crmeb.com>
// +----------------------------------------------------------------------
import request from '@/plugins/request';

/**
 * @description 基金管理--列表
 * @param {Object} param data {Object} 传值参数
 */
export function depositListApi(data) {
    return request({
        url: 'deposit/list',
        method: 'get',
        params: data
    });
}
/**
 * 保存基金
 * @param {*} data data
 */
export function depositSaveApi(data) {
    return request({
        url: `/deposit/save`,
        method: 'post',
        data
    });
}
/**
 * 修改基金
 * @param {*} data data
 */
export function depositUpdateApi(id,data) {
    return request({
        url: `/deposit/update/${id}`,
        method: 'post',
        data
    });
}

/**
 *设置状态
 */
export function setStatusApi(data) {
    return request({
        url: `/deposit/setStatus`,
        method: 'post',
        data
    });
}
/**
 *基金删除
 */
export function depositDeleteApi(id) {
    return request({
        url: `/deposit/delete/${id}`,
        method: 'post',
    });
}
/**
 *购买记录
 */
export function userDepositApi(data) {
    return request({
        url: `/deposit/user/list`,
        method: 'get',
        params: data
    });
}
/**
 *追加记录
 */
export function appendListApi(data) {
    return request({
        url: `/deposit/append/list`,
        method: 'get',
        params: data
    });
}
/**
 *利息记录
 */
export function interestListApi(data) {
    return request({
        url: `/deposit/interest/list`,
        method: 'get',
        params: data
    });
}
