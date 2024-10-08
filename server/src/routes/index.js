const express = require('express')
const jwt = require('jsonwebtoken')

const Controller = require('../controllers/Example_Controller')

const router = express.Router()

router.get(
  '/health-check',
  wrapAsync(async (req, res) => {
    return res.status(200).json({ msg: 'everything good!' })
  }),
)

router.get(
  '/login',
  wrapAsync(async () => {
    const result = await Controller.login()
    return res.status(200).send({ status: 200, ...result })
  }),
)

function wrapAsync(fn) {
  return (req, res, next) => {
    fn(req, res, next).catch(next)
  }
}

module.exports = router
