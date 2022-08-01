import { useState } from 'react'

function Form({ onSubmit }) {
    const [input, setInput] = useState({
        notionToken: '',
        confluenceBaseUri: '',
        confluenceUsername: '',
        confluenceToken: '',
        confluenceSpace: ''
    })

    function handleChange(inputName) {
        return (e) => {
            setInput((state) => ({
                ...state,
                [inputName]: e.target.value
            }))
        }
    }

    function handleSubmit() {
        const valid = Object.keys(input).every((key) => input[key] && input[key] !== '')
        if ( valid ) {
            onSubmit(input)
        }   
    }

    return (
        <div className="form-control w-full">
            <label className="label">
                <span className="label-text">Notion Integration Auth Token<span className='text-red-500'>*</span></span>
            </label>
            <input type="text" placeholder="Type here" required={true} className="input input-bordered w-full mb-3" value={input.notionToken} onChange={handleChange('notionToken')} />
            <label className="label">
                <span className="label-text">Confluence Token<span className='text-red-500'>*</span></span>
            </label>
            <input type="text" placeholder="Type here" required={true} className="input input-bordered w-full mb-3" value={input.confluenceToken} onChange={handleChange('confluenceToken')}  />
            <label className="label">
                <span className="label-text">Confluence Email<span className='text-red-500'>*</span></span>
            </label>
            <input type="text" placeholder="Type here" required={true} className="input input-bordered w-full mb-3" value={input.confluenceUsername} onChange={handleChange('confluenceUsername')}  />
            <label className="label">
                <span className="label-text">Confluence Domain<span className='text-red-500'>*</span></span>
            </label>
            <input type="text" placeholder="Type here" required={true} className="input input-bordered w-full mb-3" value={input.confluenceBaseUri} onChange={handleChange('confluenceBaseUri')}  />
            <label className="label">
                <span className="label-text">Confluence Workpace Key<span className='text-red-500'>*</span></span>
            </label>
            <input type="text" placeholder="Type here" required={true} className="input input-bordered w-full mb-6" value={input.confluenceSpace} onChange={handleChange('confluenceSpace')}  />

            <button className='btn btn-active btn-primary' onClick={handleSubmit}>Start Migrator!</button>
        </div>
    )
}

export default Form