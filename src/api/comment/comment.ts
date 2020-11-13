import request from '@/utils/request'

export default class Comment {
  getComment(id:string) {
    return request({
      url: `/comment/get_comment/${id}`,
      method: 'get'
    })
  }
  addComment(id?:any, data?:any) {
    return request({
      url: `/comment/comment_up/${id}`,
      method: 'post',
      data: data
    })
  }
}
