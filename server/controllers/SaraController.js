import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import UserModel from '../models/User.js'
import { signJWT, verifyJWT } from '../utils/jwt.js'

export const login = async (req, res) => {
	try {
		const user = await UserModel.findOne({ email: req.body.email })
		if (!user) {
			return res.status(401).json({
				message: 'Пользователь не найден',
			})
		}
		const isValidPassword = await bcrypt.compare(
			req.body.password,
			user._doc.passwordHash
		)
		if (!isValidPassword) {
			return res.status(401).json({
				message: 'Неверный логин или пароль',
			})
		}

		const accessToken = signJWT(
			{
				id: user._doc._id,
				name: user._doc.fullName,
				email: user._doc.email,
			},
			'1h'
		)
		await res.cookie('access_token', accessToken, {
			maxAge: 60 * 60 * 1000 * 24 * 30,
			httpOnly: true,
		})

		return res.json({ token: accessToken })
	} catch (error) {
		console.log(error)
		res.status(500).json({
			message: 'Не удалось авторизоваться',
		})
	}
}

export const logout = (req, res) => {
	res.cookie('access_token', '', {
		maxAge: 0,
		httpOnly: true,
	})
	res.json({message: "Logged out"})
}

export const getUser = (req, res) => {
	return res.json(req.user)
}
