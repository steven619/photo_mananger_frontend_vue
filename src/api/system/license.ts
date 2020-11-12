import BaseDao from '@/components/CommonTable/utils/base_dao'
import { TableColumn } from '@/components/CommonTable/utils/types'
import { getDictEnum } from '@/components/CommonTable/utils'
import request from '@/utils/request'

export class TableDao extends BaseDao {
  constructor() {
    super('/system/gen_license')
  }
  public actionWidth = '140px'
  public layout = 'v'
  public defaultTableData: Object = {
    // type: 'business',
    exp: new Date('2099/12/12').getTime() + '',
    'nbf': 0,
    'iat': 0
  }

  public putLicense(data:any, query?:any) {
    console.log(6666, query)
    return request({
      url: `/system/gen_license`,
      method: 'put',
      data: data,
      params: query
    })
  }

  public deviceList:any[] = [
    { label: '全部', value: 'all' },
    { label: 'ModBus', value: 'modbus' },
    { label: '发那科', value: 'fanuc' },
    { label: '三菱CNC', value: 'mitsubishi' },
    { label: '三菱PLC', value: 'mitsubishi_plc' },
    { label: '西门子CNC', value: 'siemens_cnc' },
    { label: '西门子PLC', value: 'siemens_plc' },
    { label: '兄弟', value: 'brother' },
    { label: '海德汉', value: 'heidenhain' },
    { label: '新代', value: 'syntec' },
    { label: '库卡', value: 'kuka' },
    { label: '哈斯', value: 'haas' },
    { label: '凯恩帝', value: 'knd' },
    { label: '广数', value: 'gsk' },
    { label: '欧姆龙', value: 'omron' },
    { label: '西铁城', value: 'citizen_cnc' },
    { label: '智能PDU', value: 'nkppdu' }
  ]

  public tableColumn:TableColumn[] = [
    { name: '授权类型',
      value: 'type',
      type: 'select',
      columns: 6,
      required: true,
      ownSchema: {
        'ui': {
          'widget': 'select',
          'widgetConfig': {
            'clearable': true,
            'enumSource': [
              {
                'value': 'business',
                'label': '商业授权'
              },
              {
                'value': 'temp',
                'label': '测试授权'
              }
            ]
          }
        }
      }
    },

    { name: '过期时间',
      value: 'exp',
      type: 'date',
      required: true,
      columns: 6,
      ownSchema: {
        'ui': {
          'widget': 'date-picker',
          'widgetConfig': {
            'valueFormat': 'timestamp'
          }
        }
      }
    },
    { name: '设备指纹',
      value: 'finger_print',
      type: 'str',
      required: true
    },
    { name: '截止时间',
      value: 'nbf',
      type: 'number',
      ownSchema: {
        ui: {
          hidden: true
        }
      }
    },
    { name: '签发日期',
      value: 'iat',
      type: 'number',
      ownSchema: {
        ui: {
          hidden: true
        }
      }
    },
    { name: 'VPN授权',
      value: 'vpn',
      type: 'bool'
    },
    { name: '授权设备',
      value: 'count',
      type: 'date',
      ownSchema: {
        'type': 'array',
        'items': {
          'type': 'object',
          'properties': {
            'device': {
              'type': 'number',
              'ui': {
                'label': '设备型号',
                'widget': 'select',
                'widgetConfig': {
                  'clearable': true,
                  'enumSource': this.deviceList
                }
              }
            },
            'count': {
              'type': 'number',
              'ui': {
                'label': '授权数量'
              }
            }
          },
          'ui': {
            'label': '措施'
          }
        },
        'ui': {
          'label': '授权设备',
          'showLegend': false,
          'noLabelSpace': false,
          'widget': 'array-table',
          'widgetConfig': {
            'disableCollapse': false,
            'showOneIfEmpty': false,
            'disableReorder': false,
            'disableAdd': false,
            'disableDel': false
          }
        }
      }
    }

  ]
}
