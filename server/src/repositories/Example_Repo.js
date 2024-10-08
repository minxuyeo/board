const mongodb = require('../utils/mongodb')

class MainRepo {
  constructor() {
    this.db = mongodb.mainDb
    this.collection = this.db.collection('example')
  }

  async exampleFunction() {
    const result = await this.collection.find({}).toArray()
    return result
  }
}

module.exports = new MainRepo()

//디비와 직접적인 상호작용을 하는 곳임.
// 레포지토리는 직접 디비에 접근해 데이터를 조회하거나 조작함.  (여기서는 몽고디비와 상호작용하는 코드 포함)
//여기서 Examplefunction 메서드는 몽고 디비 컬렉션에서 데이터 조회 후 반환해줌. 이 클래스는 서비스 레이어에서 호출됨
