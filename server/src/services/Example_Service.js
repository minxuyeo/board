const jwt = require('jsonwebtoken')
const configs = require('../utils/configs')
const MainRepo = require('../repositories/Example_Repo')

class MainService {
  async exampleFunction1() {
    const result = await MainRepo.exampleFunction()
    return result
  }

  async exampleFunction2(data) {
    return data.filter((elem) => !!elem)
  }

  async getToken(userId) {
    const tokenPayload = { user: { id: userId } }
    const token = jwt.sign(tokenPayload, configs.accessTokenSecret)
    return token
  }
}

module.exports = new MainService()

//서비스는 비즈니스 로직을 구현하는 레이어이다. 데이터베이스 작업을 위해 Repository를 호출하고, 필요한 추가적인 로직을 수행한다.
// examplefunction 1은 메인 레포에서 데이터를 가져와서 결과 반환하고 / examplefunction 2는 데이터를 필터링한다.
//gettoken은 jwt토큰을 생성한다.
