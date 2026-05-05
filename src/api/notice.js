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
 * @description --列表
 * @param {Object} param data {Object} 传值参数
 */
export function listApi(data) {
    return request({
        url: 'system/notice/list',
        method: 'get',
        params: data
    });
}
/**
 * 保存基金
 * @param {*} data data
 */
export function saveApi(data) {
    return request({
        url: `/system/notice/save`,
        method: 'post',
        data
    });
}
/**
 * 修改基金
 * @param {*} data data
 */
export function updateApi(id,data) {
    return request({
        url: `/system/notice/update/${id}`,
        method: 'post',
        data
    });
}

/**
 *设置状态
 */
export function setStatusApi(data) {
    return request({
        url: `/system/notice/setStatus`,
        method: 'post',
        data
    });
}
/**
 *基金删除
 */
export function deleteApi(id) {
    return request({
        url: `/system/notice/delete/${id}`,
        method: 'post',
    });
}
