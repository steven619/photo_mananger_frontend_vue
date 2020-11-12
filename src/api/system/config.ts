import BaseDao from '@/components/CommonTable/utils/base_dao'
import { TableColumn } from '@/components/CommonTable/utils/types'
import { getDictEnum } from '@/components/CommonTable/utils'

export class TableDao extends BaseDao {
  constructor() {
    super('/system/config')
  }
  public actionWidth = '140px'
  public defaultTableData: Object = {}
  public deleteButton = false
  public tableColumn:TableColumn[] = [
    { name: '配置项',
      value: 'description',
      type: 'str',
      required: true,
      width: 200
    },
    { name: 'KEY',
      value: 'key',
      type: 'str',
      required: true,
      width: 200
    },
    { name: '值',
      value: 'value',
      required: true,
      type: 'string'
    },
    { name: '公开搜索',
      value: 'public',
      columnDefine: true,
      type: 'bool',
      width: 200
    }
  ]
}
