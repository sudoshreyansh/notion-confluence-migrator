# Notion To Confluence Migrator

Notion To Confluence Migrator is a web application that migrates all your notion pages to confluence.

- [x] Preserves page heirarchy
- [x] Preserves rich text formatting
- [x] Tested and works with the following elements:
  - Paragraphs
  - Tables 
  - Lists (Unordered & Ordered)
  - Headings
  - Divider
  - Links

 _(Sadly, Heroku stopped their free plan)_ <br />
 Live URL: <br />
 Backend Swagger UI: 
 
 <br />
 
 ## Usage

Before using the web app, you need to generate some tokens for access to the APIs.

 - For Notion:
   - Integration Auth Token: Use this documentation to create Notion Integration and get an Auth Token: [Notion Docs](https://developers.notion.com/docs#step-1-create-an-integration)
 - For Confluence:
   - API Token: Use this link to create a new API Token for Confluence: [Confluence API Tokens](https://id.atlassian.com/manage/api-tokens)
   - Confluence Email: Your account's email address
   - Confluence Domain: Your Confluence domain, eg. https://helloworld.atlassian.net
   - Confluence Workspace Key: Can be found in Space Settings -> Manage Space -> Space Details in Confluence
 
 
You have to then go to the Notion workspace and give the integration you created access to all the pages that you want to migrate to confluence (Note this migrator doesn't work with databases yet!). Notion's docs mention it may take some time to index your changes. Once done, you are ready to run the migrator.

Head to the `frontend` and `backend` directories to start the respective service or use the Hosted URLs. Since Hosting is on Free plan, there might be some limitations in performance and sleep time.

<br />

## Working

- First, all the pages the integration has access to are fetched using the `search` endpoint of Notion's API.
- Each page is then processed one by one.
  - Firstly, all the blocks data are fetched for the page.
  - The blocks are then converted to GitHub style markdown using [notion-to-md](https://www.npmjs.com/package/notion-to-md).
  - It is then converted to Confluence's Wiki style markdown using [@shogobg/markdown2confluence](https://www.npmjs.com/package/@shogobg/markdown2confluence).
  - Finally, using the Confluence API, it's converted to the `storage` format.
  - The new page is created in Confluence with this content as the body.
  - Also, other metadata - title, ancestor, are also taken care of.

<br />

## Tech Stack

#### Backend
- Express JS with TypeScript
- OpenAPI
- NPM Modules:
  - `@notionhq/client` *- for interacting with Notion API*
  - `axios` *- for interacting with Confluence API*
  - `notion-to-md` & `@shogobg/markdown2confluence` *- for transformation of content*

#### Frontend
- Next JS
- Tailwind CSS
- Daisy UI

<br />

## Upcoming Features

- Migrate databases and it's child pages.
- Improved error handling and rate limits handling.
- Preserve more components while migrating.
