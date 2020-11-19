import request from '@/utils/request'

export function get(id) {
  return request({
    url: `/sys/resource/${id}`,
    method: 'get'
  })
}

export function list() {
  return request({
    url: `/sys/resource/list`,
    method: 'get'
  })
}
