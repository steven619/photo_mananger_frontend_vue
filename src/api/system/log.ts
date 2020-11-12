import BaseDao from '@/components/CommonTable/utils/base_dao'
import { TableColumn } from '@/components/CommonTable/utils/types'
import request from '@/utils/request'

export class TableDao extends BaseDao {
  constructor() {
    super('/system/log')
  }
  public actionWidth = '150px'
  public exportButton = false
  public addButton = false
  public editButton = false
  public deleteButton = false
  public searchBar = true
  public dateRange = true
  public defaultTableData: Object = {}
  public tableColumn:TableColumn[] = [
    { name: '操作动作',
      value: 'action',
      type: 'str',
      width: 130
    },
    { name: '日志ID',
      value: 'id',
      type: 'str',
      width: 230
    },
    { name: '操作IP',
      value: 'ip',
      type: 'ip',
      width: 130
    },
    { name: '操作表所属',
      value: 'table',
      type: 'str',
      width: 230
    },
    { name: '操作源用户',
      value: 'user',
      type: 'str',
      width: 150
    },
    { name: '时间',
      value: 'create_time',
      type: 'str',
      width: 180
    }
  ]
}
