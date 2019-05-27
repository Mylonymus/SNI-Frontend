import * as types from '@/store/mutation-types'
import api from '@/services/api/movements'
import { buildSuccess, handleError } from '@/utils/utils.js'

const state = {
  movements: [],
  totalMovements: 0
}

const getters = {
  movements: state => state.movements,
  totalMovements: state => state.totalMovements
}

const actions = {
  getMovements({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api
        .getMovements(payload)
        .then(response => {
          if (response.status === 200) {
            commit(types.MOVEMENTS, response.data.docs)
            commit(types.TOTAL_MOVEMENTS, response.data.totalDocs)
            resolve()
          }
        })
        .catch(error => {
          handleError(error, commit, reject)
        })
    })
  }
}

const mutations = {
  [types.MOVEMENTS](state, movements) {
    state.movements = movements
  },
  [types.TOTAL_MOVEMENTS](state, value) {
    state.totalMovements = value
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
