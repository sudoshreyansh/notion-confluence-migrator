import express from 'express'
import * as controller from '../controller/index.js'

const router = express.Router()

router.get('/pages', controller.getNotionPages)
router.post('/migrate', controller.migrate)
router.get('/status', controller.getStatus)

export default router

