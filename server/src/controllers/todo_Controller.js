const todoService = require('../services/todo_Service')

exports.getTodos = async (req, res) => {
  try {
    const todos = await todoService.getTodos()
    console.log(todos)
    res.status(200).json(todos)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

exports.createTodo = async (req, res) => {
  try {
    const newTodo = await todoService.createTodo(req.body)
    res.status(201).json(newTodo)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

exports.deleteTodo = async (req, res) => {
  try {
    await todoService.deleteTodo(req.params.id) // 비동기작업 끝날때까지 기다리기위해 await 이용하기
    res.status(200).json({ message: 'Todo deleted successfully' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

exports.deleteAllTodo = async (req, res) => {
  try {
    await todoService.deleteAllTodo()
    res.status(200).json({ message: 'All todos deleted' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

exports.updateTodo = async (req, res) => {
  try {
    const updatedTodo = await todoService.updateTodo(req.params.id, req.body)
    if (!updatedTodo) {
      return res.status(404).json({ message: 'Todo not found' }) // 업데이트된 todo가 없을 경우 처리
    }
    res.status(200).json(updatedTodo) // 성공적으로 업데이트된 todo 반환
  } catch (err) {
    res.status(500).json({ error: err.message }) // 오류 발생 시 에러 반환
  }
}

exports.updateAllTodos = async (req, res) => {
  try {
    const done = req.body.done
    console.log(111)
    const updatedTodos = await todoService.updateAllTodos(done)
    return res.status(200).json(updatedTodos)
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
