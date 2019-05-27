<template>
  <v-flex xs12 sm6 md8 text-xs-left class="font-weight-bold" py-2>
    <h2>
      <v-icon>{{ icon }}</v-icon> {{ title }}
    </h2>
  </v-flex>
</template>

<script>
export default {
  name: 'HeadingSection',
  props: {
    title: String,
    icon: String
  }
}
</script>
