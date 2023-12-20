import axios from 'axios'

const instance = axios.create({
	baseURL: 'http://mern-blog.it-gray.ru:4444',
})

instance.interceptors.request.use(config => {
	config.headers.Authorization = window.localStorage.getItem('token')
	return config
})

export default instance
