// +----------------------------------------------------------------------
// | CRMEB [ CRMEB赋能开发者，助力企业发展 ]
// +----------------------------------------------------------------------
// | Copyright (c) 2016~2021 https://www.crmeb.com All rights reserved.
// +----------------------------------------------------------------------
// | Licensed CRMEB并不是自由软件，未经许可不能去掉CRMEB相关版权
// +----------------------------------------------------------------------
// | Author: CRMEB Team <admin@crmeb.com>
// +----------------------------------------------------------------------
import BasicLayout from '@/layouts/basic-layout';
import Setting from '@/setting';
const meta = {
  auth: true
};

const pre = 'promotion_';

export default {
  path: `${Setting.roterPre}/promotion`,
  name: 'promotion',
  header: 'promotion',
  // redirect: {
  //     name: `${pre}list`
  // },
  meta,
  component: BasicLayout,
  children: [
    {
      path: `${Setting.roterPre}/promotion/list`,
      name: `${pre}list`,
      meta: {
        auth: ['admin-promotion'],
        title: '用户列表'
      },
      component: () => import('@/pages/user/list/index')
    }
  ]
};
