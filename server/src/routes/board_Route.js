const express = require('express')
const router = express.Router()
const boardController = require('../controllers/board_Controller')

router.get('/', boardController.getposts)

router.post('/', boardController.createposts)

router.get('/:id', boardController.getcontents)

router.put('/:id/like', boardController.updatelikes)

router.delete('/:id', boardController.deleteposts)

module.exports = router
