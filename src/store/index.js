import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const state = {
  userData: {}
}

const getters = {
  getUserData (state) {
    return state.userData
  }
}

const mutations = {
  setUserData (state, user) {
    state.userData = user
  }
}

const actions = {
}

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})
