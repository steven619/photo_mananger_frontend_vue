import BaseDao from '@/components/CommonTable/utils/base_dao'
import { PaginationType, TableColumn } from '@/components/CommonTable/utils/types'
import request from '@/utils/request'

export class TableDao extends BaseDao {
  constructor() {
    super('/system/role')
  }
  public actionWidth = '150px'
  public index = false
  public defaultTableData: Object = {}
  public tableDefine = true
  public tableColumn:TableColumn[] = [
    { name: 'ID',
      value: 'id',
      type: 'slot',
      width: 130
    },
    { name: '名称',
      value: 'name',
      type: 'str',
      required: true,
      width: 130
    },
    { name: '父级',
      value: 'parent',
      type: 'remoteselect',
      width: 130,
      ownSchema: {
        'ui': {
          widgetConfig: {
            'filterable': true,
            'itemLabelField': 'name',
            'itemValueField': 'id',
            'filterLocal': false,
            'enumSourceRemote': {
              'remoteUrl': 'api/v1/system/role',
              'paramName': 'keywords',
              'otherParams': {},
              'resField': 'data'
            }
          }
        }
      }
    },
    { name: '该角色管理员',
      value: 'admins',
      type: 'remoteselect',
      width: 130,
      ownSchema: {
        'ui': {
          widgetConfig: {
            'filterable': true,
            'multiple': true,
            'itemLabelField': 'name',
            'itemValueField': 'id',
            'filterLocal': false,
            'enumSourceRemote': {
              'remoteUrl': 'api/v1/system/admin_user',
              'paramName': 'keywords',
              'otherParams': {},
              'resField': 'data'
            }
          }
        }
      }
    },
    { name: '描述',
      value: 'description',
      type: 'str',
      width: 110
    },
    { name: '权限管理',
      value: 'pri',
      columnDefine: true,
      type: 'slot',
      width: 200
    }
  ]
  public getMenu() {
    return request({
      url: '/system/menu',
      method: 'get'
    })
  }
  public getRoleMenu(id:string) {
    return request({
      url: `/system/role/${id}`,
      method: 'get'
    })
  }
  public putRoleMenu(id:string|number, data:object) {
    return request({
      url: `/system/role/${id}`,
      method: 'put',
      data
    })
  }
  public putMenu(id:string, data:Object) {
    return request({
      url: `/system/menu/${id}`,
      method: 'put',
      data
    })
  }

  public syncMenu(data:Object) {
    return request({
      url: '/system/menu',
      method: 'post',
      data
    })
  }
  public fetchList(pagination?:PaginationType, query?:Object) {
    const q:PaginationType | undefined = pagination
    if (q) { Object.assign(q, query) }
    return request({
      url: '/system/role_tree',
      method: 'get',
      params: q
    })
  }
}
