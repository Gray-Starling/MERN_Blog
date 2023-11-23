import express from 'express'
import multer from 'multer'
import mongoose from 'mongoose'
import 'dotenv/config'

import { UserController, PostController } from './controllers/controllers.js'
import { checkAuth, handleValidationErrors } from './utils/utils.js'
import {
	registerValidation,
	loginValidation,
	postCreateValidation,
} from './validations.js'

const MongooseUri = process.env.MONGODB;
// console.log("Mongo",MongooseUri)

mongoose
	.connect(
		// 'mongodb+srv://skvorcovsa90:RM13sherifM@cluster0.k1n7bwy.mongodb.net/blog?retryWrites=true&w=majority'
		process.env.MONGODB
	)
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
