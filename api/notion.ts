import { Client as NotionClient, iteratePaginatedAPI } from '@notionhq/client'
import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints'
import { NotionToMarkdown } from 'notion-to-md'

export type Page = {
    id: string,
    title: string,
    parentId?: string
}

class Notion {
    private _client: NotionClient;
    private _markdownGenerator: NotionToMarkdown;

    constructor(authToken: string) {
        this._client = new NotionClient({
            auth: authToken
        })

        this._markdownGenerator = new NotionToMarkdown({
            notionClient: this._client
        })
    }

    async getPages(): Promise<Page[]> {
        let results = [], response
        do {
            response =  await this._client.search({
                filter: {
                    property: 'object',
                    value: 'page'
                },
                start_cursor: response && response.next_cursor
            })

            results = results.concat(response.results)
        } while ( response.has_more )

        const pages = results
            .filter((result: PageObjectResponse) =>
                result.object === 'page' && 
                result.parent.type === 'workspace' || result.parent.type === 'page_id' 
            )
            .map(async (result: PageObjectResponse) => {
                const res = await this._client.pages.properties.retrieve({
                    page_id: result.id,
                    property_id: 'title'
                })
                
                const id = result.id
                const title = (
                    res.object === 'list' && 
                    res.results[0].type === 'title' && 
                    res.results[0].title.plain_text
                )
                const parentId = result.parent.type === 'page_id' && result.parent.page_id

                return { id, title, parentId }
            })

        return Promise.all(pages)
    }

    async getMarkdownData(id: string): Promise<string> {
        const markdownBlocks = await this._markdownGenerator.pageToMarkdown(id)
        const markdown = await this._markdownGenerator.toMarkdownString(markdownBlocks)
        return markdown
    }
}

export default Notion