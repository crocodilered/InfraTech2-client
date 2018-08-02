<template>
  <v-app id="inspire">
    <v-navigation-drawer
      v-model="drawer"
      clipped
      fixed
      app
    >
      <!-- NO AUTH -->
      <v-list v-if="!isAuthenticated" dense>
        <v-list-tile to="/signin">
          <v-list-tile-action><v-icon>face</v-icon></v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Sign in</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
      <!-- WITH AUTH -->
      <v-list v-if="isAuthenticated">
        <v-list-tile to="/dashboard">
          <v-list-tile-action><v-icon>filter</v-icon></v-list-tile-action>
          <v-list-tile-content>Dashboard</v-list-tile-content>
        </v-list-tile>
        <v-list-tile to="/maintenance">
          <v-list-tile-action><v-icon>toys</v-icon></v-list-tile-action>
          <v-list-tile-content>Maintenance</v-list-tile-content>
        </v-list-tile>
        <v-list-group prepend-icon="view_list" no-action>
          <v-list-tile slot="activator">
            <v-list-tile-content>Directories</v-list-tile-content>
          </v-list-tile>
          <v-list-tile to="/dir/equipment">
            <v-list-tile-content>Equipment</v-list-tile-content>
          </v-list-tile>
          <v-list-tile to="/dir/contracts">
            <v-list-tile-content>Contracts</v-list-tile-content>
          </v-list-tile>
        </v-list-group>
        <v-list-tile to="/feedback">
          <v-list-tile-action><v-icon>chat</v-icon></v-list-tile-action>
          <v-list-tile-content>Feedback</v-list-tile-content>
        </v-list-tile>
        <v-list-tile @click="signOut">
          <v-list-tile-action><v-icon>exit_to_app</v-icon></v-list-tile-action>
          <v-list-tile-content>Sign out</v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>

    <v-toolbar dark fixed app clipped-left>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>{{ title }}</v-toolbar-title>
    </v-toolbar>
    <v-content>
      <router-view/>
    </v-content>
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex'
import router from './router'

const data = function () {
  return {
    title: 'INFRA Tech 2',
    drawer: this.initDrawer()
  }
}

const computed = {
  ...mapGetters([
    'isAuthenticated'
  ])
}

const methods = {
  signOut () {
    this.$store.dispatch('userSignOut')
    router.push('/')
  },

  initDrawer () {
    switch (this.$vuetify.breakpoint.name) {
      case 'xs': return false
      case 'sm': return false
      case 'md': return true
      case 'lg': return true
      case 'xl': return true
    }
  }
}

export default {
  data,
  computed,
  methods
}
</script>

<style>
  button.v-btn {
    margin: 0;
  }
  .v-alert, h1, h2, h3 {
    margin-top: 16px;
    margin-bottom: 8px;
  }
</style>
