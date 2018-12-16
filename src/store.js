import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

const state = {
  cruiseShow: false,
  cleanShow: false,
  detectShow: false,
};

export default new Vuex.Store({
  state,
  getters: {
    cruiseShow: state => {
      return state.cruiseShow // 让外界能获取 show
    },
    cleanShow: state => {
      return state.cleanShow
    },
    detectShow: state => {
      return state.detectShow
    }
  },
  mutations: {
    cruiseShow (state, value) { // 让外界能改变 show
      if (value !== undefined) {
        state.cruiseShow = value
      } else {
        state.cruiseShow = !state.cruiseShow
      }
    },
    cleanShow (state, value) {
      if (value !== undefined) {
        state.cleanShow = value
      } else {
        state.cleanShow = !state.cleanShow
      }
    },
    detectShow (state, value) {
      if (value !== undefined) {
        state.detectShow = value
      } else {
        state.detectShow = !state.detectShow
      }
    }
  },
  actions: { // 让外界能通过异步调用的方式 改变 show
    cruiseShow ({commit}) {
      commit('cruiseShow')
    },
    cleanShow ({commit}) {
      commit('cleanShow')
    },
    detectShow ({commit}) {
      commit('detectShow')
    }
  }
});
