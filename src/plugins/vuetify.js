import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import 'vuetify/src/stylus/app.styl'
import colors from 'vuetify/es5/util/colors'
import VuetifyConfirm from 'vuetify-confirm'

Vue.use(Vuetify, {
  theme: {
    primary: '#006f8a',
    secondary: colors.blue.base,
    accent: colors.lightBlue.base,
    error: colors.red.base,
    warning: colors.amber.base,
    info: colors.cyan.base,
    success: colors.green.base
  },
  iconfont: 'md'
})
Vue.use(VuetifyConfirm)
