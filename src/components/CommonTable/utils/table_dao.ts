import BaseDao from './base_dao'

export class TableDao extends BaseDao {
  constructor() {
    super('/manager/agent')
  }
  public defaultTableData: Object = {
    name: ''
  }
  public tableColumn = [
  ]
}
