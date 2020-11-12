import { homeUrl } from '@/settings'
import Cookies from 'js-cookie'

const TokenKey = 'token'

export function getToken() {
  return window.localStorage.getItem(TokenKey)
}

export function setToken(token: string) {
  Cookies.set(TokenKey, token)
  return window.localStorage.setItem(TokenKey, token)
}

export function goHome() {
  window.location.href = window.location.origin + window.location.pathname
}

export function removeToken() {
  Cookies.remove(TokenKey)
  return window.localStorage.removeItem(TokenKey)
}

export function setAllDict(key = 'SYSTEM_DICTIONARY', dict:any) {
  return window.localStorage.setItem(key, JSON.stringify(dict))
}
