import Head from 'next/head'
import Migrator from '../src/components'
import Api from '../src/api/index'

export default function Home() {
  return (
    <div className="w-full min-h-screen flex items-start justify-center py-12">
        <div className="card card w-1/3 shadow-xl">
            <div className='card-body'>
                <h2 className="card-title">
                    Notion To Confluence Migrator
                </h2>
                <Migrator />
            </div>
        </div>
    </div>
  )
}
