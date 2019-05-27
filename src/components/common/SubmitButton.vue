<template>
  <v-btn
    color="primary"
    dark
    type="submit"
    :disabled="disabledButton"
    :class="customClass"
    :flat="flat"
  >
    {{ text }}
    <v-icon right>vpn_key</v-icon>
  </v-btn>
</template>

<script>
export default {
  name: 'SubmitButton',
  props: {
    color: String,
    text: String,
    customClass: String,
    flat: Boolean
  },
  computed: {
    disabledButton() {
      return this.$store.state.loading.showLoading
    },
    colorString() {
      return this.color ? this.color : 'secondary'
    }
  }
}
</script>
