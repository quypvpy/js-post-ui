import axios from 'axios'

const axiosClient = axios.create({
  baseURL: 'https://js-post-api.herokuapp.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

//  Add a request interceptor
// khi có 1 requets từ client , nó sẽ luôn luôn chạy vô interceptor
axiosClient.interceptors.request.use(
  function (config) {
    // attach token to request if exists
    // refresh token
    const accessToken = localStorage.getItem('access_token')
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error)
  }
)

//  Add a response interceptor
// khi có 1 response từ client , nó sẽ luôn luôn chạy vô interceptor ,
// reponse bao gồm rất nhiều thông tin. trong đó có datta. và ta chỉ muốn lấy phần thông tin dât thôi
axiosClient.interceptors.response.use(
  function (response) {
    return response.data
  },
  function (error) {
    // Do something with response error
    // return Promise.reject(error) laf nos đẩy lỗi lên thằng cha..
    // đa số handle lỗi ở tầng axios hoặc main..
    // return Promise.reject(error) hặc throw new Error(error)
    // từ axios client nó đẩy lên postapi.. nếu postpi chưa có try catch.. thì nó đẩy tiếp lên main.js..còn có r thôi ..nó k đẩy nữa..
    console.log('axiosClient -response error', error.response)
    if (!error.response) throw new Error('Network error', 'Please try again later')

    // redirect to login if not login
    if (error.response.status === 401) {
      window.location.assign('/login.html')
      return
    }
    return Promise.reject(error)
  }
)
export default axiosClient
