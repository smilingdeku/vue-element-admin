import request from '@/utils/request'

const REQUEST_URI_PREFIX = '/sys/schedule-job-log'

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
