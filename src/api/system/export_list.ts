import BaseDao from '@/components/CommonTable/utils/base_dao'
import { TableColumn } from '@/components/CommonTable/utils/types'
import { getDictEnum } from '@/components/CommonTable/utils'

export class TableDao extends BaseDao {
  constructor() {
    super('/covid19/record/export')
  }
  public actionWidth = '100px'
  public defaultTableData: Object = {}
  public deleteButton = false
  public editButton = false
  public addButton = false
  public tableColumn:TableColumn[] = [
    { name: '文件名',
      value: 'file_name',
      type: 'str'
    },
    { name: '状态',
      value: 'state',
      type: 'str',
      width: 200
    },
    { name: '进度',
      value: 'progress',
      columnDefine: true,
      type: 'str'
    },
    { name: '条数',
      value: 'count',
      type: 'str'
    },
    { name: '导出人',
      value: 'user',
      columnDict: 'user.name',
      type: 'str'
    },
    { name: '导出时间',
      value: 'create_time',
      type: 'str'
    }
  ]
}
