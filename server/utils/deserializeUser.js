import { verifyJWT } from './jwt.js'

export const deserializeUser = (req, res, next) => {
	const accessToken = req.cookies.access_token
	// const accessToken = (req.headers.authorization || '').replace(/Bearer\s?/, '')

  // console.log("accessToken", req.cookies.access_token);

	if (!accessToken) {
		return res.status(403).json({
			message: 'no token',
		})
	}

	const { payload } = verifyJWT(accessToken)

	if (payload) {
		req.user = payload
		return next()
	}

	return next()
}
