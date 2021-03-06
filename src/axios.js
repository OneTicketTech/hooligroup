import axios from 'axios'
import router from './router/index'
import store from './store/index'
import * as types from './store/types'

//
axios.default.timeout = 5000
axios.defaults.headers.post['Content-Type'] = 'application/json'

const instance = axios.create();
instance.defaults.headers.post['Content-Type'] = 'application/json'

axios.interceptors.request.use = instance.interceptors.request.use
instance.interceptors.request.use(config => {
	if (localStorage.getItem('token')) {
		config.headers.Authorization = `token ${localStorage.getItem('token')}`
			.replace(/(^\")|(\"$)/g, '')
	}
	return config
}, err => {
	return Promise.reject(err)
})
// axios拦截响应
instance.interceptors.response.use(response => {
	return response
}, err => {
	if (err.response) {
		switch (err.response.status) {
			case 401:
				// 返回 401 清除token信息并跳转到登录页面
				store.commit(types.LOGOUT);
				router.replace({
					path: 'login',
					query: { redirect: router.currentRoute.fullPath }
				})
		}
	}
	return Promise.reject(err)
})

// TODO: redesign restful apis
export default {
	// 用户注册
	userRegister(data) {
		return instance.post('/hapi/register', data)
	},
	// 用户登录
	UserLogin(data) {
		return instance.post('/hapi/login', data)
	},
	// jaccount 登录
	loginByJaccount(data) {
		return instance.post('/hapi/login/jaccount', data)
	},
	// 修改用户名
	UpdateUserInfo(data) {
		return instance.post('/hapi/updateUser', data)
	},
	// 修改密码
	UpdatePassword(data) {
		return instance.post('/hapi/updatePassword', data)
	},
	// 获取用户
	getUser() {
		return instance.get('/hapi/user')
	},
	// 删除用户
	delUser(data) {
		return instance.post('/hapi/delUser', data)
	},

	// 获取group
	getGroups() {
		return instance.get('/hapi/groups')
	},

	// 新建group
	createGroup(data) {
		return instance.post('/hapi/group/create', data)
	},

	// 报名参加group
	joinGroup(data) {
		return instance.post('/hapi/joinGroup', data)
	},

	// 通过用户加入group申请
	confirmJoinGroup(data) {
		return instance.post('/hapi/confirmJoinGroup', data)
	},

	leaveGroup(data) {
		return instance.post('/hapi/leaveGroup', data)
	},

	// 获得小组信息
	getGroupInfo(data) {
		return instance.get('/hapi/group/getGroupInfoById?id=' + data.id)
	},

	// 获得小组论坛板块
	getGroupSections(data) {
		return instance.get('/hapi/group/getGroupSectionsById?id=' + data.id)
	},

	// 新增小组论坛板块
	newGroupSection(data) {
		return instance.post('/hapi/group/section/new', data)
	},

	// 删除小组论坛板块
	deleteGroupSection(data) {
		return instance.post('/hapi/group/section/delete', data)
	},

	// 获得活动信息
	getEventInfo(data) {
		return instance.get('/hapi/event/getEventInfoById?id=' + data.id)
	},

	// 获得主题信息
	getTopicInfo(data) {
		return instance.get('/hapi/topic/getTopicInfoById?id=' + data.id)
	},

	// 删除主题
	deleteTopic(data) {
		return instance.post('/hapi/topic/delete', data)
	},

	// 发布主题
	createTopic(data) {
		return instance.post('/hapi/topic/create', data)
	},

	// 编辑主题
	updateTopic(data) {
		return instance.post('/hapi/topic/update', data)
	},

	// 发布回复
	createComment(data) {
		return instance.post('/hapi/comment/create', data)
	},

	// 删除回复
	deleteComment(data) {
		return instance.post('/hapi/comment/delete', data)
	},

	// 报名参加event
	joinEvent(data) {
		return instance.post('/hapi/joinEvent', data)
	},

	// 取消参加event
	leaveEvent(data) {
		return instance.post('/hapi/leaveEvent', data)
	},

	// 创建活动
	createEvent(data) {
		return instance.post('/hapi/event/create', data)
	},

	// 提交vote
	vote(data) {
		return instance.post('/hapi/vote', data)
	}
}
