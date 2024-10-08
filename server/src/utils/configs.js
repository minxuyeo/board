require('dotenv').config()

const configs = {
  dbPassword: null,
  dbName: null,
  port: null,
  mainDbUri: null,
}

if (process.env.NODE_ENV === 'development') {
  configs.dbName = process.env.DB_NAME_DEV
  configs.dbPassword = process.env.DB_PASSWORD_DEV
  configs.port = process.env.PORT_DEV
  configs.accessTokenSecret = process.env.ACCESS_TOKEN_DEV

  // 로컬 MongoDB 사용 시 URI 변경
  configs.mainDbUri = `mongodb+srv://yang:${configs.dbPassword}@cluster0.25c9p.mongodb.net/${configs.dbName}?readPreference=secondaryPreferred&w=1`
} else if (process.env.NODE_ENV === 'production') {
  configs.dbName = process.env.DB_NAME_PROD
  configs.dbPassword = process.env.DB_PASSWORD_PROD
  configs.port = process.env.PORT_PROD
  configs.accessTokenSecret = process.env.ACCESS_TOKEN_PROD

  // 클러스터 MongoDB URI (생산 환경)
  configs.mainDbUri = `mongodb+srv://${process.env.DB_USER_PROD}:${configs.dbPassword}@cluster0.25c9p.mongodb.net/${configs.dbName}?retryWrites=true&w=majority`
}

// MongoDB URI 확인용 로그
console.log(`MongoDB URI: ${configs.mainDbUri}`)

module.exports = configs
