import { useEffect, useState, useRef } from "react"
import Api from "../api"

function renderChildPages(children) {
    const childView = Object.keys(children).map(id => (
        <div className="pl-2" key={id}>
            {children[id].title}<br />
            {renderChildPages(children[id].children)}
        </div>
    ))

    return childView
}

function Progress({ config }) {
    const [taskCount, setTaskCount] = useState(-1)
    const [completedCount, setCompletedCount] = useState(0)
    const [status, setStatus] = useState('Starting Migrator...')
    const [pageStructure, setPageStructure] = useState({})
    const [flattenPageStructure, setFlattenPageStructure] = useState([])
    const [errors, setErrors] = useState([])
    const runningStatus = useRef(0)
    const migratorTaskId = useRef('')
    const refreshInterval = useRef(0)

    async function startMigrator() {
        if ( runningStatus.current === 0 ) runningStatus.current = 1
        else return;

        const client = await Api.getClient()
        
        let res
        try {
            res = await client.getNotionPages({
                notionToken: config.notionToken
            })
        } catch ( e ) {
            setErrors([{
                index: -1,
                error: 'There is an error processing this request.'
            }])
            return
        }
        
        const pages = res.data.pages
        if ( Object.keys(pages).length === 0 ) {
            setErrors([{
                index: -1,
                error: 'No Notion pages found for migration!'
            }])
            return;
        }

        try {
            res = await client.startMigrationTask({}, config)
        } catch ( e ) {
            setErrors([{
                index: -1,
                error: 'There is an error processing this request.'
            }])
            return
        }

        const tree = {}
        for ( const page of pages ) {
            const pageObj = {
                title: page.title,
                children: {}
            }

            if ( page.parentId ) {
                tree[page.parentId].children[page.id] = pageObj
            } else {
                tree[page.id] = pageObj
            }
        }

        migratorTaskId.current = res.data.taskId
        setTaskCount(pages.length)
        setStatus('Migrating documents....')
        setPageStructure(tree)
        setFlattenPageStructure(pages)

        refreshInterval.current = setInterval(async () => {
            try {
                const res = await client.getMigrationTaskStatus({
                    taskId: migratorTaskId.current,
                    timestamp: Date.now()
                })
                setCompletedCount(res.data.completed)
                setErrors(res.data.errors)
                console.log(res.data)
    
                if ( res.data.status === 1 ) {
                    clearInterval(refreshInterval.current)
                    setStatus('Migration complete')
                    refreshInterval.current = 0
                }
            } catch (e) {
                clearInterval(refreshInterval.current)
                setErrors((state) => [...state, 'Invalid Task ID'])
                refreshInterval.current = 0
            }
        }, 1000)
    }

    useEffect(() => {
        startMigrator()

        return () => {
            if ( refreshInterval.current ) {
                clearInterval(refreshInterval.current)
                refreshInterval.current = 0
            }
        }
    }, [])

    const pagesView = renderChildPages(pageStructure)

    return (
        <div className="mt-2">
            <progress 
                className="progress progress-success h-3 w-full" 
                value={taskCount === -1 ? 0 : completedCount} 
                max={taskCount === -1 ? 100 : taskCount}></progress>
            <div className="flex justify-between">
                <div className="">{status}</div>
                {taskCount >= 0 && <div className="">{completedCount}/{taskCount}</div>}
            </div>
            <div className="bg-base-300 mt-4 p-2">
                {
                    pagesView.length > 0 ?
                    <div className="mb-4">
                        {pagesView}
                    </div> :
                    <></>
                }
                {
                    errors.length > 0 ?
                    <div className="mb-4">
                        {errors.map((error, i) => (
                            <div className="text-error ml-2" key={i}>
                                {error.index >= 0 ? flattenPageStructure[error.index].title + ': ' : ''}{error.error}
                            </div>
                        ))}
                    </div> :
                    <></>
                }
                {
                    status === 'Migration complete' ?
                    (errors.length > 0 ?
                    <div className="text-error pl-2 mb-4">There were errors, please refresh to start the migrator again.</div> :
                    <div className="text-success pl-2 mb-4">Migration completed successfully!</div>) :
                    <></>
                }
                <div className="-mt-4"></div>
            </div>
        </div>
    )
}

export default Progress