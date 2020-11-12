import request from '@/utils/request'

export default class Photo {
  getAllPhoto(params?:any) {
    return request({
      url: `/features/photo_search`,
      method: 'get',
      params: params
    })
  }

  deletePhoto(id:string) {
    return request({
      url: `/features/photo/${id}`,
      method: 'delete'
    })
  }
}
