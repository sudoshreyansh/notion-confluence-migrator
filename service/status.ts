import { v4 as uuid } from 'uuid'

type errorDTO = {
    index: number,
    error: string
}

type Progress = {
    status: number,
    completed: number,
    tasks: number,
    errors: errorDTO[]
}

class Status {
    private taskProgress: Map<string, Progress> 

    constructor() {
        this.taskProgress = new Map<string, Progress>;
    }

    getTaskId() {
        return uuid()
    }

    getProgress(taskId: string) {
        return this.taskProgress.get(taskId)
    }

    startProgress(taskId: string, taskCount: number) {
        this.taskProgress.set(taskId, {
            status: 0,
            completed: 0,
            tasks: taskCount,
            errors: []
        })
    }

    updateProgress(taskId: string, error?: errorDTO) {
        const progress = this.taskProgress.get(taskId)
        progress.completed = Math.min(progress.tasks, progress.completed+1)
        if ( error ) progress.errors.push(error)
    }

    completeProgress(taskId: string) {
        const progress = this.taskProgress.get(taskId)
        progress.status = 1
    }
}

const StatusManager = new Status()
export default StatusManager