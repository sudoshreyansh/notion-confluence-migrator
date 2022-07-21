import axios, { AxiosInstance } from "axios";

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
        const convertBodyUri = '/wiki/rest/api/contentbody/convert/storage'
        const data = {
            value: markdown,
            representation: 'wiki'
        }

        const res = await this._client.post(convertBodyUri, data)
        return res.data.value
    }

    async createPage(id: string, title: string, body: string) {
        const createPageUri = '/wiki/rest/api/content'
        const data = {
            //id,
            title,
            type: 'page',
            space: this._space,
            body: {
                storage: {
                    value: body,
                    representation: 'storage'
                }
            }
        }
        
        let res
        try {
            res = await this._client.post(createPageUri, data)
        } catch ( e ) {
            console.log(e)
        }
        return res.data
    }
}

export default Confluence