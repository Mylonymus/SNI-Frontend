<template>
  <v-dialog
    :value="value"
    @input="$emit('input')"
    max-width="800px"
    content-class="dlgNewEditItem"
  >
    <v-card>
      <v-card-title class="text-xs-center mb-0 pb-0">
        <HeadingSection :title="$t('admin.INVESTMENT_TITLE')" icon="list_alt" />
      </v-card-title>
      <v-card-text class="mt-0 pt-0">
        <v-container grid-list-md pt-0>
          <h2 class="mt-3">
            <v-icon>account_box</v-icon>
            {{ $t('admin.USER_DETAILS') }}
          </h2>
          <v-layout wrap>
            <template>
              <v-flex xs12 md4>
                <label for="name"
                  ><b>{{ $t('users.headers.NAME') }}</b></label
                >
                <div name="name">
                  {{ user.name }}
                </div>
              </v-flex> 
              <v-flex xs12 md4>
                <label for="verified">
                  <b>{{ $t('users.headers.VERIFIED') }}</b>
                </label> 
              </v-flex>
            </template>
            <v-flex xs12 md6>
              <h2 class="mt-3">
                <v-icon>build</v-icon>
                {{ $t('admin.INV_OPTIONS') }}
              </h2>
            </v-flex>
            <v-flex xs12>
              <v-layout row wrap>
                <v-flex xs12 sm6 md68 mt-3>
                  <HeadingSection
                    :title="$t('movement.movements')"
                    icon="compare_arrows"
                  />
                </v-flex>
                <v-flex xs12 sm6 md text-xs-right mb-2 mt-4>
                  <v-btn
                    color="primary"
                    @click="
                      movItem = {}
                      movementDialog = true
                    "
                    class="btnNewItem"
                  >
                    <v-icon class="mr-2">add</v-icon>
                    {{ $t('dataTable.NEW_MOVEMENT') }}
                  </v-btn>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions } from 'vuex'
import { getFormat, buildPayloadPagination } from '@/utils/utils.js'
import HeadingSection from '@/components/common/HeadingSection.vue'
import { buildSuccess } from '@/utils/utils'
import axios from 'axios'

export default {
  components: {
    HeadingSection
  },
  data: () => ({
    defaultItem: {},
    searchBalance: '',
    searchInput: '',
    delayTimer: null,
    pagination: {},
    movements: [],
    search: '',
    balance: {
      balance: '0.00',
      currency: ''
    },
    editedItem: {},
    movItem: {},
    movementDialog: false,
    dataTableLoading: false
  }),
  props: ['value', 'item', 'user'],
  watch: {
    async value(val) {
      if (val) {
        //this.currentBalance()
      }
      if (!val) {
        //this.clearAdminMovements()
      }
    },
    async item(newValue) {
      this.editedItem = newValue && Object.keys(newValue) ? newValue : {}
    },
    pagination: {
      
    },
    search() {
      clearTimeout(this.delayTimer)
      this.delayTimer = setTimeout(() => {
        this.doSearch()
      }, 400)
    }
  },
  computed: {
    items() {
      //return this.$store.state.adminRecords.records
    },
    totalItems() {
      //return this.$store.state.adminRecords.totalRecords
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
          text: this.$i18n.t('movement.AMOUNT'),
          align: 'left',
          sortable: true,
          value: 'amount'
        },
        {
          text: this.$i18n.t('movement.TX_TYPE'),
          align: 'left',
          sortable: true,
          value: 'tx_type'
        },
        {
          text: this.$i18n.t('movement.DATE'),
          align: 'left',
          sortable: true,
          value: 'date'
        }
      ]
    }
  },
  methods: {
    ...mapActions([
      'editMovement',
      'saveMovement',
      'deleteMovement',
      'retrieveAdminMovements',
      'clearAdminMovements'
    ]),
    close() {
      this.editedItem = {}
      this.$emit('input')
      this.clearAdminMovements()
      this.user = {}
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
      }, 300)
    },
    async doSearch() {
      try {
        this.dataTableLoading = true
        await this.getPatients(
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
    getFormat(date) {
      window.__localeId__ = this.$store.getters.locale
      return getFormat(date, 'ddd, MMMM D YYYY, h:mm a')
    },
    trueFalse(value) {
      return value
        ? '<i aria-hidden="true" class="v-icon material-icons green--text" style="font-size: 16px;">done</i>'
        : '<i aria-hidden="true" class="v-icon material-icons red--text" style="font-size: 16px;">clear</i>'
    },
    async saveDetallesPaciente() {
      try {
        const response = await axios.patch(
          `/detallesPaciente/${this.editedItem._id}`
        )
        await buildSuccess(
          {
            msg: 'common.SAVED_SUCCESSFULLY'
          },
          this.$store.commit
        )
      } catch (err) {
        console.log(err)
      }
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
    },
    editItem(item) {
      this.movItem = Object.assign({}, item)
      this.movementDialog = true
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
          await this.deleteMovement(item._id)
          await this.retrieveAdminMovements({
            ...buildPayloadPagination(this.pagination, this.buildSearch()),
            user_id: this.user._id
          })
          this.dataTableLoading = false
        }
        // eslint-disable-next-line no-unused-vars
      } catch (error) {
        this.dataTableLoading = false
      }
    },
    async currentBalance() {
      const id = this.user._id
      const balance = await axios.get('/movements/current-balance', {
        params: { user_id: id }
      })
      this.balance = Object.assign({}, balance.data)
    },
    async saveMov(item) {
      try {
        console.log(item)
        this.dataTableLoading = true
        // Updating item
        if (item._id) {
          await this.editMovement(item)
          await this.retrieveAdminMovements({
            ...buildPayloadPagination(this.pagination, this.buildSearch()),
            user_id: this.user._id
          })
          this.dataTableLoading = false
        } else {
          // Creating new item
          await this.saveMovement({
            amount: item.amount,
            date: item.date,
            tx_type: item.tx_type,
            currency: item.currency,
            user_id: this.user._id
          })
          await this.retrieveAdminMovements({
            ...buildPayloadPagination(this.pagination, this.buildSearch()),
            user_id: this.user._id
          })
          this.dataTableLoading = false
        }
        return
        // eslint-disable-next-line no-unused-vars
      } catch (error) {
        this.dataTableLoading = false
        return
      }
    }
  }
}
</script>
