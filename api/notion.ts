import { Client as NotionClient } from '@notionhq/client'
import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints'
import { NotionToMarkdown } from 'notion-to-md'

type Page = {
    id: string,
    title: string,
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
        const response = await this._client.search({
            filter: {
                property: 'object',
                value: 'page'
            },
        })

        const pages = response.results
            .filter((result: PageObjectResponse) =>
                result.object === 'page' && 
                result.parent.type === 'workspace' 
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

                return { id, title }
            })

        return Promise.all(pages)
    }

    async getMarkdownData(id: string): Promise<string> {
        const markdownBlocks = await this._markdownGenerator.pageToMarkdown(id)
        const markdownString = await this._markdownGenerator.toMarkdownString(markdownBlocks)
        return markdownString
    }
}

export default Notion