<template>
  <v-container light fluid class="bg-login">
    <v-layout row wrap>
      <v-flex xs12 sm4 offset-sm4>
        <form class="loginForm" @submit.prevent="submit">
          <v-layout row mt-0>
            <Heading :title="$t('login.TITLE')" />
          </v-layout>
          <v-layout column>
            <v-flex>
              <v-text-field
                id="email"
                name="email"
                type="email"
                :label="$t('login.EMAIL')"
                v-model="email"
                :data-vv-as="$t('login.EMAIL')"
                :error="errors.has('email')"
                :error-messages="errors.collect('email')"
                v-validate.disable="'required|email'"
                autocomplete="off"
                prepend-icon="person"
              ></v-text-field>
            </v-flex>
            <v-flex>
              <v-text-field
                id="password"
                name="password"
                type="password"
                :label="$t('login.PASSWORD')"
                v-model="password"
                :data-vv-as="$t('login.PASSWORD')"
                :error="errors.has('password')"
                :error-messages="errors.collect('password')"
                v-validate.disable="'required|min:5'"
                autocomplete="off"
                prepend-icon="https"
              ></v-text-field>
            </v-flex>
            <v-flex text-xs-center mt-5>
              <SubmitButton :text="$t('login.LOGIN')" />
            </v-flex>
            <v-flex text-xs-center>
              <v-btn
                :to="{ name: 'forgotPassword' }"
                color="primary"
                small
                flat
                class="btnForgotPassword"
              >
                {{ $t('login.FORGOT_PASSWORD') }}
              </v-btn>
            </v-flex>
          </v-layout>
        </form>
      </v-flex>
      <ErrorMessage />
    </v-layout>
  </v-container>
</template>

<script>
import router from '@/router'
import { mapActions } from 'vuex'

export default {
  metaInfo() {
    return {
      title: this.$store.getters.appTitle,
      titleTemplate: this.$t('login.TITLE') + ' - %s'
    }
  },
  data() {
    return {
      email: '',
      password: ''
    }
  },
  methods: {
    ...mapActions(['userLogin']),
    async submit() {
      try {
        const valid = await this.$validator.validateAll()
        if (valid) {
          await this.userLogin({
            email: this.email,
            password: this.password
          })
          return
        }
        // eslint-disable-next-line no-unused-vars
      } catch (error) {
        return
      }
    }
  },
  created() {
    if (this.$store.state.auth.isTokenSet) { 
      router.push({ name: 'home' })
    }
  }
}
</script>
<style scope>
.bg-login {
  background: url('/bg-login.jpg');
  background-size: cover;
  background-position: center center;
  height: 100%;
  background-repeat: no-repeat;
}
.loginForm {
  background-color: white;
  padding: 10px 50px 0px 50px;
  border-radius: 10px;
  margin-top: 120px;
  min-width: 320px;
}
.login-form h1 {
  font-size: 35px;
}
</style>
