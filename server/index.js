import express from 'express'
import multer from 'multer'
import mongoose from 'mongoose'
import 'dotenv/config'
import cors from 'cors'
import {
	UserController,
	PostController,
	SaraController,
} from './controllers/controllers.js'
import { checkAuth, handleValidationErrors } from './utils/utils.js'
import {
	registerValidation,
	loginValidation,
	postCreateValidation,
} from './validations.js'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import cookieParser from 'cookie-parser'
import { deserializeUser } from './utils/deserializeUser.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

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

app.use(
	cors({
		credentials: true,
		origin: true,
	})
)
const upload = multer({ storage })

app.use(cookieParser())
app.use(express.json())
app.use('/uploads', express.static(`${__dirname}/uploads`))

app.post('/upload', checkAuth, async (req, res) => {
	try {
		await new Promise((resolve, reject) => {
			upload.single('image')(req, res, err => {
				if (err) reject(err)
				resolve()
			})
		})

		res.json({
			url: `/uploads/${req.file.originalname}`,
		})
	} catch (err) {
		res.status(500).json({ error: 'Ошибка загрузки изображения' })
	}
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

// ----- sarafan Api *****************************************************************
app.post(
	'/sara/login',
	loginValidation,
	handleValidationErrors,
	SaraController.login
)

app.delete(
	'/sara/logout',
	SaraController.logout
)

app.get(
	'/sara/getUser',
	deserializeUser,
	SaraController.getUser
)

app.get('/tags', PostController.getLastTags)

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
