const app = {
  state: {
    key: '',
  },
  mutations: {
    SETKEY(state: any, key: string): void {
      state.key = key;
    },
  },
};

export default app;
