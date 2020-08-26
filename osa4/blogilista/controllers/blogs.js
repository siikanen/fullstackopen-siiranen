const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const logger = require('../utils/logger')

blogsRouter
  .route('/')

  .get(async (request, response) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, id: 1 })
    return response.json(blogs)
  })

  .post(async (request, response) => {
    const user = await User.findOne({ _id: request.user.id })
    const blog = new Blog({ ...request.body, user: user })
    const result = await blog.save()
    await User.updateOne({ _id: user._id }, { blogs: blog })
    return response.status(201).json(result)
  })

blogsRouter
  .route('/:id')

  .put(async (req, res) => {
    const blogToUpdate = await Blog.findOne({ _id: req.params.id }).populate(
      'user'
    )
    if (blogToUpdate.user.id !== req.user.id) throw new Error('Forbidden')
    const blogUpdate = {
      title: req.body.title,
      author: req.body.author,
      url: req.body.url,
      likes: req.body.likes,
    }
    const updated = await Blog.updateOne({ _id: req.params.id }, blogUpdate)
    logger.info('COUNT', updated)
    if (updated.n === 1) res.json({ ...blogUpdate, id: req.params.id })
    else throw new ReferenceError('Id not found')
  })

  .delete(async (req, res) => {
    const blogToDelete = await Blog.findOne({ _id: req.params.id }).populate(
      'user'
    )
    if (blogToDelete.user.id !== req.user.id) throw new Error('Forbidden')
    const deletedCount = await Blog.deleteOne({ _id: req.params.id })
    if (deletedCount.n === 1) res.status(204).send()
    else throw new ReferenceError('Id not found')
  })

module.exports = blogsRouter
