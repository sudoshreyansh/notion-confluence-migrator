import * as dotenv from 'dotenv'
dotenv.config()

import Notion from './api/notion'
import Confluence from './api/confluence'

(async () => {
    const notionAuthToken = process.env.NOTION_AUTH_TOKEN
    const confluenceToken = process.env.CONFLUENCE_TOKEN
    const confluenceEmail = process.env.CONFLUENCE_EMAIL
    const confluenceDomain = process.env.CONFLUENCE_DOMAIN
    
    const notion = new Notion(notionAuthToken)
    const confluence = new Confluence(confluenceDomain, confluenceEmail, confluenceToken, 'WORKSPACE')

    // await confluence.test()
    const pages = await notion.getPages()
    const markdown = await notion.getMarkdownData(pages[0].id)
    console.log(markdown)
    const body = await confluence.convertBody(markdown)
    console.log(body)
    // console.log(await confluence.createPage(pages[0].id, pages[0].title, body))
})()