import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

const state = {
  show: false,
};

export default new Vuex.Store({
  state,
  getters: {
    changeShow: state => {
      return state.show // 让外界能获取 show
    }
  },
  mutations: {
    changeShow (state, value) { // 让外界能改变 show
      if (value !== undefined) {
        state.show = value
      } else {
        state.show = !state.show
      }
    }
  },
  actions: { // 让外界能通过异步调用的方式 改变 show
    changeShow ({commit}) {
      commit('changeShow')
    }
  }
});
