import Form from './form'
import Progress from './progress';
import { useState } from 'react'

function Migrator() {
    const [migratorOn, setMigratorOn] = useState(false);
    const [input, setInput] = useState({})

    function onSubmitForm(input) {
        setMigratorOn(true)
        setInput(input)
    }

    return (
        <>
            {
                !migratorOn ? 
                <Form onSubmit={onSubmitForm} /> :
                <Progress config={input} />
            }
        </>
    )
}

export default Migrator