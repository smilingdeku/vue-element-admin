import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/sys/user/login',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/sys/user/logout',
    method: 'post'
  })
}

export function getInfo() {
  return request({
    url: '/sys/user',
    method: 'get'
  })
}

export function page(params) {
  return request({
    url: '/sys/user/page',
    method: 'get',
    params: params
  })
}

export function get(id) {
  return request({
    url: `/sys/user/${id}`,
    method: 'get'
  })
}

export function del(ids) {
  return request({
    url: `/sys/user/${ids}`,
    method: 'delete'
  })
}

export function save(data) {
  return request({
    url: `/sys/user`,
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: `/sys/user`,
    method: 'put',
    data
  })
}
