const { MongoClient, ObjectId } = require('mongodb')
const configs = require('../utils/configs')

const client = new MongoClient(configs.mainDbUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

class boardRepository {
  constructor() {
    this.dbName = 'MIN'
    this.collectionName = 'board'
  }

  async getposts() {
    try {
      await client.connect()
      const db = client.db(this.dbName)
      return await db
        .collection(this.collectionName)
        .find({ deletedAt: null })
        .toArray()
    } finally {
      await client.close()
    }
  }

  async createposts(posts) {
    try {
      await client.connect()
      const db = client.db(this.dbName)
      const timestamp = {
        ...posts,
        createdAt: new Date(),
        deletedAt: null,
      }
      const result = await db
        .collection(this.collectionName)
        .insertOne(timestamp)
      return {
        _id: result.insertedId,
        ...timestamp,
      }
    } finally {
      await client.close()
    }
  }

  async getcontents(postId) {
    try {
      await client.connect()
      const db = client.db(this.dbName)
      const post = await db
        .collection(this.collectionName)
        .findOne({ _id: new ObjectId(postId), deletedAt: null })
      return post
    } finally {
      await client.close()
    }
  }

  async deleteposts(id) {
    try {
      await client.connect()
      const db = client.db(this.dbName)
      await db
        .collection(this.collectionName)
        .updateOne(
          { _id: new ObjectId(id) },
          { $set: { deletedAt: new Date() } },
        )
    } finally {
      await client.close()
    }
  }

  async updatelikes(id) {
    console.log('전달받은 아이디:', id)

    try {
      await client.connect()
      const db = client.db(this.dbName)

      const result = await db
        .collection(this.collectionName)
        .findOneAndUpdate(
          { _id: new ObjectId(id) },
          { $inc: { likes: 1 } },
          { returnDocument: 'after' },
        )

      console.log('좋아요업데이트 결과: ', result) // 전체 결과 출력

      return result
    } finally {
      await client.close()
    }
  }
}

module.exports = new boardRepository()
