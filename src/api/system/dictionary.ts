import request from '@/utils/request'
import { getToken } from '@/utils/auth'

export const getAllDict = () => {
  return request({
    url: '/tools/dictionary',
    headers: {
      'JWT': getToken()
    },
    method: 'get'
  })
}
