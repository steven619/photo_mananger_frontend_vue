import BaseDao from '@/components/CommonTable/utils/base_dao'
import { TableColumn } from '@/components/CommonTable/utils/types'
import request from '@/utils/request'
import { getToken } from '@/utils/auth'

export class TableDao extends BaseDao {
  constructor() {
    super('/system/admin_user')
  }
  public actionWidth = '210px'
  public defaultTableData: Object = {}
  public tableColumn:TableColumn[] = [
    { name: '用户名',
      value: 'username',
      type: 'str',
      required: true,
      width: 130
    },
    { name: '姓名',
      value: 'name',
      type: 'str',
      required: true,
      width: 130
    },
    { name: '所属公司',
      value: 'custom',
      type: 'remoteselect',
      required: true,
      ownSchema: {
        'ui': {
          widgetConfig: {
            'filterable': true,
            'itemLabelField': 'name',
            'itemValueField': 'id',
            'filterLocal': false,
            'enumSourceRemote': {
              'remoteUrl': '/api/v1/manager/custom',
              'paramName': 'keywords',
              // 'otherParams': {},
              'resField': 'data'
            }
          }
        }
      },
      width: 250
    },
    { name: '电话号码',
      value: 'phone',
      type: 'str',
      width: 160
    },
    { name: '电子邮箱',
      value: 'email',
      type: 'str',
      hide: true,
      width: 200
    },
    { name: '角色',
      value: 'roles',
      columnDefine: true,
      type: 'remoteselect',
      required: true,
      width: 200,
      ownSchema: {
        'ui': {
          widgetConfig: {
            'multiple': true,
            'filterable': true,
            'itemLabelField': 'name',
            'itemValueField': 'id',
            'filterLocal': false,
            'enumSourceRemote': {
              'remoteUrl': '/api/v1/system/role',
              'paramName': 'keywords',
              'otherParams': {},
              'resField': 'data'
            }
          }
        }
      }
    },
    { name: '密码',
      value: 'password',
      type: 'str',
      hide: true
    }
  ]
}
