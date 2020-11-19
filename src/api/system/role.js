import request from '@/utils/request'

export function page(params) {
  return request({
    url: '/sys/role/page',
    method: 'get',
    params: params
  })
}

export function get(id) {
  return request({
    url: `/sys/role/${id}`,
    method: 'get'
  })
}

export function save(data) {
  return request({
    url: `/sys/role`,
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: `/sys/role`,
    method: 'put',
    data
  })
}

export function getPermissions(id) {
  return request({
    url: `/sys/role/${id}/resources`,
    method: 'get'
  })
}
