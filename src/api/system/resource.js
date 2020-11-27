import request from '@/utils/request'

const REQUEST_URI_PREFIX = '/sys/resource'

export function get(id) {
  return request({
    url: REQUEST_URI_PREFIX + `/${id}`,
    method: 'get'
  })
}

export function list() {
  return request({
    url: REQUEST_URI_PREFIX + `/list`,
    method: 'get'
  })
}

export function save(data) {
  return request({
    url: REQUEST_URI_PREFIX,
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: REQUEST_URI_PREFIX,
    method: 'put',
    data
  })
}

export function del(ids) {
  return request({
    url: REQUEST_URI_PREFIX + `/${ids}`,
    method: 'delete'
  })
}

export function getRouters() {
  return request({
    url: REQUEST_URI_PREFIX + '/routers',
    method: 'get'
  })
}
