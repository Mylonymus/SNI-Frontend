import axios from 'axios'

export default {
  userLogin(payload) {
    debugger
    return axios.post('/login', payload)
  },
  refreshToken() {
    return axios.get('/token')
  }
}
