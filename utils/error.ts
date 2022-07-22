class CustomError extends Error {
    errorCode: number;

    constructor(error: any) {
        let message = "There was an error while processing this request.", code = 500;
        switch ( error.name ) {
            case 'APIResponseError':
                code = error.status
                message = error.message
                break
            case 'AxiosError':
                message = error.response.data.message.split(':')[1]
                code = error.response.data.statusCode
                break
        }

        super(message)
        this.errorCode = code
    }
}

export default CustomError