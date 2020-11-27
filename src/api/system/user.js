import request from '@/utils/request'

const REQUEST_URI_PREFIX = '/sys/user'

export function login(data) {
  return request({
    url: REQUEST_URI_PREFIX + '/login',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: REQUEST_URI_PREFIX + '/logout',
    method: 'post'
  })
}

export function getInfo() {
  return request({
    url: REQUEST_URI_PREFIX,
    method: 'get'
  })
}

export function page(params) {
  return request({
    url: REQUEST_URI_PREFIX + '/page',
    method: 'get',
    params: params
  })
}

export function get(id) {
  return request({
    url: REQUEST_URI_PREFIX + `/${id}`,
    method: 'get'
  })
}

export function del(ids) {
  return request({
    url: REQUEST_URI_PREFIX + `/${ids}`,
    method: 'delete'
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

export function getRoles(id) {
  return request({
    url: REQUEST_URI_PREFIX + `/${id}/roles`,
    method: 'get'
  })
}
