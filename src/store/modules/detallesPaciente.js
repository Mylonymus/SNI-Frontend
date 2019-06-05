import * as types from '@/store/mutation-types'
import api from '@/services/api/adminRecords'
import { buildSuccess, handleError } from '@/utils/utils.js'

const state = {
  movements: [],
  totalRecords: 0
}

const getters = {
  getDetallesPaciente: state => state.records,
  getTotalDetallesPaciente: state => state.totalRecords
}

const actions = {
  clearDetallesPaciente({ commit }) {
    commit(types.ADMIN_PATIENTS, [])
    commit(types.ADMIN_TOTAL_PATIENTS, 0)
  },
  retrieveDetallesPaciente({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api
        .getRecords(payload)
        .then(response => {
          if (response.status === 200) {
            commit(types.ADMIN_PATIENTS, response.data.docs)
            commit(types.ADMIN_TOTAL_PATIENTS, response.data.totalDocs)
            resolve()
          }
        })
        .catch(error => {
          handleError(error, commit, reject)
        })
    })
  },
  editDetallesPaciente({ commit }, payload) {
    return new Promise((resolve, reject) => {
      const data = {
        specialties: payload.specialties,
        weight: payload.weight,
        date: payload.date
      }
      api
        .editRecord(payload._id, data)
        .then(response => {
          if (response.status === 200) {
            buildSuccess(
              {
                msg: 'common.SAVED_SUCCESSFULLY'
              },
              commit,
              resolve
            )
          }
        })
        .catch(error => {
          handleError(error, commit, reject)
        })
    })
  },
  saveRecord({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api
        .saveRecord(payload)
        .then(response => {
          if (response.status === 201) {
            buildSuccess(
              {
                msg: 'common.SAVED_SUCCESSFULLY'
              },
              commit,
              resolve
            )
          }
        })
        .catch(error => {
          handleError(error, commit, reject)
        })
    })
  },
  deleteRecord({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api
        .deleteRecord(payload)
        .then(response => {
          if (response.status === 200) {
            buildSuccess(
              {
                msg: 'common.DELETED_SUCCESSFULLY'
              },
              commit,
              resolve
            )
          }
        })
        .catch(error => {
          handleError(error, commit, reject)
        })
    })
  }
}

const mutations = {
  [types.ADMIN_PATIENTS](state, records) {
    state.records = records
  },
  [types.ADMIN_TOTAL_PATIENTS](state, value) {
    state.totalRecords = value
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
