import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

const state = {
  cruiseShow: false,
  cleanShow: false,
  detectShow: false,
  canSign:0,
  signMethod:0,
  canDelete:0,

};

export default new Vuex.Store({
  state,
  getters: {
    cruiseShow: state => {
      return state.cruiseShow; // 让外界能获取 show
    },
    cleanShow: state => {
      return state.cleanShow;
    },
    detectShow: state => {
      return state.detectShow;
    },
    canSign: state => {
      return state.canSign;
    },
    signMethod: state => {
      return state.signMethod;
    },
    canDelete: state => {
      return state.canDelete;
    }
  },
  mutations: {
    cruiseShow (state, value) { // 让外界能改变 show
      if (value !== undefined) {
        state.cruiseShow = value;
      } else {
        state.cruiseShow = !state.cruiseShow;
      }
    },
    cleanShow (state, value) {
      if (value !== undefined) {
        state.cleanShow = value;
      } else {
        state.cleanShow = !state.cleanShow;
      }
    },
    detectShow (state, value) {
      if (value !== undefined) {
        state.detectShow = value;
      } else {
        state.detectShow = !state.detectShow;
      }
    },
    canSign (state, value) {
      if (value !== undefined) {
        state.canSign = value;
      } else {
        state.cansign  = !state.cansign;
      }
    },
    signMethod (state, value) {
      if (value !== undefined) {
        state.signMethod = value;
      } else {
        state.signMethod = !state.signMethod;
      }
    },
    canDelete (state, value) {
      if (value !== undefined) {
        state.canDelete = value;
      } else {
        state.canDelete = !state.canDelete;
      }
    },

  },
  actions: { // 让外界能通过异步调用的方式 改变 show
    cruiseShow ({commit}) {
      commit('cruiseShow');
    },
    cleanShow ({commit}) {
      commit('cleanShow');
    },
    detectShow ({commit}) {
      commit('detectShow');
    },
    canSign ({commit}) {
      commit('canSign');
    },
    signMethod ({commit}) {
      commit('signMethod');
    },
    canDelete ({commit}) {
      commit('canDelete');
    }

  }
});
