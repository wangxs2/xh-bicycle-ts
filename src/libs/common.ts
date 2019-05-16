import Bus from 'vue';

declare module 'vue/types/vue' {
  interface Vue {
    $Bus: any;
  }
}

export default {
  install(Vue: any): void {
    Vue.prototype.$Bus = new Bus();
  },
};
