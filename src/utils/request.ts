import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import { UserModule } from '@/store/modules/user'
import store from '../store'
import { getToken, goHome } from '@/utils/auth.ts'

declare module 'axios' {
  export interface AxiosResponse<T = any> extends Promise<T> {}
}

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  timeout: 50000
  // withCredentials: true // send cookies when cross-domain requests
})

// Request interceptors
service.interceptors.request.use(
  (config) => {
    // Add X-Access-Token header to every request, you can add other custom headers here
    if (UserModule.token) {
      config.headers['JWT'] = getToken()
    }
    return config
  },
  (error) => {
    Promise.reject(error)
  }
)

// Response interceptors
service.interceptors.response.use(
  (response) => {
    if (response.headers['content-type'] === 'application/ms-excel') { return (response) }
    const res = response.data
    if (res.code === 401) {
      localStorage.clear()
      goHome()
    }
    if (res.code >= 300) {
      Message({
        message: res.message,
        type: 'error',
        duration: 5 * 1000
      })
      // eslint-disable-next-line prefer-promise-reject-errors
      return Promise.reject('error')
    } else {
      return response.data
    }
  },
  (error) => {
    var message = error.message
    var code = 0
    if (error.response) {
      code = error.response.status
    }
    switch (code) {
      case 409:
        message = '当前型号启用数量超出授权数量,授权数量为' + error.response.data.count
        break
      case 401:
        message = '您没有权限访问'
        break
      case 400:
        message = '参数错误'
        break
      case 410:
        message = '密码错误'
        break
      case 497:
        message = ''
        break
      default:
        message = `网络错误,请检查网络.`
        return Promise.reject(error)
    }
    Message({
      message: message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
