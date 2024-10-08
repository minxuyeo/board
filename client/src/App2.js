import React, { useEffect, useState } from 'react'
import './utils/App2.css'

function App2() {
  //글 제목 작성
  const [title, setTitle] = useState('')
  //글 내용 작성
  const [content, setContent] = useState('')
  //테이블 > 글 조회
  const [posts, setPosts] = useState([])
  //테이블 >글 조회 모달
  const [isPostModalOpen, setIsPostModalOpen] = useState(false)
  // 글 작성 모달
  const [isWritingModalOpen, setIsWritingModalOpen] = useState(false)
  //선택한 게시글 내용 전체 받아오기
  const [selectedPost, setSelectedPost] = useState(null)
  console.log('선택한 게시글', selectedPost)

  //글자수 카운트 > 제목
  const [charCount, setCharCount] = useState(0)
  //글자수 카운트 > 콘텐츠
  const [charContentcount, setCharContentcount] = useState(0)

  useEffect(() => {
    getPosts()
  }, [])

  //포스트 가져오기
  const getPosts = async () => {
    try {
      const response = await fetch('http://localhost:3001/board')
      if (!response.ok) {
        throw new Error('네트워크 오류 발생')
      }
      const data = await response.json()
      setPosts(data)
      console.log('포스트 어떤거 가져오냐면:', data)
    } catch (error) {
      console.error('게시글 가져오는 중 오류 발생', error)
    }
  }

  //폼 제출
  const formSubmit = (e) => {
    e.preventDefault() //새로고침 막기
    const newPost = {
      title: title,
      content: content,
      date: new Date().toLocaleDateString(),
      likes: 0,
      contentCharCount: content.length,
    }
    addPost(newPost)
    setTitle('')
    setContent('')
    setIsWritingModalOpen(false)
    setCharCount(0)
    setCharContentcount(0)
  }

  //포스트 추가하기
  const addPost = async (newPost) => {
    if (!title.trim() && !content.trim()) {
      alert('제목과 내용을 모두 입력해주세요')
      return
    }

    if (!title.trim()) {
      alert('제목을 입력해주세요!')
      return
    }

    if (!content.trim()) {
      alert('내용을 입력해주세요!')
      return
    }

    try {
      const response = await fetch('http://localhost:3001/board', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPost),
      })
      if (!response.ok) throw new Error('게시글 추가 실패')
      const addedPost = await response.json()
      setPosts((prevPosts) => [...prevPosts, addedPost])
      alert('저장되었습니다')
    } catch (error) {
      console.error('게시글 추가 중 오류 발생:', error)
    }
  }

  //테이블 행 클릭시 > 모달 띄워주기
  const openPostModal = async (postId) => {
    try {
      const response = await fetch(`http://localhost:3001/board/${postId}`)
      if (!response.ok) {
        throw new Error('게시글 조회 실패')
      }
      const postData = await response.json()
      setSelectedPost(postData)
      setIsPostModalOpen(true)
    } catch (error) {
      console.error('게시글 조회 중 오류 발생', error)
    }
  }

  const closePostModal = () => {
    setIsPostModalOpen(false)
    setSelectedPost(null)
  }

  //글 작성 모달 띄워주기
  const openWritingModal = () => {
    setIsWritingModalOpen(true)
  }

  const closeWritingModal = () => {
    const iswritingConfirmed = window.confirm(
      '정말 나가시겠습니까? 나가시게 되면 작성하시고 계시는 글들이 모두 초기화되는 이슈 발생 삐용',
    )
    if (iswritingConfirmed) {
      setIsWritingModalOpen(false)
      setTitle('')
      setContent('')
    } else {
      console.log('글 작성을 계속합니다')
    }
  }

  //포스트 삭제하기
  const deletepost = async (id) => {
    const isConfirmed = window.confirm('정말 삭제하시겠습니까?')
    if (isConfirmed) {
      try {
        console.log('deleting id', id)
        const response = await fetch(`http://localhost:3001/board/${id}`, {
          method: 'DELETE',
        })

        if (!response.ok) {
          throw new Error('Failed to delete post')
        }
        setPosts((prevPosts) => prevPosts.filter((post) => post._id !== id))
        closePostModal()
        setTimeout(() => {
          alert('삭제완!')
        }, 100) //100밀리초 = 0.1 초
      } catch (error) {
        console.error('삭제 중 오류 발생:', error)
      }
    } else {
      console.log('삭제가 취소되었습니다')
    }
  }

  //좋아요 버튼 구현
  const updatelikes = async (postId) => {
    console.log('좋아요한 포스트 아이디:', postId)

    try {
      const response = await fetch(
        `http://localhost:3001/board/${postId}/like`,
        {
          method: 'PUT',
        },
      )
      // console.log('response status', response.status)
      if (!response.ok) {
        throw new Error('좋아요 수 업데이트 실패함')
      }
      const updatedPost = await response.json()
      console.log('좋아요 업데이트한 포스트:', updatedPost)

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId ? { ...post, likes: updatedPost.likes } : post,
        ),
      )

      if (selectedPost && selectedPost._id === postId) {
        setSelectedPost((prevSelected) => ({
          ...prevSelected,
          likes: updatedPost.likes,
        }))
      }
    } catch (error) {
      console.error('좋아요 업데이트 중 오류 발생함', error)
    }
  }

  //UI 구현하기
  return (
    <div>
      <div className='head'>
        <h1>게시판</h1>
        <button onClick={openWritingModal}>글쓰기</button>
      </div>

      {isWritingModalOpen && ( //글쓰기 모달창
        <div className='modal'>
          <div className='modal-button'>
            <button onClick={closeWritingModal}>X</button>
          </div>
          <div className='modal-content'>
            <form onSubmit={formSubmit}>
              <div className='formhead'>
                <label>제목: </label>
                <input
                  placeholder='제목을 입력해주세요'
                  type='text'
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value)
                    setCharCount(e.target.value.length)
                  }}
                  maxLength={30}
                />
                <p>{charCount}/30</p>
              </div>
              <div className='formbody'>
                <label>내용: </label>
                <textarea
                  placeholder='내용을 입력해주세요'
                  value={content}
                  onChange={(e) => {
                    setContent(e.target.value)
                    setCharContentcount(e.target.value.length)
                  }}
                  maxLength={500}
                />
                <p>{charContentcount}/500</p>
              </div>
              <button type='submit'>업로드</button>
            </form>
          </div>
        </div>
      )}

      {isPostModalOpen && selectedPost && (
        <div className='content-modal'>
          {/* {console.log(selectedPost._id)} */}
          <div className='cmodal-button'>
            <button onClick={closePostModal}>X</button>
          </div>
          <div className='cmodal-content'>
            <h2>{selectedPost.title}</h2>
            <hr />
            <p>{selectedPost.content}</p>
            {selectedPost.contentCharCount >= 10 && ( //조건에 따라 보여지게
              <h3>글자수 : {selectedPost.contentCharCount}/500</h3>
            )}
          </div>
          <div className='likebtn'>
            <button onClick={() => updatelikes(selectedPost._id)}>
              {' '}
              👍 {selectedPost.likes}{' '}
            </button>
          </div>
          <div className='deletebtn'>
            <button onClick={() => deletepost(selectedPost._id)}>
              {' '}
              글 삭제 🗑️
            </button>
          </div>
        </div>
      )}

      <table border='1'>
        <thead>
          <tr>
            <th>번호</th>
            <th>제목</th>
            <th>작성일</th>
            <th>좋아요</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post, index) => (
            <tr key={post._id}>
              {/* {console.log('테이블아이디:', post._id)} */}
              <td>{index + 1}</td>
              <td>
                <span onClick={() => openPostModal(post._id)}>
                  {post.title}
                </span>
              </td>
              <td>{post.date}</td>
              <td>{post.likes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default App2
