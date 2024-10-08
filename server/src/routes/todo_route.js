const express = require('express')
const router = express.Router()
const todoController = require('../controllers/todo_Controller')

// 모든 투두 리스트 가져오기
router.get('/', todoController.getTodos)

// 새로운 투두 추가
router.post('/', todoController.createTodo)

// 투두 전체 삭제
router.delete('/', todoController.deleteAllTodo)

// 투두 삭제
router.delete('/:id', todoController.deleteTodo)

//투두 체크박스 체크하기
router.patch('/all', todoController.updateAllTodos)

// 투두 상태 업데이트
router.patch('/:id', todoController.updateTodo)

module.exports = router
