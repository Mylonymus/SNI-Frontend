import axios from 'axios'

export default {
  sendVerify(payload) {
    return axios.post('/verify', payload)
  },
  resendVerify() {
    return axios.post('/resend-verify', {})
  }
}
