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
* @description 银行卡 -- 创建
*/
export function bankCreateApi(data) {
  return request({
    url: `setting/group_data`,
    method: 'post',
    data
  });
}
/**
**
* @description 银行卡 -- 修改/编辑
*/
export function bankEditApi(id, data) {
  return request({
    url: `setting/group_data/${id}`,
    method: 'put',
    data
  });
}
