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
const pre = 'finance_';
export default {
  path: `${Setting.roterPre}/finance`,
  name: 'finance',
  header: 'finance',
  meta: {
    // 授权标识
    auth: ['admin-finance']
  },
  // redirect: {
  //     name: `${pre}cashApply`
  // },
  component: BasicLayout,
  children: [
    {
      path: 'user_extract/index',
      name: `${pre}cashApply`,
      meta: {
        auth: ['finance-user_extract'],
        title: '提现申请'
      },
      component: () => import('@/pages/finance/userExtract/index')
    },
    {
      path: 'user_extract/wallet',
      name: `${pre}cashApply`,
      meta: {
        auth: ['finance-user_extract'],
        title: '钱包提现申请'
      },
      component: () => import('@/pages/finance/userExtract/wallet')
    },
    {
      path: 'user_recharge/index',
      name: `${pre}recharge`,
      meta: {
        auth: ['finance-user-recharge'],
        title: '充值记录'
      },
      component: () => import('@/pages/finance/financialRecords/recharge')
    },
    {
      path: 'report/index',
      name: `${pre}report`,
      meta: {
        auth: ['finance-user-report'],
        title: '财务报表'
      },
      component: () => import('@/pages/finance/financialRecords/report')
    },
    {
      path: 'finance/bill',
      name: `${pre}bill`,
      meta: {
        auth: ['finance-finance-bill'],
        title: '资金记录'
      },
      component: () => import('@/pages/finance/financialRecords/bill')
    },
    {
      path: 'finance/commission',
      name: `${pre}commissionRecord`,
      meta: {
        auth: ['finance-finance-commission'],
        title: '佣金记录'
      },
      component: () => import('@/pages/finance/commission/index')
    },
    {
      path: 'task_records/index',
      name: `${pre}taskRecords`,
      meta: {
        auth: ['finance-task-records'],
        title: '任务记录'
      },
      component: () => import('@/pages/finance/taskRecords/index')
    },
    {
      path: 'deposit/index',
      name: `${pre}deposit`,
      meta: {
        auth: ['finance-deposit-index'],
        title: '基金列表'
      },
      component: () => import('@/pages/finance/deposit/index')
    },
    {
      path: 'channel/index',
      name: `${pre}channel`,
      meta: {
        auth: ['finance-channel-index'],
        title: '通道列表'
      },
      component: () => import('@/pages/finance/channel/index')
    }
  ]
};
