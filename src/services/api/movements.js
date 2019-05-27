import axios from 'axios'

export default {
  getMovements(params) {
    return axios.get('/movements/me/all', {
      params: params
    })
  }
}
