<template>
  <v-container fluid>
    <v-layout row wrap>
      <v-flex xs12>
        <h1>Dashboard</h1>
      </v-flex>
      <v-flex xs12 md3>
        <h2>Directories</h2>
        <p>
          <b><a href="#"><router-link to="/maintenance">Maintenance</router-link></a></b><br>
          <b><a href="#"><router-link to="/dir/contracts">Contracts</router-link></a></b><br>
          <b><a href="#"><router-link to="/dir/equipment">Equipment</router-link></a></b>
        </p>
      </v-flex>
      <v-flex
        xs12 md3
        v-if="budgetModel"
      >
        <h2>Budget</h2>
        <p>
          Current period is {{ budgetModel.beginDate }} — {{ budgetModel.endDate }}.<br>
          Execution: {{ budgetModel.execution }}$ of {{ budgetModel.value }}$ ({{ budgetExecInPercents }}%).
        </p>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
import conf from '@/conf'

const data = function () {
  return {
    budgetModel: null
  }
}

const computed = {
  ...mapState([
    'user'
  ]),
  budgetExecInPercents () {
    if (this.budgetModel) {
      return 100 * this.budgetModel.execution / this.budgetModel.value
    }
  }
}

const created = function () {
  conf.api.post('/analytics/dashboard', { token: this.$store.state.token })
    .then(resp => (this.budgetModel = resp.data.budget))
    .catch(err => console.log('Got HTTP error.', err))
}

export default {
  data,
  computed,
  created
}
</script>
