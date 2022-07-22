# Notion To Confluence Migrator

Notion To Confluence Migrator is a CLI tool that migrates all your notion pages to confluence.

- [x] Preserves page heirarchy
- [x] Preserves rich text formatting
- [x] Tested and works with the following elements:
  - Paragraphs
  - Tables 
  - Lists (Unordered & Ordered)
  - Headings
  - Divider
  - Links
- [x] Styled CLI with progress updates
 
 <br />
 
 ## Usage
 ```sh
 yarn install
 yarn build
 ```
 
 Then create a .env file in the root of the project with the following template (An example can be found in .env.example):
 - Use this documentation to create Notion Integration and get an Auth Token: [Notion Docs](https://developers.notion.com/docs#step-1-create-an-integration)
 - Use this link to create a new API Token for Confluence: [Confluence API Tokens](https://id.atlassian.com/manage/api-tokens)
 
 ```
NOTION_AUTH_TOKEN=    # Notion Integration Token
CONFLUENCE_TOKEN=     # Confluence API Token
CONFLUENCE_EMAIL=     # Confluence User Email
CONFLUENCE_DOMAIN=    # Confluence Cloud Domain eg. https://helloworld.atlassian.net/
CONFLUENCE_SPACE=     # Confluence Workspace Key, (can be found in Space Settings -> Manage Space -> Space Details in Confluence)
 ```
 
You have to then go to the Notion workspace and give the integration access to all the pages that you want to migrate to confluence (Note this migrator doesn't work with databases yet!). Notion's docs mention it may take some time to index your changes. Once done, you are ready to run the migrator:

```
yarn start
```

This command starts the migrator, and you would get a screen something like this:

![image](https://user-images.githubusercontent.com/44190883/180447789-a9898bf8-5a0d-4817-96ab-6c6b17984acd.png)

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

- Node JS with TypeScript
- NPM Modules:
  - `@notionhq/client` *- for interacting with Notion API*
  - `axios` *- for interacting with Confluence API*
  - `chalk` & `emojis`
  - `notion-to-md` & `@shogobg/markdown2confluence` *- for transformation of content*
  - `eslint`
  - `dotenv`

<br />

## Upcoming Features

- Migrate databases and it's child pages.
- Improved error handling and rate limits handling.
- Preserve more components while migrating.
