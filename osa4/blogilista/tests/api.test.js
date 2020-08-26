const supertest = require('supertest')
const mongoose = require('mongoose')

const Blog = require('../models/blog')
const testHelper = require('./test_helper')
const User = require('../models/user')

const app = require('../app')

const api = supertest(app)

describe('/api/users tests', () => {
  beforeAll(async () => {
    await User.deleteMany({})
  })
  test('Create user', async () => {
    const newUserObj = {
      username: 'test',
      password: 'test',
    }
    await api
      .post('/api/users')
      .send(newUserObj)
      .expect(201)
      .expect('Content-Type', /application\/json/)
  })

  test('User creation fails with the same username', async () => {
    const newUserObj = {
      username: 'test',
      password: 'test',
    }
    const result = await api
      .post('/api/users')
      .send(newUserObj)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('User test already exists')
  })

  test('Too short username fails', async () => {
    const newUserObj = {
      username: 't',
      password: 'test',
    }
    const result = await api
      .post('/api/users')
      .send(newUserObj)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('must be longer than 3 characters')
  })

  test('Too short password fails', async () => {
    const newUserObj = {
      username: 'test',
      password: 't',
    }
    const result = await api
      .post('/api/users')
      .send(newUserObj)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('Too short password')
  })

  test('Missing username or password fails', async () => {
    const missingUser = {
      password: 'test',
    }
    const missingPass = {
      username: 'test',
    }
    let result = await api
      .post('/api/users')
      .send(missingUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('Username or password missing')

    result = await api
      .post('/api/users')
      .send(missingPass)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('Username or password missing')
  })
})

describe('/api/blogs tests', () => {
  let token = ''

  beforeAll(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})
    const UserObj = {
      username: 'test',
      password: 'test',
    }
    // Create new user
    await api.post('/api/users').send(UserObj)
    const response = await api.post('/api/login').send(UserObj)
    token = response.body.token
  })
  test('Blogs can be added via post', async () => {
    const blogToAdd = {
      title: 'test',
      author: 'test',
      url: 'tes.com',
      likes: 53525,
    }
    const blogsBefore = await testHelper.blogsInDb()
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(blogToAdd)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    const blogsAfter = await testHelper.blogsInDb()

    expect(blogsAfter).toHaveLength(blogsBefore.length + 1)
  })

  test('Blog cannot be added without token', async () => {
    const blogToAdd = {
      title: 'test',
      author: 'test',
      url: 'tes.com',
      likes: 53525,
    }
    const blogsBefore = await testHelper.blogsInDb()

    await api
      .post('/api/blogs')
      .send(blogToAdd)
      .expect(401)
    const blogsAfter = await testHelper.blogsInDb()

    expect(blogsAfter).toHaveLength(blogsBefore.length)
  })

  test('Missing likes will set it to 0', async () => {
    const testBlog = new Blog({
      title: 'test',
      author: 'test',
      url: 'tes.com',
    })
    expect(testBlog.likes).toBe(0)
  })

  test('Invalid POST returns 400', async () => {
    const blogToAdd = {
      title: 'test',
      likes: 53525,
    }
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(blogToAdd)
      .expect('Content-Type', /application\/json/)
      .expect(400)
  })
  test('Blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('Blogs have an id field', async () => {
    const blogs = await api.get('/api/blogs')
    expect(blogs.body[0].id).toBeDefined()
  })
})

afterAll(() => {
  mongoose.connection.close()
})
