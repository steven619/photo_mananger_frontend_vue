import BaseDao from '@/components/CommonTable/utils/base_dao'
import { TableColumn } from '@/components/CommonTable/utils/types'
import { getToken } from '@/utils/auth'
import request from '@/utils/request'
export class TableDao extends BaseDao {
  constructor() {
    super('/user/dashboard')
  }

}
