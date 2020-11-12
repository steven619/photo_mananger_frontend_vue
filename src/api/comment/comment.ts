import request from '@/utils/request'

export default class Comment {
  getComment(id:string) {
    return request({
      url: `/comment/get_comment/{id}`,
      method: 'get'
    })
  }
  addComment(params?:any) {
    return request({
      url: `/comment/get_comment/{id}`,
      method: 'post',
      params: params
    })
  }
}
