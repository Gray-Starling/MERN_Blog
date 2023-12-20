import PostModel from '../models/Post.js'

export const getLastTags = async (req, res) => {
	try {
		const posts = await PostModel.find().limit(5).exec()

		const tags = posts
			.map(obj => obj.tags)
			.flat()
			.slice(0, 5)

		res.json(tags)
	} catch (error) {
		console.log(error)
		res.status(500).json({
			message: 'Не удалось получить теги',
		})
	}
}

export const getAll = async (req, res) => {
	try {
		const posts = await PostModel.find().populate('user').exec()

		res.json(posts)
	} catch (error) {
		console.log(error)
		res.status(500).json({
			message: 'Не удалось получить посты',
		})
	}
}
export const getOne = async (req, res) => {
	try {
		const postId = req.params.id

		PostModel.findOneAndUpdate(
			{
				_id: postId,
			},
			{
				$inc: { viewsCount: 1 },
			},
			{
				returnDocument: 'after',
			}
		)
			.populate('user')
			.then(doc => {
				if (!doc) {
					return res.status(404).json({
						message: 'Не найдена',
					})
				}
				res.json(doc)
			})
			.catch(err => {
				return res.status(404).json({
					message: 'Не удалось получить пост',
				})
			})
	} catch (error) {
		console.log(error)
		res.status(500).json({
			message: 'Не удалось получить посты2',
		})
	}
}

export const create = async (req, res) => {
	try {
		const doc = new PostModel({
			title: req.body.title,
			text: req.body.text,
			imageUrl: req.body.imageUrl,
			tags: req.body.tags,
			user: req.userId,
		})

		const post = await doc.save()

		res.json(post)
	} catch (error) {
		console.log(error)
		res.status(500).json({
			message: 'Не удалось создать пост',
		})
	}
}

export const remove = async (req, res) => {
	try {
		const postId = req.params.id
		PostModel.findOneAndDelete({
			_id: postId,
		})
			.then(doc => {
				if (!doc) {
					return res.status(404).json({
						message: 'Пост не найден',
					})
				}
				res.json({ success: true })
			})
			.catch(err => {
				return res.status(404).json({
					message: 'Не удалось удалить пост',
				})
			})
	} catch (error) {
		console.log(error)
		res.status(500).json({
			message: 'Не удалось удалить пост',
		})
	}
}

export const update = async (req, res) => {
	try {
		const postId = req.params.id

		PostModel.updateOne(
			{
				_id: postId,
			},
			{
				title: req.body.title,
				text: req.body.text,
				imageUtl: req.body.imageUtl,
				tags: req.body.tags,
				user: req.userId,
			}
		).then(
			res.json({
				success: true,
				message: 'Пост отредактирован',
			})
		)
	} catch (error) {
		console.log(error)
		res.status(500).json({
			message: 'Не удалось отредактировать пост',
		})
	}
}
