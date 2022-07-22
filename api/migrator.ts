import Notion from './notion.js'
import Confluence from './confluence.js'
import * as Logger from '../utils/logger.js'
import CustomError from '../utils/error.js';

type CustomErrorStorage = {
    index: number,
    error: CustomError
}

class Migrator {
    private _notion: Notion
    private _confluence: Confluence
    private _errors: CustomErrorStorage[]
    private _notionToConfluenceIds: Map<string, string>

    constructor(
        notionToken: string, 
        confluenceBaseUri: string, 
        confluenceUsername: string, 
        confluenceToken: string, 
        confluenceSpace: string
    ) {
        this._notion = new Notion(notionToken)
        this._confluence = new Confluence(confluenceBaseUri, confluenceUsername, confluenceToken, confluenceSpace)
        this._errors = []
        this._notionToConfluenceIds = new Map<string, string>
    }

    private async migratePage(id: string, title: string, parentId?: string) {
        try {
            const markdown = await this._notion.getMarkdownData(id)
            const confluenceMarkdown = await this._confluence.convertBody(markdown)
            return await this._confluence.createPage(title, confluenceMarkdown, parentId)
        } catch ( e ) {
            throw new CustomError(e)
        }
    }

    async migrate() {
        let pages
        try {
            pages = await this._notion.getPages()
        } catch ( e ) {
            console.log()
            Logger.logError(e.message)
            console.log()
            return
        }

        await Logger.logFetchedPages(pages)
        const count = pages.length

        for ( let i = 0; i < count; i++ ) {
            try {
                await Logger.updatePageStatus(pages, i, 0)

                const parentId = this._notionToConfluenceIds.get(pages[i].parentId)
                const confluenceId = await this.migratePage(pages[i].id, pages[i].title, parentId)
                this._notionToConfluenceIds.set(pages[i].id, confluenceId)
                
                await Logger.updatePageStatus(pages, i, 1)

            } catch ( e ) {
                this._errors.push({
                    index: i,
                    error: e
                })

                await Logger.updatePageStatus(pages, i, -1)
            }
        }

        if ( this._errors.length > 0 ) await Logger.logCompletionError(pages, this._errors)
        else await Logger.logCompletion(pages)
    }
}

export default Migrator