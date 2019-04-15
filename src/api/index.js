import request from '@/util/request'

// 登录
export function login (query) {
  return request({
    url: '/user/login',
    method: 'post',
    data: query
  })
}
// 获取所有留言内容
export function getAllMessage (query) {
  return request({
    url: '/message/getAllMessage',
    method: 'post',
    data: query
  })
}

// 查询所有留言的留言评论
export function getAllMessageReview () {
  return request({
    url: '/review/getAllMessageReview',
    method: 'post'
  })
}

// 查询该评论的所有评论
export function getRemarkReview (query) {
  return request({
    url: '/review/getRemarkReview',
    method: 'post',
    data: query
  })
}

// 修改评论内容
export function editReview (query) {
  return request({
    url: '/review/editReview',
    method: 'post',
    data: query
  })
}

// 删除评论
export function deleteReview (query) {
  return request({
    url: '/review/deleteReview',
    method: 'post',
    data: query
  })
}
// 批量删除评论
export function deleteSomeReview (query) {
  return request({
    url: '/review/deleteSomeReview',
    method: 'post',
    data: query
  })
}
// 获取所有用户信息
export function queryAllUserData () {
  return request({
    url: '/user/queryAllUserData',
    method: 'post'
  })
}

// 获取条件用户信息
export function selectUser (query) {
  return request({
    url: '/user/selectUser',
    method: 'post',
    data: query
  })
}

// 删除用户及所有相关数据
export function deleteUserData (query) {
  return request({
    url: '/user/deleteUserData',
    method: 'post',
    data: query
  })
}

// 批量删除用户及所有相关数据
export function deleteSomeUser (query) {
  return request({
    url: '/user/deleteSomeUser',
    method: 'post',
    data: query
  })
}

// 修改用户权限
export function editUserType (query) {
  return request({
    url: '/user/editUserType',
    method: 'post',
    data: query
  })
}

// 删除留言及所有相关数据
export function deleteMessageData (query) {
  return request({
    url: '/message/deleteMessageData',
    method: 'post',
    data: query
  })
}

// 批量删除留言及所有相关数据
export function deleteSomeMessage (query) {
  return request({
    url: '/message/deleteSomeMessage',
    method: 'post',
    data: query
  })
}

// 修改留言内容
export function editMessageData (query) {
  return request({
    url: '/message/editMessageText',
    method: 'post',
    data: query
  })
}

// 条件查询留言
export function selectMessage (query) {
  return request({
    url: '/message/selectMessage',
    method: 'post',
    data: query
  })
}

// 条件查询留言
export function selectReview (query) {
  return request({
    url: '/review/selectReview',
    method: 'post',
    data: query
  })
}
