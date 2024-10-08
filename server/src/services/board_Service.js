const boardRepository = require('../repositories/board_Repo')

exports.getposts = async () => {
  return await boardRepository.getposts()
}

exports.createposts = async (postdata) => {
  return await boardRepository.createposts(postdata)
}

exports.getcontents = async (postId) => {
  return await boardRepository.getcontents(postId)
}

exports.deleteposts = async (id) => {
  return await boardRepository.deleteposts(id)
}

exports.updatelikes = async (id) => {
  return await boardRepository.updatelikes(id)
}
