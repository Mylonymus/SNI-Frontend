<template>
  <v-container>
    <v-layout column px-3 pb-3>
      <Heading :title="$t('verify.TITLE')" />
      <ErrorMessage />
      <SuccessMessage />
    </v-layout>
  </v-container>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  metaInfo() {
    return {
      title: this.$store.getters.appTitle,
      titleTemplate: this.$t('verify.TITLE') + ' - %s'
    }
  },
  methods: {
    ...mapActions(['sendVerify'])
  },
  async created() {
    try {
      await this.sendVerify(this.$route.params.id)
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      return
    }
  }
}
</script>
