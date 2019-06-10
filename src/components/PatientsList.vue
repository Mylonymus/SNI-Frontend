<template>
  <div class="bg-site">
    <v-layout wrap>
      <v-flex xs12 sm12 md4 mt-3 pl-4>
        <HeadingSection :title="$t('PATIENTS_LIST.TITLE')" icon="people" />
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
            editedPatient = {}
            dialog = true
          "
          class="btnNewItem pr-4"
        >
          <v-icon class="mr-2">add</v-icon>
          {{ $t('PATIENTS_LIST.dataTable.NEW_ITEM') }}
        </v-btn>
        <PatientForm v-model="dialog" :save="save" :item="editedPatient" />
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
        <template v-slot:items="props" >
          <tr @click="viewDetallesPaciente(props.item)">
          
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
                    @click="deletePatient(props.item)"
                  >
                    <v-icon>delete</v-icon>
                  </v-btn>
                  <span>{{ $t('dataTable.DELETE') }}</span>
                </v-tooltip>
              </v-layout>
            </td>
            <td>{{ props.item.name }}</td>
            <td>{{ props.item.lastname }}</td>
            <td>{{ getFormat(props.item.dateBorn) }}</td>
            <td>{{ props.item.city }}</td>
            <td>{{ props.item.country }}</td>
            <td>{{ props.item.phone }}</td>
            <td>{{ getFormat(props.item.createdAt) }}</td>
            <td>{{ getFormat(props.item.updatedAt) }}</td>
          </tr>
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
    <HemoForm
      v-model="hemo_dialog"
      :save="savePatient"
      :item="editedHemoPatient"
      :user="hemoPatient"
    />
  </div>
</template>

<script>
import PatientForm from '@/components/admin/editPatient'
import HemoForm from '@/components/admin/DetallesPaciente'
import { mapActions } from 'vuex'
import { getFormat, buildPayloadPagination } from '@/utils/utils.js'
import HeadingSection from '@/components/common/HeadingSection.vue'
import axios from 'axios'
export default {
  components: {
    PatientForm,
    HemoForm,
    HeadingSection
  },
  metaInfo() {
    return {
      title: this.$store.getters.appTitle,
      titleTemplate: this.$t('PATIENTS_LIST.TITLE') + ' - %s'
    }
  },
  data() {
    return {
      searchInput: '',
      dataTableLoading: true,
      delayTimer: null,
      dialog: false,
      search: '',
      hemo_dialog: false,
      pagination: {},
      editedPatient: {},
      editedHemoPatient: {},
      hemoPatient: {},
      defaultItem: {},
      fieldsToSearch: ['name', 'lastname', 'city', 'country', 'phone']
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
          text: 'Nombre',
          align: 'left',
          sortable: true,
          value: 'name'
        },
        {
          text: 'Apellidos',
          align: 'left',
          sortable: true,
          value: 'lastname'
        }, 
        {
          text: 'Fecha Nacimiento',
          align: 'left',
          sortable: true,
          value: 'dateBorn'
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
      return this.$store.state.patients.patients
    },
    totalItems() {
      return this.$store.state.patients.totalPatients
    }
  },
  watch: {
    pagination: {
      async handler() {
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
      'getPatients',
      'editPatient',
      'savePatient',
      'deletePatient'
    ]),
    getFormat(date) {
      window.__localeId__ = this.$store.getters.locale
      return getFormat(date, 'ddd, MMMM D YYYY, h:mm a')
    }, 
    trueFalse(value) {
      return value
        ? '<i aria-hidden="true" class="v-icon material-icons green--text" style="font-size: 16px;">done</i>'
        : '<i aria-hidden="true" class="v-icon material-icons red--text" style="font-size: 16px;">clear</i>'
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
    editItem(item) { 
      this.editedPatient = Object.assign({}, item)
      this.dialog = true
    },
    async viewDetallesPaciente(user) {
      console.log(user) 
      const { data } = await axios.get('/detallesPaciente/patient_id/'+user._id)
      debugger;
      console.log(data) 
      this.hemoPatient = user 
      
      this.editedHemoPatient = data
      this.editedHemoPatient.patient_id = data.patient_id; 
      this.editedHemoPatient.name = this.hemoPatient.name;
      this.editedHemoPatient.lastname = this.hemoPatient.lastname;

      this.hemo_dialog = true
      
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
          await this.deletePatient(item._id)
          await this.getPatients(
            buildPayloadPagination(this.pagination, this.buildSearch())
          )
          this.dataTableLoading = false
        }
        // eslint-disable-next-line no-unused-vars
      } catch (error) {
        this.dataTableLoading = false
      }
    },
    async saveHemoSession() {},
    async save(item) {
      try {
        this.dataTableLoading = true
        // Updating item
        if (item._id) {
          await this.editPatient(item)
          await this.getPatients(
            buildPayloadPagination(this.pagination, this.buildSearch())
          )
          this.dataTableLoading = false
        } else {
          // Creating new item
          await this.savePatient({
            name: item.name,
            lastname: item.lastname,
            phone: item.phone,
            dateBorn: item.dateBorn,
            city: item.city,
            country: item.country,
            createdAt: Date.now(),
            updatedAt: Date.now()
          })
          await this.getPatients(
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
