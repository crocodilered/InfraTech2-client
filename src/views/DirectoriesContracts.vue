<template>
  <v-container fluid>
    <v-layout row>
      <v-flex xs12 md6>
        <h1>Contracts</h1>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex xs12 md6>
        <v-text-field
          clearable autofocus
          label="Search by contractor title or contract ID"
          v-model="terms"
          :loading="isLoading"
        ></v-text-field>

        <v-list
          two-line
          v-if="list.length"
        >
          <v-list-tile
            v-for="item in list"
            :key="item[1]"
            @click="populateItem(item)"
          >
            <v-list-tile-content>
              <v-list-tile-title>{{ item[2] }}</v-list-tile-title>
              <v-list-tile-sub-title>CONTRACT: {{ item[1] }}</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>

        <http-error :show="isConnectionError"></http-error>

        <div v-if="!isLoading && terms && terms.length >= MIN_TERM_LENGTH && list && list.length==0">
          Nothing found.
        </div>

        <v-btn
          fab fixed bottom
          color="primary"
          @click="populateItem()"
        >
          <v-icon>add</v-icon>
        </v-btn>
      </v-flex>
    </v-layout>

    <v-dialog
      persistent
      v-if="item"
      v-model="item"
      max-width="500px"
    >
      <form v-on:submit.prevent="doPost">
        <v-card>
          <v-card-title primary-title class="headline grey lighten-2">{{ dialogCaption }}</v-card-title>

          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 sm6 md4>
                  <v-text-field
                    required
                    label="Contractor title"
                    v-model="item[2]"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field
                    required
                    label="Contract ID"
                    v-model="item[1]"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field
                    required
                    append-icon="attach_money"
                    label="Contract value"
                    v-model="item[3]"
                    type="number"
                  ></v-text-field>
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
                      v-model="item[4]"
                      label="Contract begin date"
                      append-icon="event"
                    ></v-text-field>
                    <v-date-picker v-model="item[4]"></v-date-picker>
                  </v-menu>
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
                      v-model="item[5]"
                      label="Contract end date"
                      append-icon="event"
                    ></v-text-field>
                    <v-date-picker v-model="item[5]"></v-date-picker>
                  </v-menu>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="grey" flat @click.native="item = null">Close</v-btn>
            <v-btn color="blue" flat :loading="isLoading" type="submit">{{ dialogAction }}</v-btn>
          </v-card-actions>
        </v-card>
      </form>
    </v-dialog>
  </v-container>
</template>

<script>
import _ from 'lodash'
import conf from '@/conf'
import HttpErrorAlert from '@/components/HttpErrorAlert.vue'

const data = function () {
  return {
    MIN_TERM_LENGTH: 3,
    isConnectionError: false,
    isLoading: false,
    list: [],
    dialogAction: '',
    item: null,
    terms: ''
  }
}

const methods = {
  loadList: function () {
    return new Promise((resolve, reject) => {
      conf.api.post('/contracts/filter/', { terms: this.terms, token: this.$store.state.token })
        .then(resp => {
          this.list = resp.data.rows
          resolve(resp)
        })
        .catch(err => {
          console.log('Got HTTP error while loading data.', err)
          this.isConnectionError = true
          reject(err)
        })
        .finally(() => (this.isLoading = false))
    })
  },
  populateItem (item) {
    if (item) {
      this.dialogAction = 'Update'
      this.item = item.slice() // Copy Array
    } else {
      this.dialogAction = 'Create'
      this.item = [0, '', '', '', '', '']
    }
  },
  doPost () {
    this.isLoading = true
    conf.api.post('/contracts/post/', { item: this.item, token: this.$store.state.token })
      .then(resp => this.loadList())
      .then(() => {
        this.item = null
      })
      .catch(err => {
        console.log('Got HTTP error while loading data.', err)
        this.isConnectionError = true
      })
      .finally(() => (this.isLoading = false))
  }
}

const watch = {
  terms (val) {
    if (val && val.length >= this.MIN_TERM_LENGTH) {
      this.isLoading = true // Start of "loading"
      this.debouncedloadList()
    } else {
      this.list = []
    }
  }
}

const created = function () {
  this.debouncedloadList = _.debounce(this.loadList, 1000)
}

const computed = {
  dialogCaption () {
    return this.dialogAction + ' contractor'
  }
}

export default {
  components: {
    'http-error': HttpErrorAlert
  },
  data,
  computed,
  watch,
  methods,
  created
}
</script>
