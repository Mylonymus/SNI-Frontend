<template>
  <v-dialog
    :value="value"
    @input="$emit('input')"
    max-width="800px"
    content-class="dlgNewEditItem"
  >
    <v-card>
      <v-card-title>
        <span class="headline">{{ titleDialog }}</span>
      </v-card-title>
      <v-card-text>
        <v-container grid-list-md>
          <v-layout wrap>
            
            <template v-if="editedUser._id">
              <v-flex xs12 md4 offset-md4>
                <label for="createdAt">{{ $t('common.CREATED') }}</label>
                <div name="createdAt">
                  {{ getFormat(editedUser.createdAt) }}
                </div>
              </v-flex>
              <v-flex xs12 md4>
                <label for="updatedAt">{{ $t('common.UPDATED') }}</label>
                <div name="updatedAt">
                  {{ getFormat(editedUser.updatedAt) }}
                </div>
              </v-flex> 
              
            </template>   
            
            

            <v-flex xs6 md6>
              <v-flex >
                <figure class="figure imageProfile">
                  <v-img :src="editedUser.img" max-height="269" class="img-responsive" >
                  </v-img>
                </figure>
              </v-flex> 
            </v-flex>   

            <v-flex xs6 md6> 
              <vue-web-cam 
                v-if="activeCamera" 
                ref="webcam"
                :device-id="deviceId"
                width="100%"
                height="269"
                @started="onStarted" 
                @stopped="onStopped" 
                @error="onError"
                @cameras="onCameras"
                @camera-change="onCameraChange" />
              
            </v-flex>
            <v-flex xs6 md6>
            </v-flex>
            <v-flex xs12 md12 class="botoneraCamara">
              <v-btn color="blue" type="button" v-if="activeCamera"
                class="btn btn-primary" 
                @click="onCapture"><v-icon color="white">camera_enhance</v-icon></v-btn>
              <v-btn color="red" type="button" v-if="activeCamera"
                      class="btn btn-danger" 
                      @click="stopCamara"><v-icon color="white">videocam_off</v-icon></v-btn>
              <v-btn color="green" type="button" v-if="!activeCamera"  
                      class="btn btn-success" 
                      @click="activeCamera = true, onStart"><v-icon color="white">videocam</v-icon></v-btn>
            </v-flex>
            <v-flex xs12 md6>
              <v-text-field
                id="name"
                name="name"
                v-model="editedUser.name"
                :label="$t('users.headers.NAME')"
                :data-vv-as="$t('users.headers.NAME')"
                :error="errors.has('name')"
                :error-messages="errors.collect('name')"
                v-validate.disable="'required'"
                autocomplete="off"
              ></v-text-field>
            </v-flex>
            <v-flex xs12 md6>
              <v-text-field
                id="lastname"
                name="lastname"
                type="text"
                v-model="editedUser.lastname"
                :label="$t('users.headers.LASTNAME')"
                :data-vv-as="$t('users.headers.LASTNAME')"
                :error="errors.has('lastname')"
                :error-messages="errors.collect('lastname')"
                v-validate.disable="'required'"
                autocomplete="off"
              ></v-text-field>
            </v-flex> 
            <v-flex xs12 md6>
              <v-text-field
                id="email"
                name="email"
                type="email"
                :label="$t('signup.EMAIL')"
                v-model="editedUser.email"
                :data-vv-as="$t('signup.EMAIL')"
                :error="errors.has('email')"
                :error-messages="errors.collect('email')"
                v-validate.disable="'required|email'"
                autocomplete="off"
              ></v-text-field>
            </v-flex>
            <v-flex xs12 md6>
              <v-select
                clearable
                id="role"
                name="role"
                v-model="editedUser.role"
                :items="roles"
                item-text="name"
                item-value="value"
                :label="$t('users.headers.ROLE')"
                :data-vv-as="$t('users.headers.ROLE')"
                :error="errors.has('role')"
                :error-messages="errors.collect('role')"
                v-validate.disable="'required'"
                class="inputRole"
              ></v-select>
            </v-flex>

            <template v-if="editedUser.role === 'patient'">
              <v-flex xs12 md6>
                <v-text-field
                  id="password"
                  name="password"
                  type="password"
                  :label="$t('users.PASSWORD')"
                  v-model="editedUser.password"
                  :data-vv-as="$t('users.PASSWORD')"
                  :error="errors.has('password')"
                  :error-messages="errors.collect('password')"
                  key="password"
                  v-validate.disable="'required|min:5'"
                  ref="password"
                  autocomplete="off"
                ></v-text-field>
              </v-flex>
              <v-flex xs12 md6>
                <v-text-field
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  :label="$t('users.CONFIRM_PASSWORD')"
                  v-model="editedUser.confirmPassword"
                  :data-vv-as="$t('users.PASSWORD')"
                  :error="errors.has('confirmPassword')"
                  :error-messages="errors.collect('confirmPassword')"
                  key="confirmPassword"
                  v-validate.disable="'required|min:5|confirmed:password'"
                  autocomplete="off"
                ></v-text-field>
              </v-flex>
            </template>
            <v-flex xs12 md6 v-if="editedUser.role === 'patient'">
              <v-text-field
                id="dateBorn"
                name="dateBorn"
                type="date"
                v-model="editedUser.dateBorn"
                :label="$t('users.headers.DATEBORN')"
                :data-vv-as="$t('users.headers.DATEBORN')"
                :error="errors.has('dateborn')"
                :error-messages="errors.collect('dateborn')"
                v-validate.disable="'required'"
                autocomplete="off"
              ></v-text-field>
            </v-flex> 
            <v-flex xs12 md6 v-if="editedUser.role === 'patient'">
              <v-autocomplete
                id="country"
                name="country"
                type="text"
                :label="$t('myProfile.COUNTRY')"
                :search-input.sync="searchCountry"
                v-model="editedUser.country"
                :items="countries"
                clearable
                :no-data-text="$t('myProfile.NO_RESULTS_FOUND')"
                :data-vv-as="$t('myProfile.COUNTRY')"
                :error="errors.has('country')"
                :error-messages="errors.collect('country')"
                v-validate.disable="'required'"
                autocomplete="off"
                browser-autocomplete="nope"
              ></v-autocomplete>
            </v-flex>
            <v-flex xs12 md6 v-if="editedUser.role === 'patient'">
              <v-autocomplete
                id="city"
                name="city"
                :label="$t('myProfile.CITY')"
                :search-input.sync="searchCity"
                v-model="editedUser.city"
                :items="getCitiesByCountry(editedUser.country)"
                clearable
                :no-data-text="$t('myProfile.NO_RESULTS_FOUND')"
                :data-vv-as="$t('myProfile.CITY')"
                :error="errors.has('city')"
                :error-messages="errors.collect('city')"
                v-validate.disable="'required'"
                autocomplete="off"
                browser-autocomplete="nope"
              />
            </v-flex>
            <v-flex xs12 md6>
              <v-text-field
                id="phone"
                name="phone"
                type="tel"
                v-model="editedUser.phone"
                :label="$t('users.headers.PHONE')"
                :data-vv-as="$t('users.headers.PHONE')"
                :error="errors.has('phone')"
                :error-messages="errors.collect('phone')"
                v-validate.disable="'required'"
                autocomplete="off"
              ></v-text-field>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="red lighten3" flat @click="close" class="btnCancel">{{
          $t('dataTable.CANCEL')
        }}</v-btn>
        <v-btn flat @click="saveItem" class="btnSave primary">{{
          $t('dataTable.SAVE')
        }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { getAllCountries, getCitiesByCountry } from '@/services/api/countries'
import { getFormat } from '@/utils/utils.js'
import { mapActions } from 'vuex'
import { WebCam } from 'vue-web-cam'

const countries = getAllCountries()

export default {
  components: {
    "vue-web-cam": WebCam
  },
  data: () => ({
    defaultItem: {},
    searchCountry: '',
    searchCity: '',
    countries,
    editedUser: {},
    activeCamera: false, 
    camera: null,
    deviceId: null,
    devices: []
  }),
  props: ['value', 'item', 'save'],
  watch: {
    item(newValue) { 
      this.editedUser = newValue && Object.keys(newValue) ? newValue : {}
    },
    camera: function(id) {
      this.deviceId = id;
    },
    devices: function() {
      // Once we have a list select the first one
      const [first, ...tail] = this.devices;
      if (first) {
        this.camera = first.deviceId;
        this.deviceId = first.deviceId;
      }
    }
  },
  computed: {
    device: function() {
      return this.devices.find(n => n.deviceId === this.deviceId);
    },
    roles() {
      return [
        { name: this.$t('roles.ADMIN'), value: 'admin' },
        { name: this.$t('roles.USER'), value: 'user' },
        { name: this.$t('roles.PATIENT'), value: 'patient' }
      ]
    },
    formTitle() {
      return this.editedUser && this.editedUser._id
        ? this.$t('PATIENTS_LIST.dataTable.EDIT_ITEM')
        : this.$t('PATIENTS_LIST.dataTable.NEW_ITEM')
    },
    titleDialog(){
      return this.editedUser && this.editedUser._id
      ? this.$t('users.EDIT_ITEM')
      : this.$t('users.NEW_ITEM')
    }
  },
  methods: {
    ...mapActions(['editUser', 'userSignUp']),
    getCitiesByCountry,
    close() {
      this.editedUser = {}
      this.$emit('input')
      setTimeout(() => {
        this.editedUser = Object.assign({}, this.defaultItem)
      }, 300)
    },
    getFormat(date) {
      window.__localeId__ = this.$store.getters.locale
      return getFormat(date, 'ddd, MMMM D YYYY, h:mm a')
    },
    trueFalse(value) {
      return value
        ? '<i aria-hidden="true" class="v-icon material-icons green--text" style="font-size: 16px;">done</i>'
        : '<i aria-hidden="true" class="v-icon material-icons red--text" style="font-size: 16px;">clear</i>'
    },
    roleName(value) {
      return value === 'admin' ? this.$t('roles.ADMIN') : this.$t('roles.USER')
    },
    async saveItem() { 
      try {
        const valid = await this.$validator.validateAll()
        debugger
        if (valid) {
          this.userSignUp({
            name: this.editedUser.name,
            lastname: this.editedUser.lastname,
            email: this.editedUser.email,
            password: this.editedUser.password,
            role: this.editedUser.role,
            phone: this.editedUser.phone,
            city: this.editedUser.city,
            country: this.editedUser.country,
            verified: true
          }) 
           
          this.save(this.editedUser)
          this.close()
          return
        }
        // eslint-disable-next-line no-unused-vars
      } catch (error) {
        console.log('err form', error)
        this.close()
        return
      }
    },

    stopCamara(){
      this.$refs.webcam.stop()
      this.onStop()
      this.activeCamera = false
      this.devices = [];
      this.deviceId = null 
    },
    onCapture() {
      this.img = this.$refs.webcam.capture();
      this.editedUser.img = this.img;
    },
    onStarted(stream) {
      console.log("On Started Event", stream);
    },
    onStopped(stream) {
      console.log("On Stopped Event", stream);
    },
    onStop() {
      this.$refs.webcam.stop();
    },
    onStart() {
      this.$refs.webcam.start();
    },
    onError(error) {
      console.log("On Error Event", error);
    },
    onCameras(cameras) {
      this.devices = cameras;
      console.log("On Cameras Event", cameras);
    },
    onCameraChange(deviceId) {
      this.deviceId = deviceId;
      this.camera = deviceId;
      console.log("On Camera Change Event", deviceId);
    }
  }
}
</script>

<style>
figure.figure.imageProfile {
    position: relative;
    bottom: 0px;
}
.botoneraCamara {
    margin-top: -335px !important;
}
@media(max-width:670px){
.botoneraCamara {
  margin-top: 0px !important;
}
}
</style>
