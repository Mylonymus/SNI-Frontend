import * as types from '@/store/mutation-types'
import api from '@/services/api/adminRecords'
import { buildSuccess, handleError } from '@/utils/utils.js'

const state = {
  adminRecords: [],
  totalAdminRecords: 0
}

const getters = {
  getAdminRecords: state => state.adminRecords,
  getTotalAdminRecords: state => state.totalAdminRecords
}

const actions = {
  clearAdminRecords({ commit }) {
    commit(types.ADMIN_RECORDS, [])
    commit(types.ADMIN_TOTAL_RECORDS, 0)
  },
  retrieveAdminRecords({ commit }, payload) { 
    return new Promise((resolve, reject) => {
      api
        .getRecords(payload)
        .then(response => {  
          if (response.status === 200) {
            console.log('Detalles Paciente: '+ response.data.docs)
            commit(types.ADMIN_RECORDS, response.data.docs)
            commit(types.ADMIN_TOTAL_RECORDS, response.data.totalDocs)  
            resolve()
          }
        })
        .catch(error => {
          handleError(error, commit, reject)
        })
    })
  },
  editRecord({ commit }, payload) {
    return new Promise((resolve, reject) => { 
      
      api
        .editRecord(payload._id, payload)
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
  [types.ADMIN_RECORDS](state, records) {
    state.adminRecords = records
  },
  [types.ADMIN_TOTAL_RECORDS](state, value) {
    state.totalAdminRecords = value
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
