import chalk from 'chalk'
import emojis from 'emojis'
import { stdout } from 'process'
import { Page } from '../api/notion'

const primaryColor = '#08d2a1'
const bgPrimary = chalk.bgHex(primaryColor)
const fgPrimary = chalk.hex(primaryColor)

const moveCursor = (dx: number, dy: number) => {
    return new Promise<void>((resolve, reject) => {
        stdout.moveCursor(dx, dy, () => resolve())
    })
}

const clearLine = () => {
    return new Promise<void>((resolve, reject) => {
        stdout.clearLine(0, () => resolve())
    })
}

const cursorTo = (x: number, y?: number) => {
    return new Promise<void>((resolve, reject) => {
        stdout.cursorTo(x, y, () => resolve())
    })
}
 
export const logIntro = () => {
    stdout.write("\x1B[?25l")
    console.log()
    console.log()
    console.group()
    console.log(bgPrimary.black.bold(
        ' Notion To Confluence Migrator '
    ))
    console.log(
        '              - Shreyansh Jain'
    )
    console.groupEnd()
    console.log()
}

export const logPrerequisitesFound = async () => {
    console.log(chalk.gray('✓', ' Found required environment variables'))
    console.log(chalk.whiteBright('⟳', ' Fetching Notion Pages'))
}

export const logFetchedPages = async (pages: Page[]) => {
    await moveCursor(0, -1)
    await clearLine()
    
    console.log(chalk.gray('✓', ' Fetched Notion Pages'))
    console.log(chalk.whiteBright(' ', ' Migrating...'))
    console.log()
    console.group()

    for ( let page of pages ) {
        console.log(chalk.whiteBright('  ', page.title))
    }

    console.groupEnd()
}

export const updatePageStatus = async (pages: Page[], i: number, status: number) => {
    const count = pages.length
    const dy = (count - i) * -1
    await moveCursor(0, dy)
    await clearLine()
    await cursorTo(2)

    let symbol
    switch ( status ) {
        case -1:
            symbol = emojis.unicode(':warning:')
            break
        case 0:
            symbol = '⟳'
            break
        case 1:
            symbol = '✓'
            break
    }

    console.log(chalk.gray(symbol, '', pages[i].title))

    await moveCursor(0, (dy * -1) - 1)
}

export const logCompletion = async (pages) => {
    const count = pages.length
    await moveCursor(0, -(count + 2))
    await clearLine()
    
    console.log(chalk.gray('✓', ' Migrated successfully!'))
    
    await moveCursor(0, count + 1)

    console.log(fgPrimary('✓', ' Migrated all pages successfully!'))
    console.log()
}

export const logCompletionError = async (pages, errors) => {
    console.log()

    for ( const error of errors ) {
        logError(`${pages[error.index].title.trim()}: ${error.error.message}`)
    }

    console.log()
}

export const logError = (error: string) => {
    console.log(emojis.unicode(':warning:'), '', chalk.red(error))
}