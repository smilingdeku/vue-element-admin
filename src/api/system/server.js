import request from '@/utils/request'

const REQUEST_URI_PREFIX = '/sys/server'

export function info(id) {
  return request({
    url: REQUEST_URI_PREFIX + `/info`,
    method: 'get'
  })
}
