import axiosClient from './axiosClient'

const postApi = {
  getAll(params) {
    const url = '/posts'
    return axiosClient.get(url, { params })
    // return axiosClient.get(url, { params, baseURL: 'https//abc.com' })
  },
  getById(id) {
    const url = `/posts/${id}`
    return axiosClient.get(url)
  },
  add(data) {
    const url = '/posts'
    return axiosClient.post(url, data)
  },
  update(data) {
    const url = `/posts/${data.id}`
    // data trueyenf xuoong
    return axiosClient.patch(url, data)
  },
  addFormData(data) {
    const url = `/with-thumbnail/posts`
    // data trueyenf xuoong
    return axiosClient.post(url, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  updateFormData(data) {
    const url = `/with-thumbnail/posts/${data.get('id')}`
    // data trueyenf xuoong
    return axiosClient.patch(url, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  // ddoois với upload file chúng ta phải dùng form dâta
  remove(id) {
    const url = `/posts/${id}`
    return axiosClient.delete(url, id)
  },
}
export default postApi
