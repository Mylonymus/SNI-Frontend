<template>
  <v-flex xs12 text-xs-center mt-5 mb-3>
    <h1 class="font-weight-bold">{{ title }}</h1>
  </v-flex>
</template>

<script>
export default {
  name: 'Heading',
  props: {
    title: String
  }
}
</script>
<style scoped>
form h1 {
  color: #006f8a;
}
</style>
