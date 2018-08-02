<template>
  <v-alert
    v-model="show"
    type="error"
    transition="scale-transition"
  >
    Got HTTP error while loading data.
  </v-alert>
</template>

<script>
export default {
  props: {
    show: Boolean
  }
}
</script>
