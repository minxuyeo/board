const Service = require('../services/Example_Service')

class MainController {
  async exampleController() {
    const data = await Service.exampleFunction1()
    const result = await Service.exampleFunction2(data)
    return result
  }

  async login() {
    const logInResult = await Service.login()
    const tokenResult = await Service.getToken(logInResult?._id)
    return { ...logInResult, token: tokenResult }
  }
}

module.exports = new MainController()

//controller는 클라이언트로부터 들어오는 요청 처리, 필요한 경우 비즈니스 로직 수행하도록 service 레이어 호출한다
//이후 서비스로부터 받은 결과를 클라이언트에 응답한다
// 여기서 example controller이라는 변수는 example function 1, example functions 2를 호출해 데이터를 가공하고 그 결과를 반환해줌
//현재 파일에서 내보낼 객체나 함수를 정의하는 데 사용됩니다.
//이 값을 다른 파일에서 require를 통해 가져올 수 있습니다.
