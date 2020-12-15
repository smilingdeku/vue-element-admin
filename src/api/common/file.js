import request from '@/utils/request'

const REQUEST_URI_PREFIX = '/common/file'

export function upload(data) {
  const formData = new FormData()
  formData.append('files', data.file)
  return request({
    url: REQUEST_URI_PREFIX + '/upload',
    method: 'post',
    headers: { 'Content-Type': 'multipart/form-data' },
    data: formData
  })
}
