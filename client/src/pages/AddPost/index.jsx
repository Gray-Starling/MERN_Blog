import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import TextField from '@mui/material/TextField'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import SimpleMDE from 'react-simplemde-editor'

import 'easymde/dist/easymde.min.css'
import styles from './AddPost.module.scss'
import { useSelector } from 'react-redux'
import { selectIsAuth } from '../../store/slices/auth'
import { useNavigate, Navigate, useParams } from 'react-router-dom'
import axios from '../../axios'

export const AddPost = () => {
	const { id } = useParams()
	const navigate = useNavigate()
	const isAuth = useSelector(selectIsAuth)
	const [text, setText] = useState('')
	const [title, setTitle] = useState('')
	const [tags, setTags] = useState('')
	const [imageUrl, setImageUrl] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const inputFileRef = useRef(null)
	const isEditing = !!id

	const handleChangeFile = async ev => {
		try {
			const formData = new FormData()
			const file = ev.target.files[0]
			formData.append('image', file)
			const { data } = await axios.post('/upload', formData)
			const image = new Image()
			image.src = await `http://localhost:4444${data?.url}`
			image.onload = () => {
				setImageUrl(image.src)
			}
		} catch (error) {
			console.warn(error)
			alert('Ошибка при загрузке файла!')
		}
	}

	const onClickRemoveImage = () => {
		setImageUrl('')
	}

	const onSubmit = async () => {
		try {
			setIsLoading(true)
			const fields = {
				title,
				tags: tags.split(','),
				imageUrl,
				text,
			}
			const { data } = isEditing
				? await axios.patch(`/posts/${id}`, fields)
				: await axios.post('/posts', fields)

			const _id = isEditing ? id : data._id

			navigate(`/posts/${_id}`)
		} catch (error) {
			console.warn(error)
			alert('Ошибка при создании статьи')
		}
	}

	const onChange = useCallback(value => {
		setText(value)
	}, [])

	useEffect(() => {
		if (id) {
			axios
				.get(`/posts/${id}`)
				.then(({ data }) => {
					setText(data.text)
					setTitle(data.title)
					setTags(data.tags.join(','))
					setImageUrl(data.imageUrl)
				})
				.catch(err => {
					console.warn(err)
					alert('Ошибка при получении статьи')
				})
		}
	}, [])

	const options = useMemo(
		() => ({
			spellChecker: false,
			maxHeight: '400px',
			autofocus: true,
			placeholder: 'Введите текст...',
			status: false,
			autosave: {
				enabled: true,
				delay: 1000,
			},
		}),
		[]
	)

	if (!window.localStorage.getItem('token') && !isAuth) {
		return <Navigate to='/' />
	}

	return (
		<Paper style={{ padding: 30 }}>
			<Button
				onClick={e => inputFileRef.current.click()}
				variant='outlined'
				size='large'>
				Загрузить превью
			</Button>
			<input
				ref={inputFileRef}
				type='file'
				onChange={handleChangeFile}
				hidden
			/>
			{imageUrl ? (
				<>
					<Button
						variant='contained'
						color='error'
						onClick={onClickRemoveImage}>
						Удалить
					</Button>
					<img
						className={styles.image}
						// src={`http://localhost:4444${imageUrl}`}
						src={imageUrl}
						alt='Uploaded'
					/>
				</>
			) : (
				''
			)}

			<br />
			<br />
			{/* <img
						className={styles.image}
						// src={`http://localhost:4444${imageUrl}`}
						src={`http://localhost:4444/uploads/ava.jpg`}
						alt='Uploaded'
					/> */}
			<TextField
				classes={{ root: styles.title }}
				variant='standard'
				placeholder='Заголовок статьи...'
				value={title}
				onChange={e => setTitle(e.target.value)}
				fullWidth
			/>
			<TextField
				classes={{ root: styles.tags }}
				variant='standard'
				placeholder='Тэги'
				value={tags}
				onChange={e => setTags(e.target.value)}
				fullWidth
			/>
			<SimpleMDE
				className={styles.editor}
				value={text}
				onChange={onChange}
				options={options}
			/>
			<div className={styles.buttons}>
				<Button onClick={onSubmit} size='large' variant='contained'>
					{isEditing ? 'Сохранить' : 'Опубликовать'}
				</Button>
				<a href='/'>
					<Button size='large'>Отмена</Button>
				</a>
			</div>
		</Paper>
	)
}
