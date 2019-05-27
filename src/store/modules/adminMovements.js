import * as types from '@/store/mutation-types'
import api from '@/services/api/adminMovements'
import { buildSuccess, handleError } from '@/utils/utils.js'

const state = {
  movements: [],
  totalMovements: 0
}

const getters = {
  getAdminMovements: state => state.movements,
  getTotalAdminMovements: state => state.totalMovements
}

const actions = {
  clearAdminMovements({ commit }) {
    commit(types.ADMIN_MOVEMENTS, [])
    commit(types.ADMIN_TOTAL_MOVEMENTS, 0)
  },
  retrieveAdminMovements({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api
        .getMovements(payload)
        .then(response => {
          if (response.status === 200) {
            commit(types.ADMIN_MOVEMENTS, response.data.docs)
            commit(types.ADMIN_TOTAL_MOVEMENTS, response.data.totalDocs)
            resolve()
          }
        })
        .catch(error => {
          handleError(error, commit, reject)
        })
    })
  },
  editMovement({ commit }, payload) {
    return new Promise((resolve, reject) => {
      const data = {
        amount: payload.amount,
        tx_type: payload.tx_type,
        date: payload.date,
        currency: payload.currency
      }
      api
        .editMovement(payload._id, data)
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
  saveMovement({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api
        .saveMovement(payload)
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
  deleteMovement({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api
        .deleteMovement(payload)
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
  [types.ADMIN_MOVEMENTS](state, movements) {
    state.movements = movements
  },
  [types.ADMIN_TOTAL_MOVEMENTS](state, value) {
    state.totalMovements = value
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
