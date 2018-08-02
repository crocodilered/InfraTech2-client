<template>
  <v-container fluid>
    <v-layout row wrap>
      <v-flex xs12 md6>
        <h1>Maintenance</h1>

        <v-expansion-panel
          v-if="maintenanceList"
        >
          <v-expansion-panel-content
            v-for="item in maintenanceList"
            :key="item.title + item.equipment.identifier"
          >
            <div slot="header">{{ item.title }}</div>
            <v-divider></v-divider>
            <maintenance-cell :item = item></maintenance-cell>
          </v-expansion-panel-content>
        </v-expansion-panel>

        <http-error :show="isConnectionError"></http-error>

        <v-btn
          fab fixed bottom
          color="primary"
          :disabled="!this.contractsList"
          @click="populateItem()"
        >
          <v-icon>add</v-icon>
        </v-btn>
      </v-flex>
    </v-layout>

    <v-dialog
      persistent
      v-if="maintenanceModel"
      v-model="maintenanceModel"
      max-width="500px"
    >
      <form v-on:submit.prevent="doPost">
        <v-card>
          <v-card-title primary-title class="headline primary lighten-2">Create maintenance record</v-card-title>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 sm6 md4>
                  <v-text-field
                    required
                    label="Short description"
                    v-model="maintenanceModel[5]"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <equipment-selector @updated="val => (this.maintenanceModelEquipment = val)"></equipment-selector>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-select
                    return-object
                    :items="contractsList"
                    label="Contract"
                    v-model="maintenanceModelContract"
                    item-text="2"
                    item-value="0"
                  ></v-select>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-menu
                    lazy offset-y full-width close-on-content-click
                    transition="scale-transition"
                    min-width="290px"
                  >
                    <v-text-field
                      required readonly
                      slot="activator"
                      v-model="maintenanceModel[4]"
                      label="Maintenance complete date"
                      append-icon="event"
                    ></v-text-field>
                    <v-date-picker
                      required
                      v-model="maintenanceModel[4]"
                    ></v-date-picker>
                  </v-menu>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field
                    required
                    append-icon="attach_money"
                    label="Maintenance value"
                    v-model="maintenanceModel[6]"
                    type="number"
                  ></v-text-field>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="grey" flat @click.native="resetItem">Close</v-btn>
            <v-btn color="blue" flat :loading="isLoading" type="submit">Create</v-btn>
          </v-card-actions>
        </v-card>
      </form>
    </v-dialog>

  </v-container>
</template>

<script>
import { mapState } from 'vuex'
import conf from '@/conf'
import EquipmentSelector from '@/components/EquipmentSelector.vue'
import MaintenanceCell from '@/components/MaintenanceCell.vue'

import HttpErrorAlert from '@/components/HttpErrorAlert.vue'

const data = function () {
  return {
    isConnectionError: false,
    isLoading: false,
    maintenanceList: [],
    contractsList: [],
    maintenanceModel: null,
    maintenanceModelEquipment: null,
    maintenanceModelContract: null
  }
}

const computed = {
  ...mapState([
    'user'
  ])
}

const watch = {
  maintenanceModelEquipment (val) {
    if (this.maintenanceModel && val) {
      this.maintenanceModel[2] = val.id
    }
  },
  maintenanceModelContract (val) {
    if (this.maintenanceModel && val) {
      this.maintenanceModel[3] = val[0]
    }
  }
}

const methods = {
  loadList: function () {
    this.isLoading = true
    return new Promise((resolve, reject) => {
      conf.api.post('/maintenance/list/', { token: this.$store.state.token })
        .then((res) => {
          this.maintenanceList = res.data.data
          resolve(res)
        })
        .catch(err => {
          console.log('Got HTTP error while loading data.', err)
          reject(err)
        })
        .finally(() => {
          this.isLoading = false
        })
    })
  },
  populateItem (maintenanceModel) {
    this.maintenanceModel = [0, this.user.id, '', '', '', '', '']
  },
  doPost () {
    this.isLoading = true
    conf.api.post('/maintenance/post/', { item: this.maintenanceModel, token: this.$store.state.token })
      .then(resp => this.loadList())
      .then(() => (this.resetItem()))
      .catch(err => {
        console.log('Got HTTP error while loading data.', err)
        this.isConnectionError = true
      })
      .finally(() => (this.isLoading = false))
  },
  resetItem () {
    this.maintenanceModel = null
    this.maintenanceModelEquipment = null
    this.maintenanceModelContract = null
  }
}

const created = function () {
  this.loadList()
  conf.api.post('/contracts/current_list/', { limit: 30, token: this.$store.state.token })
    .then((res) => (this.contractsList = res.data.rows))
    .catch(err => console.log('Got HTTP error while loading data.', err))
}

export default {
  components: {
    'equipment-selector': EquipmentSelector,
    'maintenance-cell': MaintenanceCell,
    'http-error': HttpErrorAlert
  },
  data,
  computed,
  watch,
  methods,
  created
}
</script>
