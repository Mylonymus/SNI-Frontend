<template>
  <div>
    <v-navigation-drawer v-model="sidebar" app disable-resize-watcher>
      <v-list>
        <v-list-tile>
          <v-list-tile-content>
            <v-img
              contain
              :src="`/logo-mexicoin-blue.png`"
              :lazy-src="`/logo-mexicoin-blue.png`"
            />
          </v-list-tile-content>
          <v-list-tile-action>
            <v-btn icon @click.stop="sidebar = !sidebar">
              <v-icon>chevron_left</v-icon>
            </v-btn>
          </v-list-tile-action>
        </v-list-tile>
        <v-list-tile
          v-for="(item, index) in menuItems"
          :key="index"
          :to="{ name: item.link }"
          exact
        >
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>{{ item.title }}</v-list-tile-content>
        </v-list-tile>

        <v-list-group v-if="admin" prepend-icon="build" no-action>
          <v-list-tile slot="activator">
            <v-list-tile-title>{{ $t('adminItems.ADMIN') }}</v-list-tile-title>
          </v-list-tile>
          <v-list-tile
            v-for="(item, index) in adminItems"
            :key="index"
            :to="{ name: item.link }"
            exact
          >
            <v-list-tile-content class="d-inline mt-3">
              <v-icon>{{ item.icon }}</v-icon>
              {{ item.title }}
            </v-list-tile-content>
          </v-list-tile>
        </v-list-group>

        <v-list-tile v-if="isTokenSet" @click="userLogout">
          <v-list-tile-action>
            <v-icon>exit_to_app</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            {{ $t('menuItems.LOGOUT') }}
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar app dark color="primary">
      <span class="hidden-md-and-up">
        <v-toolbar-side-icon @click="sidebar = !sidebar"></v-toolbar-side-icon>
      </span>
      <v-toolbar-title class="headline text-uppercase ml-0">
        <div>
          <router-link
            :to="{ name: 'home' }"
            tag="div"
            style="cursor: pointer"
            v-if="isTokenSet"
          >
            <v-img
              :src="`/logo-sna.png`"
              :lazy-src="`/logo-sna.png`"
              width="370"
            />
          </router-link>
          <router-link
            :to="{ name: 'landing' }"
            tag="div"
            style="cursor: pointer"
            v-else
          >
            <v-img
              :src="`/logo-sna.png`"
              :lazy-src="`/logo-sna.png`"
              width="370"
            />
          </router-link>
        </div>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-sm-and-down">
        
        <v-btn
          flat 
          to="home"
          exact
          class="hidden-sm-and-down btnHome"
        >
          <v-icon>home</v-icon>
          &nbsp;{{ this.$t('menuItems.HOME') }}
        </v-btn>

        <v-menu v-if="admin" offset-y>
          <template v-slot:activator="{ on }">
            <v-btn 
              flat 
              v-on="on"
            >
            <v-icon>local_hospital</v-icon>
                &nbsp;Pacientes
            </v-btn>
          </template>

          <v-list>
            <v-list-tile
              v-for="(item, i) in adminItems"
              :key="i"
            >
              <v-btn
              dark
                  color="primary"
                  flat 
                  :key="i"
                  :to="{ name: item.link }"
                  exact
                  :class="[item.class]"
                ><v-icon>{{ item.icon }}</v-icon>
                  &nbsp;{{ item.title }}
                </v-btn>
            </v-list-tile>
          </v-list>
        </v-menu> 

        <LocaleChanger />
        <v-menu offset-y>
          <template v-slot:activator="{ on }">
            <v-btn 
              flat 
              v-on="on"
            >
              <v-icon>menu</v-icon> 
            </v-btn>
          </template>
          <v-list>
            <v-list-tile class="menuDerecho">
              <v-btn
                block
                right
                flat 
                to="profile"
                exact
                class="hidden-sm-and-down btnHome"
              >
                <v-icon>account_circle</v-icon>
                &nbsp;{{ this.$t('menuItems.MY_PROFILE') }}
              </v-btn> 
            </v-list-tile> 
            <v-list-tile class="menuDerecho">
              <v-btn
                block
                right
                flat
                v-if="isTokenSet"
                @click="userLogout"
                class="hidden-sm-and-down btnLogout"
              >
                <v-icon left>exit_to_app</v-icon>
                {{ $t('menuItems.LOGOUT') }}
              </v-btn>
            </v-list-tile>
          </v-list>
        </v-menu> 
      </v-toolbar-items>
    </v-toolbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import LocaleChanger from '@/components/core/LocaleChanger'
import ResizeText from 'vue-resize-text'

export default {
  name: 'Toolbar',
  metaInfo() {
    return {
      title: this.$store.getters.appTitle,
      htmlAttrs: {
        lang: this.$i18n.locale
      },
      meta: [
        { name: 'msapplication-TileColor', content: '#ffc40d' },
        { name: 'theme-color', content: '#ffffff' },
        {
          name: 'apple-mobile-web-app-title',
          content: this.$store.getters.appTitle
        },
        { name: 'application-name', content: this.$store.getters.appTitle }
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
    LocaleChanger
  },
  directives: {
    ResizeText
  },
  data() {
    return {
      sidebar: false
    }
  },
  computed: {
    ...mapGetters(['appTitle', 'isTokenSet', 'user']),
    admin() {
      return this.user !== null
        ? this.user.role === 'admin'
          ? true
          : false
        : false
    }, 
    adminItems() {
      return [
        {
          title: this.$t('adminItems.LISTPACIENTS'),
          link: 'admin-cities',
          icon: 'view_list' ,
          class: 'btnAdminUsers'
        },
        {
          title: this.$t('adminItems.LISTDRS'),
          link: 'admin-cities',
          icon: 'supervised_user_circle' ,
          class: 'btnAdminUsers'
        },
        {
          title: this.$t('adminItems.LISTNURSERING'),
          link: 'admin-cities',
          icon: 'supervisor_account' ,
          class: 'btnAdminUsers'
        },
        {
          title: this.$t('adminItems.USERS'),
          link: 'admin-users',
          icon: 'view_list',
          class: 'btnAdminUsers'
        }
      ]
    },
    menuItems() {
      if (this.isTokenSet) {
        return [
          {
            title: this.$t('menuItems.HOME'),
            link: 'home',
            icon: 'home',
            class: 'btnHome'
          },
          {
            title: this.$t('menuItems.MY_PROFILE'),
            link: 'profile',
            icon: 'face',
            class: 'btnProfile'
          }
        ]
      } else {
        return [
          {
            title: this.$t('menuItems.LOGIN'),
            link: 'login',
            icon: 'lock',
            class: 'btnLogin'
          }
          // {
          //   title: this.$t('menuItems.SIGNUP'),
          //   link: 'signup',
          //   icon: 'add_circle_outline',
          //   class: 'btnLogin'
          // }
        ]
      }
    }
  },
  methods: {
    userLogout() {
      this.$store.dispatch('userLogout')
    }
  }
}
</script>

<style>
.v-toolbar{
  font-family: 'Trebuchet MS';
}
.theme--dark.v-toolbar{
  background:linear-gradient(135deg,#004d74,#007c93);
  border-bottom:2px solid;
  border-bottom-color: #007fa8 !important;
}
.v-list__tile__title.ml-3{
  color:#007c93 !important;
  font-size:14px;
}
.menuDerecho div a, .menuDerecho, .menuDerecho div, .menuDerecho div button {
  margin: 0;
  padding: 0;
  min-width: 110px;
  position: relative;
  left: 0;
}
i.v-icon.v-icon--left.material-icons.theme--light {
  margin-right: 30px;
}
</style>
