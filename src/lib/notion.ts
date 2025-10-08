import { Client } from '@notionhq/client';

const notionApiKey = import.meta.env.VITE_NOTION_API_KEY;

if (!notionApiKey) {
  console.error("Notion API Key is missing. Please check your .env file.");
}

export const notion = new Client({ auth: notionApiKey });

// You will need to create these databases in Notion and get their IDs
export const NOTION_DATABASE_ID_UPLOADS = import.meta.env.VITE_NOTION_DATABASE_ID_UPLOADS;
export const NOTION_DATABASE_ID_FLASHCARDS = import.meta.env.VITE_NOTION_DATABASE_ID_FLASHCARDS;
export const NOTION_DATABASE_ID_QUIZZES = import.meta.env.VITE_NOTION_DATABASE_ID_QUIZZES;

if (!NOTION_DATABASE_ID_UPLOADS || !NOTION_DATABASE_ID_FLASHCARDS || !NOTION_DATABASE_ID_QUIZZES) {
  console.warn("One or more Notion Database IDs are missing. Please ensure they are set in your .env file.");
}