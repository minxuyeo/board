const express = require('express')
const app = express()
const compression = require('compression')
const nunjucks = require('nunjucks')
const cors = require('cors')
const path = require('path')
const mongoose = require('mongoose')

const configs = require('./src/utils/configs')
const indexRouter = require('./src/routes/index')
//투두 라우터 추가
const todoRouter = require('./src/routes/todo_route')
const exampleRouter = require('./src/routes/Example_Route')

//게시판 라우터 추가
const boardRouter = require('./src/routes/board_Route')

// 미들웨어 설정
app.use(cors())
app.set('view engine', 'ejs')
app.engine('html', require('ejs').renderFile)
app.use(express.json({ limit: '200mb' }))
app.use(
  express.urlencoded({
    limit: '200mb',
    extended: false,
    parameterLimit: 50000,
  }),
)

// Nunjucks 설정
nunjucks.configure('./src/views', {
  express: app,
  watch: true,
})

// 압축 미들웨어 설정
app.use(compression())

// 정적 파일 제공 경로 설정
app.use(express.static(path.join(__dirname, 'public')))

// 라우터 설정
app.use('/', indexRouter)
app.use('/todo', todoRouter) // 투두 루트에 투두 라우터 연결
app.use('/example', exampleRouter)
app.use('/board', boardRouter) // 보드 루트에 보드 라우터 연결

// 기본 라우트 설정
app.get('/', (req, res) => {
  return res.status(200).json({ msg: 'hello world' })
})

// MongoDB 연결 후 서버 시작
mongoose
  .connect(configs.mainDbUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB')
    const PORT = process.env.PORT || configs.port
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`)
    })
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error)
  })

module.exports = app
