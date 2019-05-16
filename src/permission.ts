import router from './router';

import NProgress from 'nprogress'; // 进度条
import 'nprogress/nprogress.css'; // progress bar style

NProgress.configure({
  showSpinner: false,
});

router.beforeEach((to, from, next) => {
  // 进度条开始
  NProgress.start();

  if (to.path === '/') {
    next('/login');
  }

  if (to.path === '/login') {
    sessionStorage.clear();
    next();
  } else {
    if (sessionStorage.getItem('isLogin')) {
      next();
    } else {
      next('/login');
      NProgress.done();
    }
  }
});

router.afterEach((to, from) => {
  // 进度条结束
  NProgress.done();
});
