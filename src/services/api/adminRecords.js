import axios from 'axios'

export default {
  getRecords(params) {
    return axios.get('/records', {
      params: params
    })
  },
  editRecord(id, payload) {
    return axios.patch(`/records/${id}`, payload)
  },
  saveRecord(payload) {
    return axios.post('/records/', payload)
  },
  deleteRecord(id) {
    return axios.delete(`/records/${id}`)
  }
}
