<template>
  <div class="bg-site">
    <v-layout wrap>
      <v-flex xs12 sm12 md4 mt-3 pl-4>
        <HeadingSection :title="$t('users.TITLE')" icon="people" />
      </v-flex>
      <v-flex xs12 sm6 md4 px-3>
        <v-text-field
          v-model="search"
          append-icon="search"
          :label="$t('dataTable.SEARCH')"
          single-line
          hide-details
          clearable
        ></v-text-field>
      </v-flex>
      <v-flex xs12 sm6 md4 text-xs-right mb-2 mt-2 pr-2>
        <v-btn
          color="primary"
          @click="
            editedItem = {}
            dialog = true
          "
          class="btnNewItem pr-4"
        >
          <v-icon class="mr-2">add</v-icon>
          {{ $t('dataTable.NEW_ITEM') }}
        </v-btn>
        <UserForm v-model="dialog" :save="save" :item="editedItem" />
      </v-flex>
    </v-layout>
    <v-flex xs12 sm12 pa-3>
      <v-data-table
        must-sort
        :loading="dataTableLoading"
        :rows-per-page-text="$t('dataTable.ROWS_PER_PAGE')"
        :no-data-text="$t('dataTable.NO_DATA')"
        :no-results-text="$t('dataTable.NO_RESULTS')"
        :rows-per-page-items="[5, 10, 25]"
        :headers="headers"
        :items="items"
        :pagination.sync="pagination"
        :total-items="totalItems"
        class="elevation-1"
      >
        <template v-slot:items="props">
          <td class="fill-height px-0">
            <v-layout class="justify-center">
              <v-tooltip top>
                <v-btn
                  icon
                  class="mx-0"
                  slot="activator"
                  @click="editItem(props.item)"
                >
                  <v-icon>edit</v-icon>
                </v-btn>
                <span>{{ $t('dataTable.EDIT') }}</span>
              </v-tooltip>
              <v-tooltip top>
                <v-btn
                  icon
                  class="mx-0"
                  slot="activator"
                  @click="editInvestment(props.item)"
                >
                  <v-icon>attach_money</v-icon>
                </v-btn>
                <span>{{ $t('dataTable.EDIT_INVESTMENT') }}</span>
              </v-tooltip>
              <v-tooltip top>
                <v-btn
                  icon
                  class="mx-0"
                  slot="activator"
                  @click="deleteItem(props.item)"
                >
                  <v-icon>delete</v-icon>
                </v-btn>
                <span>{{ $t('dataTable.DELETE') }}</span>
              </v-tooltip>
            </v-layout>
          </td>
          <td>{{ props.item.name }}</td>
          <td>{{ props.item.email }}</td>
          <td>{{ roleName(props.item.role) }}</td>
          <td v-html="trueFalse(props.item.verified)"></td>
          <td>{{ props.item.city }}</td>
          <td>{{ props.item.country }}</td>
          <td>{{ props.item.phone }}</td>
          <td>{{ getFormat(props.item.createdAt) }}</td>
          <td>{{ getFormat(props.item.updatedAt) }}</td>
        </template>
        <template v-slot:pageText="props">
          {{ props.pageStart }} - {{ props.pageStop }} {{ $t('dataTable.OF') }}
          {{ props.itemsLength }}
        </template>
        <template v-slot:no-data>{{ $t('dataTable.NO_DATA') }}</template>
        <template v-slot:no-results>{{ $t('dataTable.NO_RESULTS') }}</template>
      </v-data-table>
    </v-flex>
    <ErrorMessage />
    <SuccessMessage />
    <InvForm
      v-model="inv_dialog"
      :save="saveInv"
      :item="editedInv"
      :user="invUser"
    />
  </div>
</template>

