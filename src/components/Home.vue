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
            <v-card-text>
              {{ $t('home.VERIFY_YOUR_ACCOUNT_DESCRIPTION') }}
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="primary"
                flat
                @click="resendVerify"
                class="btnSend"
                >{{ $t('home.RESEND_VERIFY') }}</v-btn
              >
              <v-btn
                color="primary"
                flat
                @click="showVerifyDialog = false"
                class="btnClose"
                >{{ $t('home.CLOSE') }}</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>
    </v-layout>
    <v-layout row wrap mx-auto pa-4 mt-5 mb-3>
      <v-flex xs6>
        <HeadingSection :title="$t('home.TITLE')" icon="home" />
        <h3>{{ $t('home.DESCRIPTION') }}</h3>
      </v-flex>
      <v-flex xs6 align-end>
        <v-card>
          <v-card-title
            ><v-icon color="primary" class="mr-2">person_add</v-icon>
            <span>Nª Pacientes Activos</span></v-card-title
          >
          <v-card-text>
            <strong class="headline">{{ balanceTotalRecibido }}</strong>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-flex xs12 mx-auto pa-4 mt-5>
        <HeadingSection
          :title="$t('home.CHART_SECTION')"
          icon="multiline_chart"
        />
        <v-card class="pa-4">
          <Chart :chartData="chartData" :currency="currency" />
        </v-card>
      </v-flex>
    </v-layout>
    <v-flex xs12 sm12 mx-auto pa-4 mt-5>
      <v-layout row wrap>
        <HeadingSection :title="$t('home.MOVEMENTS_SECTION')" icon="list_alt" />
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
        :items="movements"
        :pagination.sync="pagination"
        :total-items="totalMovements"
        class="elevation-1"
      >
        <template v-slot:items="props">
          <td>{{ props.item.tx_type }}</td>
          <td>
            {{
              parseFloat(props.item.amount).toLocaleString('es-MX') +
                ' ' +
                props.item.currency
            }}
          </td>
          <td>{{ toddmmyyyy(props.item.date) }}</td>
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
        percents: this.balancesRecibidos.map(value => value.percent),
        labels: this.balancesRecibidos.map(
          value =>
            this.$t('months')[value.month - 1] +
            " '" +
            value.year.toString().substr(2)
        ),
        datasets: [
          {
            label: this.$t('TITLE_LEGEND'),
            backgroundColor: '#007fa8',
            fill: false,
            data: this.balancesRecibidos.map(value => value.balance),
            percent: this.balancesRecibidos.map(value => value.percent)
          }
        ]
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
          text: this.$i18n.t('DAY_HEMOMEDICI.NAME'),
          align: 'left',
          sortable: true,
          value: 'tx_type'
        },
        {
          text: this.$i18n.t('DAY_HEMOMEDICI.HEMOPERWEEK'),
          align: 'left',
          sortable: true,
          value: 'amount'
        },
        {
          text: this.$i18n.t('DAY_HEMOMEDICI.EPO_DOSIS'),
          align: 'left',
          sortable: true,
          value: 'date'
        },
        {
          text: this.$i18n.t('DAY_HEMOMEDICI.EPOPERWEEK'),
          align: 'left',
          sortable: true,
          value: 'date'
        },
        {
          text: this.$i18n.t('DAY_HEMOMEDICI.TOTALPERWEEK'),
          align: 'left',
          sortable: true,
          value: 'date'
        },
        {
          text: this.$i18n.t('DAY_HEMOMEDICI.HIERRO'),
          align: 'left',
          sortable: true,
          value: 'date'
        }
      ]
    },
    movements() {
      return this.$store.state.movements.movements
    },
    totalMovements() {
      return this.$store.state.movements.totalMovements
    }
  },
  watch: {
    pagination: {
      async handler() {
        try {
          this.dataTableLoading = true
          await this.getMovements(
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
      fieldsToSearch: ['tx_type']
    }
  },
  methods: {
    ...mapActions(['resendVerify', 'getMovements']),

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

    async doSearch() {
      try {
        this.dataTableLoading = true
        await this.getMovements(
          buildPayloadPagination(this.pagination, this.buildSearch())
        )
        this.dataTableLoading = false
        // eslint-disable-next-line no-unused-vars
      } catch (error) {
        console.log(error)
        this.dataTableLoading = false
      }
    },
    buildSearch() {
      return this.search
        ? { query: this.search, fields: this.fieldsToSearch.join(',') }
        : {}
    }
  },
  async mounted() {
    this.loaded = false
    try {
      const balances = await axios.get('/movements/me/monthly-balance')
      const balanceTotal = await axios.get('/movements/me/current-balance')

      let balanceNum = parseFloat(balanceTotal.data.balance)
      this.balanceTotalRecibido =
        balanceNum.toLocaleString('es-MX') + ' ' + balanceTotal.data.currency

      this.balancesRecibidos = balances.data
      this.loaded = true
    } catch (e) {
      console.error(e)
    }
  }
}
</script>
