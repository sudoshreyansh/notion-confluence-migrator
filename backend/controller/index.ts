import Notion from '../service/notion.js'
import Migrator from '../service/migrator.js'
import StatusManager from '../service/status.js'

async function getNotionPages(req, res, next) {
    const NotionClient = new Notion(req.query.notionToken)

    try {
        const notionPages = await NotionClient.getPages();

        res.json({
            pages: notionPages
        })
    } catch (e) {
        next(e)
    }
}

async function migrate(req, res) {
    const migrator = new Migrator(req.body)
    const taskId = StatusManager.getTaskId()
    
    migrator.migrate(taskId)

    res.json({
        taskId
    })
}

function getStatus(req, res) {
    const progress = StatusManager.getProgress(req.query.taskId)
    
    if ( progress ) res.json(progress)
    else res.status(404)
}

export {
    getNotionPages,
    migrate,
    getStatus
}