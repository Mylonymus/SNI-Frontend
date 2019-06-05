import * as types from '@/store/mutation-types'
import api from '@/services/api/patients'
import { buildSuccess, handleError } from '@/utils/utils.js'

const state = {
  patients: [],
  totalPatients: 0
}

const getters = {
  patients: state => state.patients,
  totalPatients: state => state.totalPatients
}

const actions = {
  getPatients({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api
        .getPatients(payload)
        .then(response => {
          if (response.status === 200) {
            commit(types.PATIENTS, response.data.docs)
            commit(types.TOTAL_PATIENTS, response.data.totalDocs)
            resolve()
          }
        })
        .catch(error => {
          handleError(error, commit, reject)
        })
    })
  },
  editPatient({ commit }, payload) {
    return new Promise((resolve, reject) => {
      const data = {
        name: payload.name,
        lastname: payload.lastname,
        dateBorn: payload.dateBorn,
        phone: payload.phone,
        city: payload.city,
        country: payload.country
      }
      api
        .editPatient(payload._id, data)
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
  savePatient({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api
        .savePatient(payload)
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
  deletePatient({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api
        .deletePatient(payload)
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
  [types.PATIENTS](state, patients) {
    state.patients = patients
  },
  [types.TOTAL_PATIENTS](state, value) {
    state.totalPatients = value
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
