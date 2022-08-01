import OpenAPIClientAxios from 'openapi-client-axios';

const api = new OpenAPIClientAxios({ definition: 'http://localhost:3000/openapi.yaml', withServer: 0 });
api.withServer({ url: 'http://localhost:3001/', description: 'Local Server' })
api.init();

export default api