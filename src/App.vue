<template>
  <v-app light>
    <Toolbar />
    <v-content>
      <loading />
      <transition name="fade" mode="out-in">
        <router-view />
      </transition>
    </v-content>
    <Footer />
  </v-app>
</template>

<script>
import Toolbar from '@/components/core/Toolbar.vue'
import Loading from '@/components/core/Loading.vue'
import Footer from '@/components/core/Footer.vue'

export default {
  name: 'App',
  metaInfo() {
    return {
      title: this.appTitle,
      htmlAttrs: {
        lang: this.$i18n.locale
      },
      meta: [
        { name: 'msapplication-TileColor', content: '#ffc40d' },
        { name: 'theme-color', content: '#ffffff' },
        {
          name: 'apple-mobile-web-app-title',
          content: this.appTitle
        },
        { name: 'application-name', content: this.appTitle }
      ],
      link: [
        {
          rel: 'apple-touch-icon',
          sizes: '180x180',
          href: '/apple-touch-icon.png'
        },
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '32x32',
          href: '/favicon-32x32.png'
        },
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '16x16',
          href: '/favicon-16x16.png'
        },
        { rel: 'manifest', href: '/site.webmanifest' },
        { rel: 'mask-icon', color: '#5bbad5', href: '/safari-pinned-tab.svg' },
        { rel: 'favicon', href: '/favicon.ico' }
      ]
    }
  },
  components: {
    Toolbar,
    Loading,
    Footer
  },
  computed: {
    appTitle() {
      return this.$store.getters.appTitle
    }
  }
}
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.1s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.bg-site {
  background: url('/bg-site.jpg');
  background-size: cover;
  background-position: center center;
  height: 100%;
  background-repeat: no-repeat;
}
.theme--light.v-table tbody tr:hover:not(.v-datatable__expand-row) {
  background: #006a87;
  color: white;
  cursor: pointer;
}
.theme--light.v-table tbody tr:hover i {
  color: white;
}
</style>
