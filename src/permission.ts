import router from './router';
import store from './stores';
import NProgress from 'nprogress'; // 进度条
import 'nprogress/nprogress.css'; // progress bar style
import API from '@/api/index';

NProgress.configure({
  showSpinner: false,
});

router.beforeEach((to, from, next) => {
  // 进度条开始
  NProgress.start();

  if (to.path === '/login') {
    sessionStorage.clear();
    store.commit('SETKEY', '');
    store.commit('SETCONFIG', null);
    next();
  } else {
    // 有配置直接去对应的页面
    if (store.getters.pageConfig) {
      next();
    } else {
      if (sessionStorage.getItem('KEY')) {
        // 拉取新的配置
        const key = sessionStorage.getItem('KEY');
        API.getConfig(key).then((res: any) => {
          store.commit('SETKEY', key);
          store.commit('SETCONFIG', res.info);
          next();
        }).catch(() => {
          NProgress.done();
        });
      } else {
        NProgress.done();
        next('/login');
      }
    }
  }
});

router.afterEach((to, from) => {
  // 进度条结束
  NProgress.done();
});
