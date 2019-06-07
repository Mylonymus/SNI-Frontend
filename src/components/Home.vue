<template>
  <v-container fluid class="bg-site">
    <v-layout row wrap>
      <div class="text-xs-center">
        <v-dialog v-model="showVerifyDialog" width="500" persistent>
          <v-card>
            <v-card-title
              class="headline grey lighten-2 black--text dlgVerifyAccount"
              primary-title
            >
              <v-icon class="orange--text">warning</v-icon>
              &nbsp;{{ $t('home.VERIFY_YOUR_ACCOUNT') }}
            </v-card-title>
            <v-card-text>{{ $t('home.VERIFY_YOUR_ACCOUNT_DESCRIPTION') }}</v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="primary"
                flat
                @click="resendVerify"
                class="btnSend"
              >{{ $t('home.RESEND_VERIFY') }}</v-btn>
              <v-btn
                color="primary"
                flat
                @click="showVerifyDialog = false"
                class="btnClose"
              >{{ $t('home.CLOSE') }}</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>
    </v-layout>
    <v-layout row wrap mx-auto pa-4 mt-5 mb-3>
      <v-flex xs6>
        <HeadingSection :title="$t('home.TITLE')" icon="home"/>
        <h3>{{ $t('home.DESCRIPTION') }}</h3>
      </v-flex>
      <v-flex xs6 align-end>
        <v-card>
          <v-card-title>
            <v-icon color="primary" class="mr-2">person_add</v-icon>
            <span>Nª Pacientes Activos</span>
          </v-card-title>
          <v-card-text>
            <strong class="headline">{{ totalPatients }}</strong>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-flex xs12 mx-auto pa-4 mt-5>
        <HeadingSection :title="$t('home.CHART_SECTION')" icon="multiline_chart"/>
        <v-card class="pa-4">
          <Chart :chartData="chartData" :currency="currency"/>
        </v-card>
      </v-flex>
    </v-layout>
    <v-flex xs12 sm12 mx-auto pa-4 mt-5>
      <v-layout row wrap>
        <HeadingSection :title="$t('home.MOVEMENTS_SECTION')" icon="list_alt"/>
        <v-flex xs12 sm6 md4 py-2>
          <v-text-field
            v-model="search"
            append-icon="search"
            :label="$t('dataTable.SEARCH')"
            single-line
            hide-details
            clearable
          ></v-text-field>
        </v-flex>
      </v-layout>

      <v-data-table
        must-sort
        :loading="dataTableLoading"
        :rows-per-page-text="$t('dataTable.ROWS_PER_PAGE')"
        :no-data-text="$t('dataTable.NO_DATA')"
        :no-results-text="$t('dataTable.NO_RESULTS')"
        :rows-per-page-items="[5, 10, 25]"
        :headers="headers"
        :items="patients"
        :pagination.sync="pagination"
        :total-items="totalPatients"
        class="elevation-1"
      >
        <template v-slot:items="props">
          
          <td>{{ props.item.name }}</td>
          <td>{{ props.item.lastname }}</td>
          <td>{{ getFormat(props.item.dateBorn) }}</td>
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
    <ErrorMessage/>
    <SuccessMessage/>
  </v-container>
</template>

<script>
import { mapActions } from 'vuex'
import Chart from '@/components/common/Chart.vue'
import axios from 'axios'
import { getFormat, buildPayloadPagination } from '@/utils/utils.js'
import HeadingSection from '@/components/common/HeadingSection.vue'

export default {
  components: {
    Chart,
    HeadingSection
  },
  metaInfo() {
    return {
      title: this.$store.getters.appTitle,
      titleTemplate: this.$t('home.TITLE') + ' - %s'
    }
  },
  computed: {
    chartData() {
      return {
        // percents: this.balancesRecibidos.map(value => value.percent),
        // labels: this.balancesRecibidos.map(
        //   value =>
        //     this.$t('months')[value.month - 1] +
        //     " '" +
        //     value.year.toString().substr(2)
        // ),
        // datasets: [
        //   {
        //     label: this.$t('TITLE_LEGEND'),
        //     backgroundColor: '#007fa8',
        //     fill: false,
        //     data: this.balancesRecibidos.map(value => value.balance),
        //     percent: this.balancesRecibidos.map(value => value.percent)
        //   }
        // ]
      }
    },
    currency() {
      return this.balancesRecibidos.length
        ? this.balancesRecibidos[0].currency
        : 'MXN'
    },
    headers() {
      return [
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
    patients() {
      return this.$store.state.patients.patients
    },
    totalPatients() {
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
          console.log(error)
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
  data() {
    return {
      loaded: false,
      balancesRecibidos: [],
      balanceTotalRecibido: '',
      currencyRecibida: '',
      showVerifyDialog: !this.$store.state.verify.emailVerified,
      searchInput: '',
      dataTableLoading: true,
      delayTimer: null,
      dialog: false,
      search: '',
      pagination: {},
      defaultItem: {},
      fieldsToSearch: ['name', 'lastname', 'city', 'country', 'phone']
    }
  },
  methods: {
    ...mapActions(['resendVerify', 'getPatients']),

    toddmmyyyy(str) {
      const val = new Date(str)
      const yyyy = val.getFullYear().toString()
      const mm = (val.getMonth() + 1).toString() // getMonth() is zero-based
      const dd = val.getDate().toString()

      return (
        (dd[1] ? dd : '0' + dd[0]) +
        '-' +
        (mm[1] ? mm : '0' + mm[0]) +
        '-' +
        yyyy
      )
    },

    getFormat(date) {
      window.__localeId__ = this.$store.getters.locale
      return getFormat(date, 'MM/DD/YYYY')
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
      const { data } = await axios.get(
        '/detallesPaciente/patient_id/' + user._id
      )
      console.log(data)
      this.editedHemoPatient = data
      this.hemoPatient = user
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
  async mounted() {
    this.loaded = false
    try {

      this.loaded = true
    } catch (e) {
      console.error(e)
    }
  }
}
</script>
