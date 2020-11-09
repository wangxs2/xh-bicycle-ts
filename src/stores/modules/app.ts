import API from '@/api/index';

const app = {
  state: {
    key: 'UouLaDG9Dt931%7CVrNZp2nQ%3D%3D',
    PageConfig: null, // 配置
  },
  mutations: {
    SETKEY(state: any, key: string): void {
      state.key = key;
    },
    SETCONFIG(state: any, PageConfig: any): void {
      state.PageConfig = PageConfig;
    },
  },
  actions: {
    // 获取配置信息
    getConfig({commit}) {
      return new Promise((resolve, reject) => {
        const key = sessionStorage.getItem('KEY');
        API.getConfig(key).then((res: any) => {
          commit('SETKEY', key);
          commit('SETCONFIG', res.info);
          resolve();
        }).catch(() => {
          reject();
        });
      });
    },
  },
};

export default app;
