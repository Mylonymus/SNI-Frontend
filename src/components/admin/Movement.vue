<template>
  <v-dialog
    :value="value"
    @input="$emit('input')"
    max-width="900px"
    content-class="dlgNewEditItem"
  >
    <v-card>
      <v-card-title class="text-xs-center">
        <HeadingSection :title="title" icon="attach_money" />
      </v-card-title>
      <v-card-text>
        <v-container grid-list-md>
          <v-layout wrap>
            <v-flex xs12 md6>
              <v-text-field
                id="amount"
                name="amount"
                v-model="editedItem.amount"
                :label="$t('movement.AMOUNT')"
                :data-vv-as="$t('movement.AMOUNT')"
                :error="errors.has('amount')"
                :error-messages="errors.collect('amount')"
                v-validate="{ required: true, decimal: [2, '.'] }"
                autocomplete="off"
              ></v-text-field>
            </v-flex>
            <v-flex xs12 md6>
              <v-select
                :items="txTypes"
                v-model="editedItem.tx_type"
                name="tx_type"
                :label="$t('movement.TX_TYPE')"
                :data-vv-as="$t('movement.TX_TYPE')"
              ></v-select>
            </v-flex>
            <v-flex xs12 md6>
              <v-select
                :items="currencies"
                v-model="editedItem.currency"
                name="tx_type"
                :label="$t('movement.CURRENCY')"
                :data-vv-as="$t('movement.CURRENCY')"
              ></v-select>
            </v-flex>
            <v-flex xs12 md6>
              <v-menu
                ref="menu"
                v-model="menu"
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
                    v-model="editedItem.date"
                    :label="$t('movement.DATE')"
                    :data-vv-as="$t('movement.DATE')"
                    :error="errors.has('date')"
                    :error-messages="errors.collect('date')"
                    v-validate.disable="'required:date'"
                    autocomplete="off"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="editedItem.date" no-title scrollable>
                  <v-spacer></v-spacer>
                  <v-btn flat color="primary" @click="menu = false"
                    >Cancel</v-btn
                  >
                  <v-btn
                    flat
                    color="primary"
                    @click="$refs.menu.save(editedItem.date)"
                    >OK</v-btn
                  >
                </v-date-picker>
              </v-menu>
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
import { getFormat } from '@/utils/utils.js'
import { mapActions } from 'vuex'
import HeadingSection from '@/components/common/HeadingSection.vue'

const toyyyymmdd = str => {
  const val = new Date(str)
  const yyyy = val.getFullYear().toString()
  const mm = (val.getMonth() + 1).toString() // getMonth() is zero-based
  const dd = val.getDate().toString()

  return (
    yyyy + '-' + (mm[1] ? mm : '0' + mm[0]) + '-' + (dd[1] ? dd : '0' + dd[0])
  )
}

export default {
  components: {
    HeadingSection
  },
  data: () => ({
    txTypes: ['Input', 'Output', 'Gains', 'Losses'],
    currencies: [
      {
        text: 'Peso ($MXN)',
        value: '$MXN'
      }
    ],
    defaultItem: {},
    editedItem: {},
    menu: false
  }),
  props: ['value', 'item', 'save'],
  watch: {
    async item(newValue) {
      this.editedItem = newValue && Object.keys(newValue) ? newValue : {}
      if (this.editedItem.date) {
        this.editedItem.date = toyyyymmdd(this.editedItem.date)
      }
    }
  },
  computed: {
    title() {
      return this.editedItem.id
        ? this.$t('admin.EDIT_MOVEMENT')
        : this.$t('admin.NEW_MOVEMENT')
    }
  },
  methods: {
    ...mapActions(['editMovement', 'saveMovement']),
    close() {
      this.editedItem = {}
      this.$emit('input')
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
      }, 300)
    },
    async saveItem() {
      try {
        const valid = await this.$validator.validateAll()
        if (valid) {
          this.editedItem.amount = this.editedItem.amount.replace(',', '.')
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
