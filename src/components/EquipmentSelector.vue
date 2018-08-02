<template>
  <v-autocomplete
    hide-no-data hide-selected required
    v-model="model"
    :items="items"
    :loading="isLoading"
    :search-input.sync="search"
    item-text="title"
    item-value="id"
    label="Equipment"
    return-object
  ></v-autocomplete>
</template>

<script>
import _ from 'lodash'
import conf from '@/conf'

const data = function () {
  return {
    MIN_TERM_LENGTH: 3,
    entries: [],
    isLoading: false,
    model: null,
    search: null
  }
}

const computed = {
  // Transform Array to Object
  // to force component return Object instead of Array
  items () {
    if (this.entries) {
      return this.entries.map(entry => {
        return {
          id: entry[0],
          identifier: entry[1],
          title: entry[2],
          description: entry[3]
        }
      })
    }
  }
}

const watch = {
  search (val) {
    if (val && val.length >= this.MIN_TERM_LENGTH) {
      this.isLoading = true
      this.debouncedloadList()
    }
  },
  model (val) {
    this.$emit('updated', val)
  }
}

const created = function () {
  this.debouncedloadList = _.debounce(function () {
    conf.api.post('/equipment/filter/', { terms: this.search, token: this.$store.state.token })
      .then(resp => (this.entries = resp.data.rows))
      .catch(err => console.log('Got HTTP error while loading data.', err))
      .finally(() => (this.isLoading = false))
  }, 1000)
}

export default {
  data,
  computed,
  watch,
  created
}
</script>
