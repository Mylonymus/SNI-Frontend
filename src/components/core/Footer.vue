<template>
  <footer>
    <v-container fluid>
      <v-layout justify-space-around>
        <v-flex md8>
          <a style="float:left;" target="_blank" href="https://bigpyx.com">
            <v-img
              width="100"
              style="margin-right:50px;display:inline-block;"
              :src="`/logo_bigpyx.png`"
              :lazy-src="`/logo_bigpyx.png`"
            />
          </a>
          Todos los derechos reservados
          <a
            style="float:right;margin-top:-20px;"
            target="_blank"
            href="https://grupoptm.com"
          >
            <v-img
              width="50"
              style="margin-left:50px;margin-top:10px;display:inline-block;"
              :src="`/logo_ptm.png`"
              :lazy-src="`/logo_ptm.png`"
            />
          </a>
        </v-flex>
      </v-layout>
    </v-container>
  </footer>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Footer'
}
</script>
<style lang="stylus">
footer
  background: linear-gradient(135deg,#004d74,#007c93);
  min-height:50px;
  color:white;
  text-align:center;
  border-top:2px solid;
  border-top-color: #007fa8 !important;
  a
    color: white;
    text-decoration: none;
    font-weight: bold;
    line-height:25px;
</style>
