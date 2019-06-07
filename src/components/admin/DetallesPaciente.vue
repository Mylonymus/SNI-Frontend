<template>
  <v-dialog :value="value" @input="$emit('input')" max-width="800px" content-class="dlgNewEditItem">
    <v-card>
      <v-card-title class="text-xs-center mb-0 pb-0">
        <HeadingSection :title="$t('admin.INVESTMENT_TITLE')" icon="list_alt"/>
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
                <label for="name">
                  <b>{{ $t('users.headers.NAME') }}</b>
                </label>
                <div name="name">{{ user.name }}</div>
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
                  <HeadingSection :title="$t('movement.hemoRegisters')" icon="compare_arrows"/>
                </v-flex>
                <v-flex xs12 sm6 md text-xs-right mb-2 mt-4>
                  <v-btn
                    color="primary"
                    @click="editedItem = {},createItem(item),
                      hemoRecordDialog = true
                    "
                    class="btnNewItem"
                  >
                    <v-icon class="mr-2">add</v-icon>
                    {{ $t('dataTable.NEW_MOVEMENT') }}
                  </v-btn>
                </v-flex>
              </v-layout>
              <v-data-table
                v-if="!!user._id"
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
                  <td>
                    <v-layout row>
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
                          @click="deleteItem(props.item)"
                        >
                          <v-icon>delete</v-icon>
                        </v-btn>
                        <span>{{ $t('dataTable.DELETE') }}</span>
                      </v-tooltip>
                    </v-layout>
                  </td>
                  <td>
                    {{ props.item.age }} 
                  </td>
                  <td class="text-xs-right">{{ props.item.typeRecord }}</td>
                  <td class="text-xs-right">
                    {{ getFormat(props.item.date) }}
                  </td>
                </template>
              </v-data-table>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>
    </v-card> 
    <HemoRecordForm v-model="hemoRecordDialog" :item="HRItem" :save="saveRecord" />
  </v-dialog>
</template>

<script>
import { mapActions } from 'vuex' 
import { getFormat, buildPayloadPagination } from '@/utils/utils.js'
import HemoRecordForm from './Record'
import HeadingSection from '@/components/common/HeadingSection.vue'
import { buildSuccess } from '@/utils/utils'
import axios from 'axios'

export default {
  components: {
    HeadingSection,
    HemoRecordForm
  },
  data: () => ({
    defaultItem: {},
    searchBalance: '',
    searchInput: '',
    delayTimer: null,
    pagination: {},
    hemoRecords: [],
    search: '',
    editedItem: {},
    HRItem: {},
    hemoRecordDialog: false,
    dataTableLoading: false
  }),
  props: ['value', 'item', 'user'],
  watch: {
    async value(val) {
      if (val) {
        //this.currentBalance()
      }
      if (!val) {
        this.clearAdminRecords()
      }
    },
    async item(newValue) {
      this.editedItem = newValue && Object.keys(newValue) ? newValue : {}
    },
    
    pagination: {
      
      async handler() {
        debugger;
        if (!this.item.patient_id) {
          return
        }
        try {
          this.dataTableLoading = true
          await this.retrieveAdminRecords({
            ...buildPayloadPagination(this.pagination, this.buildSearch()),
            patient_id: this.item.patient_id
          })
          console.log('building')
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
  computed: {
    items() {
      return this.$store.state.adminRecords.records
    },
    totalItems() {
      return this.$store.state.adminRecords.totalRecords
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
      'editRecord',
      'saveRecord',
      'deleteRecord',
      'retrieveAdminRecords',
      'clearAdminRecords'
    ]),
    close() {
      this.editedItem = {}
      this.$emit('input')
      this.clearAdminRecords()
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
    createItem(item) {
      this.HRItem.patient_id = item.patient_id;
      this.HRItem.name = item.name;
      this.HRItem.lastname = item.lastname;
      this.HRItem.age = item.age; 
      this.hemoRecordDialog = true;
    },

    editItem(item) {
      this.HRItem = Object.assign({}, item);
      this.hemoRecordDialog = true;
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
          await this.deleteHemoRecord(item._id)
          await this.retrieveHemoRecords({
            ...buildPayloadPagination(this.pagination, this.buildSearch()),
            user_id: this.user._id
          })
          this.dataTableLoading = false
        }
        // eslint-disable-next-line no-unused-vars
      } catch (error) {
        this.dataTableLoading = false
      }
    }
  }
}
</script>
