const R = require('ramda')

const dummy = () => 1

const totalLikes = (blogs) =>
  blogs.reduce((sum, current) => sum + current.likes, 0)

const favouriteBlog = (blogs) => {
  return R.reduce(
    R.maxBy((blog) => blog.likes),
    { likes: 0 },
    blogs
  )
}

const mostLikes = (blogs) => {
  const groupByAuthor = R.pipe(
    R.groupBy(R.prop('author')),
    R.map((o) => o.map((i) => i.likes)),
    R.map(R.sum)
  )
  let sorted = groupByAuthor(blogs)
  let favAuthor = Object.keys(sorted).reduce((a, b) => (sorted[a] > sorted[b] ? a : b))
  let returnObj = {}
  returnObj[favAuthor] = sorted[favAuthor]

  return returnObj
}

module.exports = {
  dummy,
  totalLikes,
  favouriteBlog,
  mostLikes,
}