<script>
import UserForm from '@/components/admin/EditUser'
import InvForm from '@/components/admin/Investment'
import { mapActions } from 'vuex'
import { getFormat, buildPayloadPagination } from '@/utils/utils.js'
import HeadingSection from '@/components/common/HeadingSection.vue'
import axios from 'axios'
export default {
  components: {
    UserForm,
    InvForm,
    HeadingSection
  },
  metaInfo() {
    return {
      title: this.$store.getters.appTitle,
      titleTemplate: this.$t('users.TITLE') + ' - %s'
    }
  },
  data() {
    return {
      searchInput: '',
      dataTableLoading: true,
      delayTimer: null,
      dialog: false,
      search: '',
      inv_dialog: false,
      pagination: {},
      editedItem: {},
      editedInv: {},
      invUser: {},
      defaultItem: {},
      fieldsToSearch: ['name', 'email', 'role', 'city', 'country', 'phone']
    }
  },
  computed: {
    roles() {
      return [
        { name: this.$t('roles.ADMIN'), value: 'admin' },
        { name: this.$t('roles.USER'), value: 'user' }
      ]
    },
    allCities() {
      return this.$store.state.cities.allCities
    },
    headers() {
      return [
        {
          text: this.$i18n.t('dataTable.ACTIONS'),
          value: '_id',
          sortable: false,
          width: 100
        },
        {
          text: this.$i18n.t('users.headers.NAME'),
          align: 'left',
          sortable: true,
          value: 'name'
        },
        {
          text: this.$i18n.t('users.headers.EMAIL'),
          align: 'left',
          sortable: true,
          value: 'email'
        },
        {
          text: this.$i18n.t('users.headers.ROLE'),
          align: 'left',
          sortable: true,
          value: 'role'
        },
        {
          text: this.$i18n.t('users.headers.VERIFIED'),
          align: 'left',
          sortable: true,
          value: 'verified'
        },
        {
          text: this.$i18n.t('users.headers.CITY'),
          align: 'left',
          sortable: true,
          value: 'city'
        },
        {
          text: this.$i18n.t('users.headers.COUNTRY'),
          align: 'left',
          sortable: true,
          value: 'country'
        },
        {
          text: this.$i18n.t('users.headers.PHONE'),
          align: 'left',
          sortable: true,
          value: 'phone'
        },
        {
          text: this.$i18n.t('common.CREATED'),
          align: 'left',
          sortable: true,
          value: 'createdAt'
        },
        {
          text: this.$i18n.t('common.UPDATED'),
          align: 'left',
          sortable: true,
          value: 'updatedAt'
        }
      ]
    },
    items() {
      return this.$store.state.adminUsers.users
    },
    totalItems() {
      return this.$store.state.adminUsers.totalUsers
    }
  },
  watch: {
    pagination: {
      async handler() {
        try {
          this.dataTableLoading = true
          await this.getUsers(
            buildPayloadPagination(this.pagination, this.buildSearch())
          )
          this.dataTableLoading = false
          // eslint-disable-next-line no-unused-vars
        } catch (error) {
          this.dataTableLoading = false
        }
      },
      deep: true
    },
    search() {
      clearTimeout(this.delayTimer)
      this.delayTimer = setTimeout(() => {
        this.doSearch()
      }, 400)
    }
  },
  methods: {
    ...mapActions([
      'getAllCities',
      'getUsers',
      'editUser',
      'saveUser',
      'deleteUser'
    ]),
    getFormat(date) {
      window.__localeId__ = this.$store.getters.locale
      return getFormat(date, 'ddd, MMMM D YYYY, h:mm a')
    },
    roleName(value) {
      return value === 'admin' ? this.$t('roles.ADMIN') : this.$t('roles.USER')
    },
    trueFalse(value) {
      return value
        ? '<i aria-hidden="true" class="v-icon material-icons green--text" style="font-size: 16px;">done</i>'
        : '<i aria-hidden="true" class="v-icon material-icons red--text" style="font-size: 16px;">clear</i>'
    },
    async doSearch() {
      try {
        this.dataTableLoading = true
        await this.getUsers(
          buildPayloadPagination(this.pagination, this.buildSearch())
        )
        this.dataTableLoading = false
        // eslint-disable-next-line no-unused-vars
      } catch (error) {
        this.dataTableLoading = false
      }
    },
    buildSearch() {
      return this.search
        ? { query: this.search, fields: this.fieldsToSearch.join(',') }
        : {}
    },
    editItem(item) {
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },
    async editInvestment(user) {
      console.log(user)
      const { data } = await axios.get(`/investments/user_id/${user._id}`)
      console.log(data)
      this.editedInv = data
      this.invUser = user
      this.inv_dialog = true
    },
    async deleteItem(item) {
      try {
        const response = await this.$confirm(
          this.$t('common.DO_YOU_REALLY_WANT_TO_DELETE_THIS_ITEM'),
          {
            title: this.$t('common.WARNING'),
            buttonTrueText: this.$t('common.DELETE'),
            buttonFalseText: this.$t('common.CANCEL'),
            buttonTrueColor: 'red lighten3',
            buttonFalseColor: 'yellow lighten3'
          }
        )
        if (response) {
          this.dataTableLoading = true
          await this.deleteUser(item._id)
          await this.getUsers(
            buildPayloadPagination(this.pagination, this.buildSearch())
          )
          this.dataTableLoading = false
        }
        // eslint-disable-next-line no-unused-vars
      } catch (error) {
        this.dataTableLoading = false
      }
    },
    async saveInv() {},
    async save(item) {
      try {
        this.dataTableLoading = true
        // Updating item
        if (item._id) {
          await this.editUser(item)
          await this.getUsers(
            buildPayloadPagination(this.pagination, this.buildSearch())
          )
          this.dataTableLoading = false
        } else {
          // Creating new item
          await this.saveUser({
            name: item.name,
            email: item.email,
            password: item.password,
            role: item.role,
            phone: item.phone,
            city: item.city,
            country: item.country
          })
          await this.getUsers(
            buildPayloadPagination(this.pagination, this.buildSearch())
          )
          this.dataTableLoading = false
        }
        return
        // eslint-disable-next-line no-unused-vars
      } catch (error) {
        this.dataTableLoading = false
        return
      }
    }
  },
  async created() {
    try {
      await this.getAllCities()
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      return
    }
  }
}
</script>

<style>
table.v-table {
  max-width: none;
}
</style>
