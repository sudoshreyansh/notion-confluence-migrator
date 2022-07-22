import axios, { AxiosInstance } from "axios"
import markdownToConfluence from '@shogobg/markdown2confluence'
import CustomError from '../utils/error.js'

class Confluence {
    private _client: AxiosInstance;
    private _space: object;

    constructor(baseUri: string, username: string, token: string, space: string) {
        this._client = axios.create({
            baseURL: baseUri,
            auth: {
                username,
                password: token
            },
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })

        this._space = {
            key: space
        }
    }

    async convertBody(markdown: string) {
        const wikiMarkdown = markdownToConfluence(markdown)

        const convertBodyUri = '/wiki/rest/api/contentbody/convert/storage'
        const data = {
            value: wikiMarkdown,
            representation: 'wiki'
        }

        const res = await this._client.post(convertBodyUri, data)
        return res.data.value
    }

    async createPage(title: string, body: string, parentId?: string) {
        const createPageUri = '/wiki/rest/api/content'
        const data = {
            title,
            type: 'page',
            space: this._space,
            body: {
                storage: {
                    value: body,
                    representation: 'storage'
                }
            },
            ...(parentId && {
                ancestors: [{
                    id: parentId
                }]
            })
        }
        
        const res = await this._client.post(createPageUri, data)
        return res.data.id
    }
}

export default Confluence