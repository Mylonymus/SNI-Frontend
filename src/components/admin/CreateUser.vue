<template>
  <v-dialog
    :value="value"
    @input="$emit('input')"
    max-width="800px"
    content-class="dlgNewCreateItem"
  >
    <v-card>
      <v-card-title>
        <span class="headline">{{ $t('users.NEW_ITEM') }}</span>
      </v-card-title>
      <v-card-text>
        <v-container grid-list-md>
          <v-layout wrap>
            <template v-if="editedItem._id">
              <v-flex xs12 md4>
                <label for="createdAt">{{ $t('common.CREATED') }}</label>
                <div name="createdAt">
                  {{ getFormat(editedItem.createdAt) }}
                </div>
              </v-flex>
              <v-flex xs12 md4>
                <label for="updatedAt">{{ $t('common.UPDATED') }}</label>
                <div name="updatedAt">
                  {{ getFormat(editedItem.updatedAt) }}
                </div>
              </v-flex>
              <v-flex xs12 md4>
                <label for="verified">
                  {{ $t('users.headers.VERIFIED') }}
                </label>
                <div
                  name="verified"
                  v-html="trueFalse(editedItem.verified)"
                ></div>
              </v-flex>
            </template>
            <v-flex xs12 md6>
              <v-text-field
                id="name"
                name="name"
                v-model="editedItem.name"
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
                id="email"
                name="email"
                type="email"
                v-model="editedItem.email"
                :label="$t('users.headers.EMAIL')"
                :data-vv-as="$t('users.headers.EMAIL')"
                :error="errors.has('email')"
                :error-messages="errors.collect('email')"
                v-validate.disable="'required|email'"
                autocomplete="off"
              ></v-text-field>
            </v-flex>
            <template v-if="!editedItem._id">
              <v-flex xs12 md6>
                <v-text-field
                  id="password"
                  name="password"
                  type="password"
                  :label="$t('users.PASSWORD')"
                  v-model="editedItem.password"
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
                  v-model="editedItem.confirmPassword"
                  :data-vv-as="$t('users.PASSWORD')"
                  :error="errors.has('confirmPassword')"
                  :error-messages="errors.collect('confirmPassword')"
                  key="confirmPassword"
                  v-validate.disable="'required|min:5|confirmed:password'"
                  autocomplete="off"
                ></v-text-field>
              </v-flex>
            </template>
            <v-flex xs12 md6>
              <v-select
                clearable
                id="role"
                name="role"
                v-model="editedItem.role"
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
            <v-flex xs12 md6>
              <v-autocomplete
                id="country"
                name="country"
                type="text"
                :label="$t('myProfile.COUNTRY')"
                :search-input.sync="searchCountry"
                v-model="editedItem.country"
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
                v-model="editedItem.city"
                :items="getCitiesByCountry(editedItem.country)"
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
                v-model="editedItem.phone"
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
    editedItem: {}
  }),
  props: ['value', 'item', 'save'],
  watch: {
    item(newValue) {
      this.editedItem = newValue && Object.keys(newValue) ? newValue : {}
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
      return this.editedItem && this.editedItem._id
        ? this.$t('PATIENTS_LIST.dataTable.EDIT_ITEM')
        : this.$t('PATIENTS_LIST.dataTable.NEW_ITEM')
    }
  },
  methods: {
    ...mapActions(['editUser', 'saveUser']),
    getCitiesByCountry,
    close() {
      this.editedItem = {}
      this.$emit('input')
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
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
          this.save(this.editedItem)
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
