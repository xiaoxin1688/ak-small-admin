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
 *浏览记录
 */
export function browserListApi(data) {
    return request({
        url: `/system/user/browser`,
        method: 'get',
        params: data
    });
}
/**
 *用户记录
 */
export function userListApi(data) {

    return request({
        url: `/system/user/browser/list`,
        method: 'get',
        params: data
    });
}
