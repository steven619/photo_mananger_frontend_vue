import BaseDao from '@/components/CommonTable/utils/base_dao'
import { TableColumn } from '@/components/CommonTable/utils/types'
import { getDictEnum } from '@/components/CommonTable/utils'

export class TableDao extends BaseDao {
  constructor() {
    super('/system/debug/client')
  }
  public actionWidth = '100px'
  public defaultTableData: Object = {}
  public deleteButton = false
  public editButton = false
  public actionBar = false
  public addButton = false

  // public searchBar=false
  // public mobileSearchBar=false

  public tableColumn:TableColumn[] = [
    { name: 'IP地址',
      value: 'ip',
      type: 'str',
      required: true,
      width: 120
    },
    { name: '地址',
      value: 'location',
      type: 'str',
      required: true,
      width: 300
    },
    { name: 'Seed',
      value: 'seed',
      type: 'str',
      required: true,
      width: 600
    }
  ]
}
