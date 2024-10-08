const boardService = require('../services/board_Service')

exports.getposts = async (req, res) => {
  try {
    const posts = await boardService.getposts()
    console.log(posts)
    res.status(200).json(posts)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

exports.createposts = async (req, res) => {
  try {
    const newpost = await boardService.createposts(req.body)
    res.status(201).json(newpost)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
exports.getcontents = async (req, res) => {
  const postId = req.params.id
  try {
    const contents = await boardService.getcontents(postId)
    // console.log(contents)

    res.status(200).json(contents)
  } catch (err) {
    console.error('게시글 조회 오류:', err)
    res.status(500).json({ error: err.message })
  }
}
exports.deleteposts = async (req, res) => {
  console.log('Controller: req.params:', req.params) // req.params 전체 출력
  console.log('Controller: req.params.id:', req.params.id) // req.params.id 값만 출력
  try {
    await boardService.deleteposts(req.params.id)
    res.status(200).json({ message: '포스트 삭제 성공><' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

exports.updatelikes = async (req, res) => {
  try {
    const updatedpost = await boardService.updatelikes(req.params.id)
    res.status(200).json(updatedpost)
  } catch (err) {
    console.log('서버 오류:', err.message)
    res.status(500).json({ error: err.message })
  }
}
