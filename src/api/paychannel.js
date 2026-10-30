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
        url: 'channel/list',
        method: 'get',
        params: data
    });
}
/**
 * 保存
 * @param {*} data data
 */
export function saveApi(data) {
    return request({
        url: `/channel/save`,
        method: 'post',
        data
    });
}
/**
 * 修改
 * @param {*} data data
 */
export function updateApi(id,data) {
    return request({
        url: `/channel/update/${id}`,
        method: 'post',
        data
    });
}

/**
 *设置状态
 */
export function channelStatusApi(data) {
    return request({
        url: `/channel/setStatus`,
        method: 'post',
        data
    });
}
/**
 *删除
 */
export function deleteApi(id) {
    return request({
        url: `/channel/delete/${id}`,
        method: 'post',
    });
}

export function configProvidersApi() {
    return request({
        url: '/channel/config/providers',
        method: 'get'
    });
}

export function getConfigApi(provider) {
    return request({
        url: `/channel/config/${encodeURIComponent(provider)}`,
        method: 'get'
    });
}

export function saveConfigApi(provider, data) {
    return request({
        url: `/channel/config/${encodeURIComponent(provider)}`,
        method: 'post',
        data
    });
}
