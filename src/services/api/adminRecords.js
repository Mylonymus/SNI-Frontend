import axios from 'axios'
export default {

  //LANZAR ERRORES SIN NO SE LANZAN LAS LLAMADAS COJONES!!
  getRecords(params) {
    return axios.get(`/records/${params.patient_id}/all`, {
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
