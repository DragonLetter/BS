import React from 'react';
import { Router, Route, Switch } from 'dva/router';
import { LocaleProvider, Spin } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import dynamic from 'dva/dynamic';
import cloneDeep from 'lodash/cloneDeep';
import { getNavData, getUserNavData } from './common/nav';
import { getPlainNode } from './utils/utils';

import styles from './index.less';

dynamic.setDefaultLoadingComponent(() => {
  return <Spin size="large" className={styles.globalSpin} />;
});

function getRouteData(navData, userNavData, path) {
  if ((!navData.some(item => item.layout === path) ||
    !(navData.filter(item => item.layout === path)[0].children)) &&
    (!userNavData.some(item => item.layout === path) ||
    !(userNavData.filter(item => item.layout === path)[0].children))){
      return null;
  }
  const route = cloneDeep((navData.filter(item => item.layout === path)[0]) || userNavData.filter(item => item.layout === path)[0]);
  const nodeList = getPlainNode(route.children);
  return nodeList;
}

function getLayout(navData, path) {
  if (!navData.some(item => item.layout === path) ||
    !(navData.filter(item => item.layout === path)[0].children)) {
    return null;
  }
  const route = navData.filter(item => item.layout === path)[0];
  return {
    component: route.component,
    layout: route.layout,
    name: route.name,
    path: route.path,
  };
}

function RouterConfig({ history, app }) {
  const navData = getNavData(app);
  const userNavData = getUserNavData(app);
  const UserLayout = getLayout(userNavData, 'UserLayout').component;
  const BasicLayout = getLayout(navData, 'BasicLayout').component;

  const passProps = {
    app,
    navData,
    userNavData,
    getRouteData: (path) => {
      return getRouteData(navData, userNavData, path);
    },
  };

  return (
    <LocaleProvider locale={zhCN}>
      <Router history={history}>
        <Switch>
          <Route path="/user" render={props => <UserLayout {...props} {...passProps} />} />
          <Route path="/" render={props => <BasicLayout {...props} {...passProps} />} />
        </Switch>
      </Router>
    </LocaleProvider>
  );
}

export default RouterConfig;
