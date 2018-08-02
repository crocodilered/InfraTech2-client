// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import App from './App'
import router from './router'
import store from './store'
import conf from './conf'
import { mapGetters } from 'vuex'

Vue.config.productionTip = false
Vue.use(Vuetify)

const computed = {
  ...mapGetters([
    'isAuthenticated'
  ])
}

const created = function () {
  const token = this.$store.state.token
  if (token && !this.isAuthenticated) {
    conf.api.post('auth/', { token: token })
      .then(resp => {
        this.$store.commit('setUser', resp.data.user)
      })
      .catch(err => {
        console.log('Error while making request:', err)
      })
  }
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  computed,
  router,
  store,
  created,
  render: h => h(App)
})
