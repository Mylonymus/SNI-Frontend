<template>
  <v-container light fluid class="bg-signUp">
    <v-layout row wrap>
      <v-flex xs12 sm4 offset-sm4>
        <form @submit.prevent="submit" class="signUpForm">
          <v-layout row>
            <Heading :title="$t('signup.TITLE')" />
          </v-layout>
          <v-layout column>
            <v-flex>
              <v-text-field
                id="name"
                name="name"
                :label="$t('signup.NAME')"
                v-model="usuarioNuevo.name"
                :data-vv-as="$t('signup.NAME')"
                :error="errors.has('name')"
                :error-messages="errors.collect('name')"
                v-validate.disable="'required'"
                autocomplete="off"
              ></v-text-field>
            </v-flex>
            <v-flex>
              <v-text-field
                id="lastname"
                name="lastname"
                :label="$t('signup.LASTNAME')"
                v-model="usuarioNuevo.lastname"
                :data-vv-as="$t('signup.LASTNAME')"
                :error="errors.has('lastname')"
                :error-messages="errors.collect('lastname')"
                v-validate.disable="'required'"
                autocomplete="off"
              ></v-text-field>
            </v-flex>
            <v-flex>
              <v-select 
                id="rolesUsuario"
                name="rolesUsuario"
                :items="rolesUsuario"
                v-model="usuarioNuevo.rolesUsuario"
                label="Rol de Usuario"
                data-vv-as="Rol Usuario"
              ></v-select>
            </v-flex>
            <v-flex>
              <v-text-field
                id="email"
                name="email"
                type="email"
                :label="$t('signup.EMAIL')"
                v-model="usuarioNuevo.email"
                :data-vv-as="$t('signup.EMAIL')"
                :error="errors.has('email')"
                :error-messages="errors.collect('email')"
                v-validate.disable="'required|email'"
                autocomplete="off"
              ></v-text-field>
            </v-flex>
            <v-flex>
              <v-text-field
                id="password"
                name="password"
                type="password"
                :label="$t('signup.PASSWORD')"
                v-model="usuarioNuevo.password"
                :data-vv-as="$t('signup.PASSWORD')"
                :error="errors.has('password')"
                :error-messages="errors.collect('password')"
                v-validate.disable="'required|min:5'"
                ref="password"
                autocomplete="off"
              ></v-text-field>
            </v-flex>
            <v-flex>
              <v-text-field
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                :label="$t('signup.CONFIRM_PASSWORD')"
                v-model="usuarioNuevo.confirmPassword"
                :data-vv-as="$t('signup.PASSWORD')"
                :error="errors.has('confirmPassword')"
                :error-messages="errors.collect('confirmPassword')"
                v-validate.disable="'required|min:5|confirmed:password'"
                autocomplete="off"
              ></v-text-field>
            </v-flex>
            <v-flex text-xs-center mt-5>
              <SubmitButton :text="$t('signup.SIGN_ME_UP')" />
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
      titleTemplate: this.$t('signup.TITLE') + ' - %s'
    }
  },
  data() {
    return {
      name: '',
      lastname: '',
      email: '',
      rolesUsuario:['admin','user','patient'],
      password: '',
      confirmPassword: '',
      usuarioNuevo: {}
    }
  },  
  methods: {
    ...mapActions(['userSignUp']),
    
    async submit() {
      try {
        const valid = await this.$validator.validateAll()
        if (valid) {
          await this.userSignUp({
            name: this.usuarioNuevo.name,
            lastname: this.usuarioNuevo.lastname,
            role: this.usuarioNuevo.rolesUsuario,
            isPatient: this.usuarioNuevo.rolesUsuario === 'patient' ? true : false,
            email: this.usuarioNuevo.email,
            password: this.usuarioNuevo.password
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
.bg-signUp {
  background: url('/bg-login.jpg');
  background-size: cover;
  background-position: center center;
  height: 100%;
  background-repeat: no-repeat;
}
.signUpForm {
  background-color: white;
  padding: 10px 50px 20px 50px;
  border-radius: 20px;
  margin-top: 120px;
  min-width: 320px;
}
.signUpForm h1 {
  font-size: 35px;
}
</style>
