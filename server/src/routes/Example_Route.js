const express = require('express')
const auth = require('../middleware/auth')
const Example_Controller = require('../controllers/Example_Controller')

const router = express.Router()

router.get(
  '/',
  auth,
  wrapAsync((req, res) => {
    return res.status(204).send()
  }),
)

router.get(
  '/example',
  auth,
  wrapAsync(async (req, res) => {
    const result = await Example_Controller.exampleController()
    return res.status(200).json({ status: 200, data: result })
  }),
)

function wrapAsync(fn) {
  return (req, res, next) => {
    fn(req, res, next).catch(next)
  }
}

module.exports = router

//특정 url 경로로 들어오는 요청을 처리할 컨트롤러에 전달한다. 여기에 인증 미들웨어 auth를 포함시켜 요청이 인증된 사용자로부터온것인지 확인
// 예를 들어 get/ 요청이 오면 < auth 미들웨어가 실행되고 통과하면 wrapasync로 감싼 컨트롤러 함수 호출된다.
