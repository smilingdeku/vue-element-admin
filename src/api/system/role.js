import request from '@/utils/request'

export function page(params) {
  return request({
    url: '/sys/role/page',
    method: 'get',
    params: params
  })
}
