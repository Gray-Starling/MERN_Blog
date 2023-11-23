import express from 'express'
import multer from 'multer'
import mongoose from 'mongoose'
import 'dotenv/config'
import cors from 'cors'
import { UserController, PostController } from './controllers/controllers.js'
import { checkAuth, handleValidationErrors } from './utils/utils.js'
import {
	registerValidation,
	loginValidation,
	postCreateValidation,
} from './validations.js'

const MongooseUri = process.env.MONGODB
const corsOptions = {
	origin: process.env.CORS_URL,
	optionsSuccessStatus: 200,
}

mongoose
	.connect(process.env.MONGODB)
	.then(() => {
		console.log('DB ok')
	})
	.catch(err => {
		console.log('DB error', err)
	})

const app = express()

const storage = multer.diskStorage({
	destination: (_, __, cb) => {
		cb(null, 'uploads')
	},
	filename: (_, file, cb) => {
		cb(null, file.originalname)
	},
})

const upload = multer({ storage })

app.use(express.json())
app.use('/uploads', express.static('uploads'))
app.use(cors(corsOptions))
// app.use((req, res, next) => {
// 	res.header('Access-Control-Allow-Origin', 'http://localhost:3000')
// 	res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
// 	res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')

// 	if (req.method === 'OPTIONS') {
// 		res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
// 		res.sendStatus(200)
// 	} else {
// 		next()
// 	}
// })

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
	res.json({
		url: `/upload/${req.file.originalname}`,
	})
})

app.post(
	'/auth/login',
	loginValidation,
	handleValidationErrors,
	UserController.login
)
app.post(
	'/auth/register',
	handleValidationErrors,
	registerValidation,
	UserController.register
)
app.get('/auth/me', checkAuth, UserController.getMe)

app.get('/posts', PostController.getAll)
app.post(
	'/posts',
	checkAuth,
	postCreateValidation,
	handleValidationErrors,
	PostController.create
)
app.get('/posts/:id', PostController.getOne)
app.delete('/posts/:id', checkAuth, PostController.remove)
app.patch(
	'/posts/:id',
	checkAuth,
	postCreateValidation,
	handleValidationErrors,
	PostController.update
)

app.listen(4444, err => {
	if (err) {
		return console.log(err)
	}
	console.log('Server ok')
})
