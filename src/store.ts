import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    key: ''
  },
  mutations: {
    SETKEY(state, key): void {
      state.key = key
    }
  }
})
