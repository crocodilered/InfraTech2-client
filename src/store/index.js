import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// Get token from cookie
const getTokenCookie = function () {
  var pairs = document.cookie.split(';')
  for (var i in pairs) {
    if (pairs[i] && pairs[i].trim().startsWith('token=')) {
      return pairs[i].trim().slice(6)
    }
  }
  return null
}

const defaultState = {
  token: getTokenCookie(),
  user: null
}

const mutations = {
  setToken: (state, payload) => { state.token = payload },
  setUser: (state, payload) => { state.user = payload }
}

const getters = {
  isAuthenticated: state => state.user !== null && state.user !== undefined
}

const actions = {
  setTokenCookie: ({commit}, value) => {
    window.document.cookie = 'token=' + encodeURIComponent(value)
  },

  userSignIn: ({commit, dispatch}, payload) => {
    dispatch('setTokenCookie', payload.token)
    commit('setToken', payload.token)
    commit('setUser', payload.user)
  },

  userSignOut: ({commit, dispatch}) => {
    dispatch('setTokenCookie', null)
    commit('setToken', null)
    commit('setUser', null)
  }
}

const store = new Vuex.Store({
  state: defaultState,
  mutations,
  getters,
  actions
})

export default store
