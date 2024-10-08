const { MongoClient, ObjectId } = require('mongodb')
const configs = require('../utils/configs') // configs.js에서 MongoDB URI를 가져옴

const client = new MongoClient(configs.mainDbUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

class TodoRepository {
  constructor() {
    this.dbName = 'MIN'
    this.collectionName = 'todo'
  }
  //여기서 constructor은 '생성자 함수'를 의미한다. 클래스를 처음생성하고
  // 새로운 객체를 만들 때 자동으로 호출 / 이 함수안에서 이 클래스가 가지고있을 초기 데이터를 정의해준다

  async getTodos() {
    try {
      await client.connect() //데이터베이스 연결
      const db = client.db(this.dbName)
      return await db
        .collection(this.collectionName)
        .find({ deletedAt: null }) // deletedAt이 null인 항목만 가져옴
        // .sort({ createdAt: -1 }) // 내림차순 정렬 하기 (-1)/ 최신항목이 먼저 오도록
        .toArray() //가져온 데이터 배열로 반환
    } finally {
      await client.close()
    }
  }

  async createTodo(todo) {
    try {
      await client.connect()
      const db = client.db(this.dbName)
      const todoWithTimestamp = {
        ...todo,
        createdAt: new Date(), // 생성 시간 추가
        deletedAt: null, // 삭제 시간 초기화
      }
      const result = await db
        .collection(this.collectionName)
        .insertOne(todoWithTimestamp)
      console.log('deleteresult:', result)
      return {
        _id: result.insertedId,
        ...todoWithTimestamp,
      }
    } finally {
      await client.close()
    }
  }

  //로그남기기
  async deleteTodo(id) {
    try {
      await client.connect()
      const db = client.db(this.dbName)
      await db.collection(this.collectionName).updateOne(
        { _id: new ObjectId(id) },
        { $set: { deletedAt: new Date() } }, //특정필드 업데이트
      )
    } finally {
      await client.close()
    }
  }

  //모든 투두 항목 삭제
  async deleteAllTodo() {
    try {
      await client.connect()
      const db = client.db(this.dbName)
      const result = await db.collection(this.collectionName).updateMany(
        //여러 문서를 업데이트
        { deletedAt: null }, //아직 삭제되지 않은 항목만 삭제
        { $set: { deletedAt: new Date() } }, // 삭제 시간 설정
      )
      return result
    } finally {
      await client.close()
    }
  }

  async updateTodo(id, updateData) {
    try {
      await client.connect()
      const db = client.db(this.dbName)
      const result = await db.collection(this.collectionName).findOneAndUpdate(
        { _id: new ObjectId(id) }, // ID를 ObjectId로 변환해서 조회 (그래야 서버가 읽음)
        { $set: updateData },
        { returnOriginal: false },
      )

      if (!result.value) {
        // 투두가 존재하지 않는 경우 에러 반환
        return { error: 'Todo not found' }
      }

      return result.value
    } finally {
      await client.close()
    }
  }

  //   async updateAllTodos(done) {
  //     try {
  //       await client.connect()
  //       const result = await client
  //         .db(this.dbName)
  //         .collection(this.collectionName)
  //         .updateMany({ deletedAt: null }, { $set: { done } })
  //       const updatedTodos = await this.getTodos()
  //       return updatedTodos
  //     } finally {
  //       await client.close()
  //     }
  //   }
  // }
  async updateAllTodos(done) {
    try {
      await client.connect()
      await client
        .db(this.dbName)
        .collection(this.collectionName)
        .updateMany({ deletedAt: null }, { $set: { done } }) // 모든 투두의 done 상태 업데이트
      return await this.getTodos() // 업데이트된 투두 리스트 반환
    } finally {
      await client.close()
    }
  }
}

module.exports = new TodoRepository()
