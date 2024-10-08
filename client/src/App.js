import { useState, useEffect } from 'react'

function App() {
  const [input, setInput] = useState('')
  const [todos, setTodos] = useState([])
  const [allChecked, setAllChecked] = useState(false)

  // 서버에서 투두 리스트 가져오기
  useEffect(() => {
    fetchTodos()
  }, [])

  const fetchTodos = async () => {
    try {
      const response = await fetch('http://localhost:3001/todo')
      if (!response.ok) {
        throw new Error('Failed to fetch todos')
      }
      const data = await response.json()
      setTodos(data)
    } catch (error) {
      console.error('Error fetching todos:', error)
    }
  }

  // 새로운 투두 추가하기
  const addTodo = async () => {
    console.log(input)
    if (!input.trim()) {
      alert('투두가 비어있어요!')
      return
    }
    console.log(input)

    try {
      const response = await fetch('http://localhost:3001/todo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: input.trim(), done: false }),
      })

      if (!response.ok) {
        throw new Error('Failed to add todo')
      }
      const newTodo = await response.json()
      console.log(newTodo)
      setTodos((prevTodos) => [...prevTodos, newTodo])
      setInput('')
    } catch (error) {
      console.error('Error adding todo:', error)
    }
  }

  //체크박스

  const toggleDone = async (id, currentDone) => {
    try {
      const response = await fetch(`http://localhost:3001/todo/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ done: !currentDone }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Failed to update todo: ${errorText}`)
      }

      setTodos((prevTodos) =>
        prevTodos.map(
          (todo) => (todo._id === id ? { ...todo, done: !currentDone } : todo),
          console.log(prevTodos),
        ),
      )
    } catch (error) {
      console.error('Error updating todo:', error)
    }
  }

  // 투두 삭제하기
  const deleteTodo = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/todo/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        throw new Error('Failed to delete todo')
      }

      // setTodos(todos.filter((todo) => todo._id !== id))
      //함수형 업데이트
      setTodos((prevTodos) => prevTodos.filter((todo) => todo._id !== id))
    } catch (error) {
      console.error('Error deleting todo:', error)
    }
  }

  //모든 리스트 삭제
  const deleteAllTodo = async () => {
    try {
      const response = await fetch(`http://localhost:3001/todo`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        throw new Error('failed to delete all todos')
      }
      setTodos([]) // 투두 목록들 비우기
    } catch (error) {
      console.error('Error deleting all todos: ', error)
    }
  }

  //전체 체크
  // const toggleAllTodos = async () => {
  //   try {
  //     const response = await fetch('http://localhost:3001/todo/all', {
  //       method: 'PATCH',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ done: true }), // 모든 투두의 상태를 'done: true'로 변경
  //     })

  //     if (!response.ok) {
  //       const errorText = await response.text()
  //       throw new Error(`Failed to update all todos: ${errorText}`)
  //     }

  //     const updatedTodos = await response.json()
  //     setTodos(updatedTodos) // 업데이트된 투두 상태 반영
  //   } catch (error) {
  //     console.error('Error updating all todos:', error)
  //   }
  // }

  const toggleAllTodos = async () => {
    try {
      const response = await fetch('http://localhost:3001/todo/all', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ done: !allChecked }), // 현재 상태의 반대값으로 설정
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Failed to update all todos: ${errorText}`)
      }

      const updatedTodos = await response.json()
      setTodos(updatedTodos) // 업데이트된 투두 상태 반영
      setAllChecked(!allChecked) // 상태 토글
    } catch (error) {
      console.error('Error updating all todos:', error)
    }
  }
  return (
    <div>
      <h1 style={{ color: 'navy', marginLeft: '20px' }}>💪🏻 Todo List</h1>
      <input
        type='text'
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder='새로운 투두를 입력하세요'
        style={{
          height: '40px',
          width: '400px',
        }}
      />
      <button onClick={addTodo} style={{ height: '45px', width: '100px' }}>
        추가하기
      </button>
      <br />
      <br />
      {todos.length > 0 && (
        <>
          <button onClick={deleteAllTodo}> 전체 삭제</button>
          <button onClick={toggleAllTodos}>
            {' '}
            {allChecked ? '전체 체크 해제' : '전체 체크'}
          </button>
        </>
      )}
      <span> 리스트 개수: {todos.length}</span>

      <ul>
        {todos.map((todo) => (
          <li
            key={todo._id}
            style={{
              textDecoration: todo.done ? 'line-through' : 'none',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <input
              type='checkbox'
              checked={todo.done}
              onChange={() => toggleDone(todo._id, todo.done)}
              style={{ marginRight: '10px' }}
            />
            <span>{todo.title}</span>{' '}
            {/* <span>{new Date(todo.createdAt).toLocaleString()}</span> */}
            <button
              onClick={() => deleteTodo(todo._id)}
              style={{
                backgroundColor: 'white',
                border: '0px',
              }}
            >
              🗑️
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
