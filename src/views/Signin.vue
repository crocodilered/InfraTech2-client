<template>
  <v-container fluid>
    <v-layout wrap>
      <v-flex xs12 sm4 offset-sm4>
        <h1>Sign in please</h1>
        <p>To access application you have to sign in first.</p>
      </v-flex>
      <v-flex xs12 sm4 offset-sm4 mb-3 v-if="error">
        <v-alert
          :value="true"
          color="error"
          icon="warning"
          outline
        >
          <template v-if="error == -1">Backend connection error.</template>
          <template v-if="error == 3">User with given email and password is not found.</template>
        </v-alert>
      </v-flex>
      <v-flex xs12 sm4 offset-sm4>
        <form @submit.prevent="signIn">
          <v-text-field
            required autofocus
            browser-autocomplete="false"
            label="Email"
            type="email"
            v-model="email"></v-text-field>
          <v-text-field
            required
            browser-autocomplete="false"
            label="Password"
            type="password"
            v-model="password"></v-text-field>
          <v-btn
            color="primary"
            type="submit"
            :loading="loading"
          >Sign In</v-btn>
        </form>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import router from '@/router'
import conf from '@/conf'

const data = function () {
  return {
    loading: false,
    /*
      1 - Backend connection error.
     */
    error: 0,
    email: 'serge@design.ru',
    password: '123qweQWE',
    defaultRouterPath: '/dashboard'
  }
}

const computed = {
  ...mapGetters([
    'isAuthenticated'
  ])
}

const methods = {
  signIn () {
    this.loading = true
    conf.api.post('/auth/sign_in/', { email: this.email, password: this.password })
      .then(resp => {
        const d = resp.data
        if (d.errorCode === 0) {
          this.$store.dispatch('userSignIn', { token: d.token, user: d.user })
          router.push(this.defaultRouterPath)
        } else {
          this.error = d.errorCode
        }
      })
      .catch(err => {
        this.error = -1
        console.log('No session for this user.', err)
      })
      .finally(() => (this.loading = false))
  }
}

export default {
  data,
  computed,
  methods,
  created () {
    if (this.isAuthenticated) {
      router.push(this.defaultRouterPath)
    }
  }
}

</script>
