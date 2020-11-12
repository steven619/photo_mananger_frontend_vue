export interface PaginationType {
  page:Number,
  start:Number,
  limit:Number,
  count?:Number
}

export interface ApiResponse {
  'code': Number,
  'message': string,
  'count': Number,
  'start': Number,
  'limit': Number,
  'next': string,
  'previous': string,
  'data': Array<Object>,
  'extra_data': any
}

export interface TableColumn {
  name: String,
  value: string,
  type: string,
  required?: Boolean,
  width?: Number,
  hide?: Boolean,
  columns?: number,
  columnDefine?: boolean,
  columnDict?: string,
  enumName?: string,
  enumData?: Array<Object>
  ownSchema?: Object,
  help?:String,
  disabled?:Boolean
}
