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

export function save(data) {
  return request({
    url: `/sys/resource`,
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: `/sys/resource`,
    method: 'put',
    data
  })
}

export function del(ids) {
  return request({
    url: `/sys/resource/${ids}`,
    method: 'delete'
  })
}
