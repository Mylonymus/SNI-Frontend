<template>
  <v-container fluid class="bg-landing">
    <v-layout row wrap>
      <Heading :title="$t('landing.TITLE')" />
      <Description :description="$t('landing.DESCRIPTION')" />
    </v-layout>
  </v-container>
</template>
<style scope>
.bg-landing {
  background: url('/bg-login.jpg');
  background-size: cover;
  height: 100%;
  color: white;
}
</style>
