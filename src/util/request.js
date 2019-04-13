import axios from 'axios'
// 创建axios实例
const service = axios.create({
  timeout: 5000
})

export default service
