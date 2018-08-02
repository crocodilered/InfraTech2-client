<template>
  <v-container class="maintenance-cell">
    <v-layout wrap row>
      <v-flex xs12 md12>
        <small>Contract</small><br>
        {{ item.contract.contractorTitle }} # {{ item.contract.identifier }}
      </v-flex>
      <v-flex xs12 md12>
        <small>Equipment</small><br>
        {{ item.equipment.title }} ({{ item.equipment.identifier }})
      </v-flex>
      <v-flex xs6 md6>
        <small>Due</small><br>
        {{ item.endDate }}
      </v-flex>
      <v-flex xs6 md6>
        <small>Value</small><br>
        {{ item.value }}$
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  props: {
    item: Object
  }
}
</script>

<style scoped>
  .maintenance-cell small {
    color: #aaa;
  }
</style>
