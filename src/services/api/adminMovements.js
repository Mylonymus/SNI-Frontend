import axios from 'axios'

export default {
  getMovements(params) {
    return axios.get('/movements', {
      params: params
    })
  },
  editMovement(id, payload) {
    return axios.patch(`/movements/${id}`, payload)
  },
  saveMovement(payload) {
    return axios.post('/movements/', payload)
  },
  deleteMovement(id) {
    return axios.delete(`/movements/${id}`)
  }
}
