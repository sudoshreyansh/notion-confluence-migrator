import * as dotenv from 'dotenv'
dotenv.config()

import Migrator from './api/migrator.js'
import * as Logger from './utils/logger.js'

(async () => {
    const notionAuthToken = process.env.NOTION_AUTH_TOKEN
    const confluenceToken = process.env.CONFLUENCE_TOKEN
    const confluenceEmail = process.env.CONFLUENCE_EMAIL
    const confluenceDomain = process.env.CONFLUENCE_DOMAIN
    const confluenceSpace = process.env.CONFLUENCE_SPACE

    Logger.logIntro()

    if (
        !notionAuthToken ||
        !confluenceToken ||
        !confluenceEmail ||
        !confluenceDomain || 
        !confluenceSpace
    ) {
        Logger.logError('Environment variables are missing!')
        console.log()
        return;
    }

    Logger.logPrerequisitesFound()

    const migrator = new Migrator(notionAuthToken, confluenceDomain, confluenceEmail, confluenceToken, confluenceSpace)
    await migrator.migrate()
})()