import * as dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import router from './routes/index.js'
import bodyParser from 'body-parser'
import swaggerUi from 'swagger-ui-express'
import YAML from 'yamljs'
import * as OpenApiValidator from 'express-openapi-validator'
import cors from 'cors'

const app = express()
const port = process.env.PORT
const swaggerDocument = YAML.load('./openapi.yaml')

app.set('etag', false)
app.use(bodyParser.json())

app.use(cors())
app.options('*', (req, res, next) => {console.log('hello'); next();}, cors())

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
app.use(
    OpenApiValidator.middleware({
        apiSpec: './openapi.yaml',
        validateRequests: true,
        validateResponses: true,
    }),
)

app.use('/api', router)
app.use((req, res) => res.sendStatus(404))

app.use((err, req, res, next) => {
    res.status(500).json({
        message: err.message,
        errors: err.errors,
    })
})
  

app.listen(port, () => console.log(`Listening on port ${port}`))
