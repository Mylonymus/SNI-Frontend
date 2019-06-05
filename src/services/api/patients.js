import axios from 'axios'

export default {
  getPatients(params) {
    return axios.get('/patients', {
      params: params
    })
  },
  editPatient(id, payload) {
    return axios.patch(`/patients/${id}`, payload)
  },
  savePatient(payload) {
    return axios.post('/patients/', payload)
  },
  deletePatient(id) {
    return axios.delete(`/patients/${id}`)
  }
}
