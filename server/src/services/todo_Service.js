const todoRepository = require('../repositories/todo_Repo')

exports.getTodos = async () => {
  return await todoRepository.getTodos()
}

exports.createTodo = async (todoData) => {
  return await todoRepository.createTodo(todoData)
}

exports.deleteTodo = async (id) => {
  return await todoRepository.deleteTodo(id)
}

exports.deleteAllTodo = async () => {
  return await todoRepository.deleteAllTodo()
}

exports.updateTodo = async (id, updateData) => {
  return await todoRepository.updateTodo(id, updateData)
}

exports.updateAllTodos = async (done) => {
  return await todoRepository.updateAllTodos(done)
}
