import BaseDao from '@/components/CommonTable/utils/base_dao'
import { TableColumn } from '@/components/CommonTable/utils/types'
import request from '@/utils/request'

export class TableDao extends BaseDao {
  constructor() {
    super('/system/login_log')
  }
  public actionWidth = '150px'
  public exportButton = true
  public addButton = false
  public editButton = false
  public actionBar = false
  public deleteButton = false
  public searchBar = true
  public defaultTableData: Object = {}
  public dateRange = true
  public tableColumn:TableColumn[] = [
    { name: '公司',
      value: 'custom',
      type: 'str',
      width: 130
    },
    { name: '用户名',
      value: 'user',
      type: 'str',
      width: 230
    },
    { name: '操作IP',
      value: 'ip',
      type: 'ip',
      width: 130
    },
    { name: '登陆时间',
      value: 'create_time',
      type: 'str',
      width: 180
    }
  ]
}
