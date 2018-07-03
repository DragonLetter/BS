import dynamic from 'dva/dynamic';

// wrapper of dynamic
const dynamicWrapper = (app, models, component) => dynamic({
  app,
  models: () => models.map(m => import(`../models/${m}.js`)),
  component,
});

// nav data
export const getNavData = app => [
  {
    component: dynamicWrapper(app, ['user', 'login'], () => import('../layouts/BasicLayout')),
    layout: 'BasicLayout',
    name: '首页', // for breadcrumb
    path: '/',
    children: [
      {
        name: '待办事项',
        icon: 'home',
        path: 'todolist',
        component: dynamicWrapper(app, [], () => import('../routes/todolist')),
      },
      {
        name: '国内信用证',
        icon: 'credit-card',
        path: 'locallc',
        component: dynamicWrapper(app, [], () => import('../routes/localLC')),
      },
      {
        name: '签约银行',
        icon: 'bank',
        path: 'bankList',
        component: dynamicWrapper(app, [], () => import('../routes/bankList')),
      },
      {
        name: '客户管理',
        icon: 'user',
        path: 'clientlist',
        component: dynamicWrapper(app, [], () => import('../routes/clientList')),
      },
      {
        name: '业务设置',
        icon: 'setting',
        path: 'settings',
        component: dynamicWrapper(app, [], () => import('../routes/settings')),
      },
      {
        name: '区块链浏览器',
        icon: 'area-chart',
        path: 'browser',
        component: dynamicWrapper(app, [], () => import('../routes/blockBrowser')),
      },
    ],
  },
];

export const getUserNavData = app => [
  {
    component: dynamicWrapper(app, [], () => import('../layouts/UserLayout')),
    path: '/user',
    layout: 'UserLayout',
    children: [
      {
        name: '帐户',
        icon: 'user',
        path: 'user',
        children: [
          {
            name: '登录',
            path: 'login',
            component: dynamicWrapper(app, ['login'], () => import('../routes/User/Login')),
          },
          {
            name: '注册',
            path: 'register',
            component: dynamicWrapper(app, ['register'], () => import('../routes/User/Register')),
          },
          {
            name: '注册结果',
            path: 'register-result',
            component: dynamicWrapper(app, [], () => import('../routes/User/RegisterResult')),
          },
        ],
      },
    ],
  },
];
