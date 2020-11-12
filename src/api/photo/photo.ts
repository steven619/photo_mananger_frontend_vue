import request from '@/utils/request'

export default class Photo {
  getAllPhoto(params?:any) {
    return request({
      url: `/features/photo_search`,
      method: 'get',
      params: params
    })
  }
  getMyPhoto(params?:any) {
    return request({
      url: `/features/my_photo`,
      method: 'get',
      params: params
    })
  }
  getOnePhont(id:string) {
    return request({
      url: `/features/photo_share/${id}`,
      method: 'get'
    })
  }

  deletePhoto(id:string) {
    return request({
      url: `/features/photo/${id}`,
      method: 'delete'
    })
  }
}
