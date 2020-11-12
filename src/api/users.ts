import request from '@/utils/request'
import { getToken, removeToken } from '@/utils/auth'

export const getUsers = (params: any) =>
  request({
    url: '/users',
    method: 'get',
    params
  })

export const getUserInfo = (data?: any) =>
  request({
    url: '/user/info',
    method: 'get',
    data
  })

export const getAllDict = () => {
  return request({
    url: '/tools/dictionary',
    headers: {
      'JWT': getToken()
    },
    method: 'get'
  })
}

export const getUserByName = (username: string) =>
  request({
    url: `/users/${username}`,
    method: 'get'
  })

export const updateUser = (username: string, data: any) =>
  request({
    url: `/users/${username}`,
    method: 'put',
    data
  })

export const deleteUser = (username: string) =>
  request({
    url: `/users/${username}`,
    method: 'delete'
  })

export const login = (data: any) =>
  request({
    url: '/user/login',
    method: 'post',
    data
  })

export const register = (data: any) =>
  request({
    url: '/user/register',
    method: 'post',
    data
  })

export function getInfo(token:String) {
  return request({
    url: '/user/info',
    method: 'get'
  })
}

export function updateUserInfo(data:Array<Object>) {
  return request({
    url: `/user/info`,
    method: 'put',
    data
  })
}
export function getCustomInfo() {
  return request({
    url: `/user/custom_info`,
    method: 'get'
  })
}

export function updateCustomInfo(data:Array<Object>) {
  return request({
    url: `/user/custom_info`,
    method: 'put',
    data
  })
}
export function logout() {
  removeToken()
  return request({
    url: '/user/logout',
    method: 'delete'
  })
}
