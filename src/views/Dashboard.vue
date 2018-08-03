<template>
  <v-container fluid>
    <h1>Dashboard</h1>
    <v-layout row wrap>
      <v-flex xs12 md2>
        <h2>Maintenance</h2>
        <p><router-link to="/maintenance">Proceed</router-link></p>
        <h2>Directories</h2>
        <ul v-if="directoriesModel">
          <li><router-link to="/dir/contracts">{{ directoriesModel.contractsCount }} contracts</router-link></li>
          <li><router-link to="/dir/equipment">{{ directoriesModel.equipmentCount }} equipment units</router-link></li>
        </ul>
      </v-flex>
      <v-flex
        xs12 sm4 md2
        v-if="budgetModel"
      >
        <h2>Budget</h2>
        <v-progress-circular
          :rotate="-90"
          :size="100"
          :width="15"
          :value="budgetExecInPercents"
          color="primary"
        >
          {{ budgetExecInPercents }}%
        </v-progress-circular>
        <p>{{ dateFormat(budgetModel.beginDate) }} — {{ dateFormat(budgetModel.endDate) }}</p>
        <p>Execution: {{ budgetModel.execution }} of {{ budgetModel.value }}$</p>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
import conf from '@/conf'

const data = function () {
  return {
    directoriesModel: null,
    budgetModel: null,
    budgetExecInPercents: 0
  }
}

const computed = {
  ...mapState([
    'user'
  ])
}

const mounted = function () {
  conf.api.post('/analytics/dashboard', { token: this.$store.state.token })
    .then((resp) => {
      this.budgetModel = resp.data.budget
      this.directoriesModel = resp.data.directories
      setTimeout(() => { this.budgetExecInPercents = 100 * this.budgetModel.execution / this.budgetModel.value }, 100)
    })
    .catch(err => console.log('Got HTTP error.', err))
}

const methods = {
  // Converts yyyy-dd-mm string to nice string
  dateFormat: function (dateStr) {
    const d = new Date(dateStr)
    if (dateStr) {
      return d.toLocaleDateString()
    } else {
      return ''
    }
  }
}

export default {
  data,
  computed,
  mounted,
  methods
}
</script>

<style scoped>
  h2 {
    margin-top: 30px;
  }
  ul {
    margin-left: 0;
    padding-left: 0;
  }
  li {
    list-style: none;
    margin: .2rem 0;
  }
  .v-progress-circular {
    float: right;
    transform: translate(0,-30px);
  }
</style>
