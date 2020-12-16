import request from '@/utils/request'

const REQUEST_URI_PREFIX = '/common/captcha'

export function get(type) {
  return request({
    url: REQUEST_URI_PREFIX + `/${type}`,
    method: 'get'
  })
}
