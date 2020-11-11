import request from '@/utils/request'

export function getRouters() {
  return request({
    url: '/sys/resource/routers',
    method: 'get'
  })
}
