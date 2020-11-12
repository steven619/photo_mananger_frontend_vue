import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators'
import { login, logout, getUserInfo, getAllDict } from '@/api/users'
import { getToken, setToken, removeToken, setAllDict, goHome } from '@/utils/auth'
import router, { resetRouter } from '@/router'
import { PermissionModule } from './permission'
import { TagsViewModule } from './tags-view'
import store from '@/store'

export interface RoleMenuState {action:number, menu:string}

export interface IUserState {
  token: string
  name: string
  username: string
  avatar: string
  introduction: string
  roles: string[]
  roleMenu: RoleMenuState[]
  email: string,
  custom: object
}

@Module({ dynamic: true, store, name: 'user' })
class User extends VuexModule implements IUserState {
  public token = getToken() || ''
  public name = ''
  public username = ''
  public avatar = ''
  public introduction = ''
  public roles: string[] = []
  public roleMenu: RoleMenuState[] = []
  public email = ''
  public custom = {}

  @Mutation
  private SET_TOKEN(token: string) {
    this.token = token
  }

  @Mutation
  private SET_USERNAME(username: string) {
    this.username = username
  }

  @Mutation
  private SET_ROLEMENU(roleMenu: RoleMenuState[]) {
    this.roleMenu = roleMenu
  }

  @Mutation
  private SET_NAME(name: string) {
    this.name = name
  }

  @Mutation
  private SET_CUSTOM(custom: object) {
    this.custom = custom
  }

  @Mutation
  private SET_AVATAR(avatar: string) {
    this.avatar = avatar
  }

  @Mutation
  private SET_INTRODUCTION(introduction: string) {
    this.introduction = introduction
  }

  @Mutation
  private SET_ROLES(roles: string[]) {
    this.roles = roles
  }

  @Mutation
  private SET_EMAIL(email: string) {
    this.email = email
  }

  @Action
  public Login(userInfo: { username: string, password: string, captcha:string, 'c_id':string}) {
    // eslint-disable-next-line camelcase
    let { username, password, captcha, c_id } = userInfo
    username = username.trim()
    login({ username, password, c_id, captcha }).then(res => {
      setToken(res.data.token)
      goHome()
      // getAllDict().then((ad) => {
      //   setAllDict('SYSTEM_DICTIONARY', ad.data)
      //   goHome()
      // })
    })
  }

  @Action
  public ResetToken() {
    removeToken()
    this.SET_TOKEN('')
    this.SET_ROLES([])
  }

  @Action
  public async GetUserInfo() {
    if (this.token === '') {
      throw Error('GetUserInfo: token is undefined!')
    }
    const { data } = await getUserInfo({ /* Your params here */ })
    // if (!data) {
    //   throw Error('Verification failed, please Login again.')
    // }
    // eslint-disable-next-line camelcase
    const { roles, name, username, avatar, email, custom, role_menu } = data
    // // roles must be a non-empty array
    if (!roles || roles.length <= 0) {
      throw Error('GetUserInfo: roles must be a non-null array!')
    }
    this.SET_ROLES(roles)
    this.SET_CUSTOM(custom)
    this.SET_NAME(name)
    this.SET_USERNAME(username)
    this.SET_ROLEMENU(role_menu)
    this.SET_AVATAR(avatar)
    this.SET_EMAIL(email)
  }

  @Action
  public async ChangeRoles(role: string) {
    // Dynamically modify permissions
    const token = role + '-token'
    this.SET_TOKEN(token)
    setToken(token)
    await this.GetUserInfo()
    resetRouter()
    // Generate dynamic accessible routes based on roles
    PermissionModule.GenerateRoutes(this.roles)
    // Add generated routes
    router.addRoutes(PermissionModule.dynamicRoutes)
    // Reset visited views and cached views
    TagsViewModule.delAllViews()
  }

  @Action
  public async LogOut() {
    if (this.token === '') {
      throw Error('LogOut: token is undefined!')
    }
    await logout()
    removeToken()
    resetRouter()
    this.SET_TOKEN('')
    this.SET_ROLES([])
  }
}

export const UserModule = getModule(User)
