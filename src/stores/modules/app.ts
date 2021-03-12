import API from '@/api/index';

const app = {
  state: {
    key: 'UouLaDG9Dt931%7CVrNZp2nQ%3D%3D',//徐汇
    // key: 'RVwvPXyVhSlMJkeBgP9gQA%3D%3D',//青浦区
    // key: 'xdK%7C8D2H6MzpmQB6FHEUUQ%3D%3D',//长宁区
    // key: 'L%7C1peYUXyT7Af3JUocQuFA%3D%3D',//虹口区
    // key: 'fXRhz%2BHcseWn1wgzcKD9vg%3D%3D',//杨浦区
    // key: 'G9bCCooL3RUON7fooUpinw%3D%3D',//静安区
    // key: 'gaVpnyuxXZy5qtBBFD%2BPyA%3D%3D',//嘉定区
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
