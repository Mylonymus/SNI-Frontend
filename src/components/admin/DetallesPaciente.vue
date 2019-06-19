<template>
  <v-dialog :value="value" @input="$emit('input')" max-width="100%" content-class="dlgNewEditItem">
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
                <label for="lastname">
                  <b>{{ $t('users.headers.LASTNAME') }}</b> 
                </label>
                <div name="lastname">{{ user.lastname }}</div>
              </v-flex>
               
            </template> 
            <v-flex xs12>
                <h2 class="mt-3">
                  <v-icon>build</v-icon>
                  {{ $t('admin.STATUS_PATIENT') }}
                </h2> 
              </v-flex>
              <v-flex xs12 md4>
                <label for="status">
                    <b>{{ $t('users.headers.STATUS') }}</b>
                  </label>
                  <div name="status">{{ user.status }}</div>
              </v-flex>
            <v-flex xs12>
              <v-layout row wrap>
                <v-flex xs12 sm6 md68 mt-3>
                  <HeadingSection :title="$t('movement.hemoRegisters')" icon="compare_arrows"/>
                </v-flex>
                <v-flex xs12 sm6 md text-xs-right mb-2 mt-4>
                  <v-btn
                    color="primary"
                    @click="editedItem = {}, addNewRecord()
                    "
                    class="btnNewItem"
                  >
                    <v-icon class="mr-2">add</v-icon>
                    {{ $t('admin.NEW_RECORD') }}
                  </v-btn>
                </v-flex>
              </v-layout>
              <v-data-table
                v-if="!!item.patient_id"
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
                ref="listadoRecords"
              >
                <template v-slot:items="props">
                  <tr>
                    <td>
                      <v-text-field
                      prepend-icon="date_range"
                      id="age"
                      name="age"
                      v-model="props.item.age"
                      :label="$t('movement.age')"
                      :data-vv-as="$t('movement.age')"
                      :error="errors.has('age')"
                      :error-messages="errors.collect('age')"
                      v-validate="{ required: true }"
                      autocomplete="off"
                    ></v-text-field> 
                    </td>
                    <td>
                      <v-text-field
                      prepend-icon="blur_linear"
                      id="initialTA"
                      name="initialTA"
                      v-model="props.item.initialTA"
                      :label="$t('movement.initialTA')"
                      :data-vv-as="$t('movement.initialTA')"
                      :error="errors.has('initialTA')"
                      :error-messages="errors.collect('initialTA')"
                      v-validate="{ required: true }"
                      autocomplete="off"
                    ></v-text-field>
                    </td>
                    <td>
                      <v-text-field
                      prepend-icon="blur_linear"
                      id="finalTA"
                      name="finalTA"
                      v-model="props.item.finalTA"
                      :label="$t('movement.finalTA')"
                      :data-vv-as="$t('movement.finalTA')"
                      :error="errors.has('finalTA')"
                      :error-messages="errors.collect('finalTA')"
                      v-validate="{ required: true }"
                      autocomplete="off"
                    ></v-text-field> 
                    </td>
                    <td>
                      <v-menu
                      :ref="props.item._id+'_menu'"
                      :v-model="props.item._id+'_menu'"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      :return-value.sync="editedItem.date"
                      lazy
                      transition="scale-transition"
                      offset-y
                      full-width
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          prepend-icon="event"
                          readonly
                          v-on="on"
                          id="date"
                          name="date"
                          v-model="props.item.date"
                          :label="$t('movement.DATE')"
                          :data-vv-as="$t('movement.DATE')"
                          :error="errors.has('date')"
                          :error-messages="errors.collect('date')"
                          v-validate.disable="'required:date'"
                          autocomplete="off"
                        ></v-text-field>
                      </template>
                      <v-date-picker v-model="props.item.date" no-title scrollable>
                        <v-spacer></v-spacer>
                        <v-btn flat color="primary" @click="menu = false">Cancel</v-btn>
                        <v-btn flat color="primary" @click="$refs[props.item._id+'_menu'].save(editedItem.date)">OK</v-btn>
                      </v-date-picker>
                    </v-menu>
                    </td>
                    <td>
                      <v-text-field
                      prepend-icon="healing"
                      id="weightDry"
                      name="weightDry"
                      v-model="props.item.weightDry"
                      :label="$t('movement.weightDry')"
                      :data-vv-as="$t('movement.weightDry')"
                      :error="errors.has('weightDry')"
                      :error-messages="errors.collect('weightDry')"
                      v-validate="{ required: true }"
                      autocomplete="off"
                    ></v-text-field>
                    </td>
                    <td>


                    <v-text-field
                      prepend-icon="healing"
                      id="weightPreHd"
                      name="weightPreHd"
                      v-model="props.item.weightPreHd"
                      :label="$t('movement.weightPreHd')"
                      :data-vv-as="$t('movement.weightPreHd')"
                      :error="errors.has('weightPreHd')"
                      :error-messages="errors.collect('weightPreHd')"
                      v-validate="{ required: true }"
                      autocomplete="off"
                    ></v-text-field>
                    </td>
                    <td>


                    <v-text-field
                      prepend-icon="healing"
                      id="weightPostHd"
                      name="weightPostHd"
                      v-model="props.item.weightPostHd"
                      :label="$t('movement.weightPostHd')"
                      :data-vv-as="$t('movement.weightPostHd')"
                      :error="errors.has('weightPostHd')"
                      :error-messages="errors.collect('weightPostHd')"
                      v-validate="{ required: true }"
                      autocomplete="off"
                    ></v-text-field>
                    </td>
                    <td>
                    <v-layout row>
                      <v-tooltip top>
                        <v-btn icon class="mx-0" slot="activator" @click="saveRecordDetalle(props.item)">
                          <v-icon>save</v-icon>
                        </v-btn>
                        <span>{{ $t('dataTable.SAVE') }}</span>
                      </v-tooltip>
                    </v-layout>
                  </td>
                  </tr>


                  <!-- <td>
                    <v-layout row>
                      <v-tooltip top>
                        <v-btn icon class="mx-0" slot="activator" @click="deleteItem(props.item)">
                          <v-icon>delete</v-icon>
                        </v-btn>
                        <span>{{ $t('dataTable.DELETE') }}</span>
                      </v-tooltip>
                    </v-layout>
                  </td>
                  <td class="text-xs-center" @click="editItem(props.item)">{{ props.item.age }}</td>
                  <td class="text-xs-center" @click="editItem(props.item)">{{ props.item.typeRecord }}</td>
                  <td class="text-xs-right" @click="editItem(props.item)">{{ getFormat(props.item.date) }}</td> -->
                </template>
              </v-data-table>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>
    </v-card>
    <HemoRecordForm v-model="hemoRecordDialog" :item="HRItem" :save="saveRecordDetalle"/>
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
    typeRecord: ['Nefrología'],
    searchBalance: '',
    searchInput: '',
    delayTimer: null,
    pagination: {},
    records: [],
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
          this.dataTableLoading = true
        await this.retrieveAdminRecords({
          ...buildPayloadPagination(this.pagination, this.buildSearch()),
          patient_id: this.item.patient_id
        })
          console.log('building')
          this.dataTableLoading = false
      }
      if (!val) {
        ;
        this.clearAdminRecords()
      }
    },
    async item(newValue) {
      this.editedItem = newValue && Object.keys(newValue) ? newValue : {}
    },
    pagination: {
      async handler() {  
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
          console.log(error);
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
      return this.$store.state.adminRecords.adminRecords
    },
    totalItems() {
      return this.$store.state.adminRecords.totalAdminRecords
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
          text: this.$i18n.t('movement.age'),
          align: 'center',
          sortable: true,
          value: 'age'
        },
        {
          text: this.$i18n.t('record.SPECIALITY'),
          align: 'center',
          sortable: true,
          value: 'typeRecord'
        },
        {
          text: this.$i18n.t('movement.DATE'),
          align: 'right',
          sortable: true,
          value: 'date'
        }
      ]
    }
  },

    async created(){
      
    },  
    async mounted(){
      
    },
  methods: {
    ...mapActions([
      'editRecord',
      'saveRecord',
      'deleteRecord',
      'retrieveAdminRecords',
      'clearAdminRecords'
    ]),   

    addNewRecord(){
      this.items.unshift({age: '',initialTA: '', finalTA: '', weightDry: '', weightPreHd: '', weightPostHd: '', typeRecord: 'Nefrología'})
    },
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
          await this.retrieveAdminRecords({
            ...buildPayloadPagination(this.pagination, this.buildSearch()),
            patient_id: this.item.patient_id
          })
          console.log('building')
          this.dataTableLoading = falses
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
    async saveRecordDetalle(item) {
      try {
        const valid = await this.$validator.validateAll() 
        if (valid) { 
          this.dataTableLoading = true 
          if(item._id)
          { 
            await this.editRecord(item) 
          }else{   
           await this.saveRecord({
              patient_id:  this.item.patient_id, 
              name: this.item.name,
              lastname: this.item.lastname,
              age: item.age,
              typeRecord: item.typeRecord,
              date: item.date,
              weightDry: item.weightDry,
              weightPreHd: item.weightPreHd,
              weightPostHd: item.weightPostHd,
              initialTA: item.initialTA,
              finalTA: item.finalTA,
              filter: item.filter,
              time: item.time,
              qs: item.qs,
              qd: item.qd,
              heparina: item.heparina,
              ufml: item.ufml,
              profileUf: item.profileUf,
              svsMeQL: item.svsMeQL,
              profileSVS: item.profileSVS,
              kmeql: item.kmeql,
              epo: item.epo,
              hierro: item.hierro,
              complico: item.complico,
              medidas: item.medidas,
              acceVasc: item.acceVasc,
              hb: item.hb,
              hto: item.hto,
              cmhb: item.cmhb,
              vgm: item.vgm,
              ferritina: item.ferritina,
              satTR: item.satTR,
              leucos: item.leucos,
              plaque: item.plaque,
              glucosa: item.glucosa,
              urea: item.urea,
              cr: item.cr,
              acUrico: item.acUrico,
              ca: item.ca,
              p: item.p,
              fosfAlcalin: item.fosfAlcalin,
              pth: item.pth,
              colest: item.colest,
              tgc: item.tgc,
              protTotales: item.protTotales,
              albunin: item.albunin,
              ast: item.ast,
              alt: item.alt,
              bi: item.bi,
              bd: item.bd,
              na: item.na,
              k: item.k,
              tp: item.tp,
              tpp: item.tpp
            }) 
          }   
          await this.retrieveAdminRecords({
              ...buildPayloadPagination(this.pagination, this.buildSearch()),
              patient_id: this.item.patient_id
            })

            this.dataTableLoading = false 
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

              

      this.HRItem.patient_id = item.patient_id
      this.HRItem.name = item.name
      this.HRItem.lastname = item.lastname
      this.hemoRecordDialog = true
    }, 
    editItem(item) {
      this.HRItem = Object.assign({}, item)
      this.HRItem._id = item._id, 
      this.HRItem.patient_id =  this.item.patient_id, 
      this.HRItem.name = this.item.name,
      this.HRItem.lastname = this.item.lastname,
      this.HRItem.age = item.age,
      this.HRItem.typeRecord = item.typeRecord,
      this.HRItem.date = item.date,
      this.HRItem.weightDry = item.weightDry,
      this.HRItem.weightPreHd = item.weightPreHd,
      this.HRItem.weightPostHd = item.weightPostHd,
      this.HRItem.initialTA = item.initialTA,
      this.HRItem.finalTA = item.finalTA,
      this.HRItem.filter = item.filter,
      this.HRItem.time = item.time,
      this.HRItem.qs = item.qs,
      this.HRItem.qd = item.qd,
      this.HRItem.heparina = item.heparina,
      this.HRItem.ufml = item.ufml,
      this.HRItem.profileUf = item.profileUf,
      this.HRItem.svsMeQL = item.svsMeQL,
      this.HRItem.profileSVS = item.profileSVS,
      this.HRItem.kmeql = item.kmeql,
      this.HRItem.epo = item.epo,
      this.HRItem.hierro = item.hierro,
      this.HRItem.complico = item.complico,
      this.HRItem.medidas = item.medidas,
      this.HRItem.acceVasc = item.acceVasc,
      this.HRItem.hb = item.hb,
      this.HRItem.hto = item.hto,
      this.HRItem.cmhb = item.cmhb,
      this.HRItem.vgm = item.vgm,
      this.HRItem.ferritina = item.ferritina,
      this.HRItem.satTR = item.satTR,
      this.HRItem.leucos = item.leucos,
      this.HRItem.plaque = item.plaque,
      this.HRItem.glucosa = item.glucosa,
      this.HRItem.urea = item.urea,
      this.HRItem.cr = item.cr,
      this.HRItem.acUrico = item.acUrico,
      this.HRItem.ca = item.ca,
      this.HRItem.p = item.p,
      this.HRItem.fosfAlcalin = item.fosfAlcalin,
      this.HRItem.pth = item.pth,
      this.HRItem.colest = item.colest,
      this.HRItem.tgc = item.tgc,
      this.HRItem.protTotales = item.protTotales,
      this.HRItem.albunin = item.albunin,
      this.HRItem.ast = item.ast,
      this.HRItem.alt = item.alt,
      this.HRItem.bi = item.bi,
      this.HRItem.bd = item.bd,
      this.HRItem.na = item.na,
      this.HRItem.k = item.k,
      this.HRItem.tp = item.tp,
      this.HRItem.tpp = item.tpp
      this.hemoRecordDialog = true
      
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
          await this.deleteRecord(item._id) 
          await this.retrieveAdminRecords({
            ...buildPayloadPagination(this.pagination, this.buildSearch()),
            patient_id: this.item.patient_id
          })
          console.log('building')
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
