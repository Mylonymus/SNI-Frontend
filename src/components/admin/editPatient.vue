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
              <v-flex xs12 md4>
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
            <v-flex xs12 md6>
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
            <v-flex xs12 md6>
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

const countries = getAllCountries()

export default {
  data: () => ({
    defaultItem: {},
    searchCountry: '',
    searchCity: '',
    countries,
    editedUser: {}
  }),
  props: ['value', 'item', 'save'],
  watch: {
    item(newValue) { 
      this.editedUser = newValue && Object.keys(newValue) ? newValue : {}
    }
  },
  computed: {
    roles() {
      return [
        { name: this.$t('roles.ADMIN'), value: 'admin' },
        { name: this.$t('roles.USER'), value: 'user' }
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
    ...mapActions(['editUser', 'saveUser']),
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
        if (valid) {
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
    }
  }
}
</script>
