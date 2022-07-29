import Notion from './notion.js'
import Confluence from './confluence.js'
import CustomError from '../utils/error.js'
import StatusManager from './status.js'

class Migrator {
    private _notion: Notion
    private _confluence: Confluence
    private _notionToConfluenceIds: Map<string, string>

    constructor(
        {
            notionToken, 
            confluenceBaseUri,
            confluenceUsername,
            confluenceToken,
            confluenceSpace
        }: {
            notionToken: string, 
            confluenceBaseUri: string, 
            confluenceUsername: string, 
            confluenceToken: string, 
            confluenceSpace: string
        }
    ) {
        this._notion = new Notion(notionToken)
        this._confluence = new Confluence(confluenceBaseUri, confluenceUsername, confluenceToken, confluenceSpace)
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

    async migrate(taskId: string) {
        let pages
        try {
            pages = await this._notion.getPages()
        } catch ( e ) {
            StatusManager.startProgress(taskId, 0)
            StatusManager.updateProgress(taskId, {
                index: -1,
                error: e.message
            })
            StatusManager.completeProgress(taskId)
            return
        }

        const count = pages.length
        StatusManager.startProgress(taskId, count)

        for ( let i = 0; i < count; i++ ) {
            try {
                const parentId = this._notionToConfluenceIds.get(pages[i].parentId)
                const confluenceId = await this.migratePage(pages[i].id, pages[i].title, parentId)
                this._notionToConfluenceIds.set(pages[i].id, confluenceId)
                
                StatusManager.updateProgress(taskId)
            } catch ( e ) {
                StatusManager.updateProgress(taskId, {
                    index: i,
                    error: e.message
                })
            }
        }

        StatusManager.completeProgress(taskId)
    }
}

export default Migrator