<template>
  <v-container fluid>
    <v-layout row wrap>
      <v-flex xs12 md6>
        <h1>Contacts</h1>
        <form @submit.prevent="submit">
          <v-textarea
            required autofocus
            rows=12
            name="question"
            label="Ask your question here..."
            v-model="question"></v-textarea>
          <v-btn color="primary" type="submit">Submit</v-btn>
        </form>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
const data = function () {
  return {
    question: ''
  }
}

const methods = {
  submit () {
    return true
  }
}

export default {
  data,
  methods
}
</script>
