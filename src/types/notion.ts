// Basic Notion property types for common use cases
export type NotionTitleProperty = {
  title: Array<{
    text: {
      content: string;
    };
  }>;
};

export type NotionRichTextProperty = {
  rich_text: Array<{
    text: {
      content: string;
    };
  }>;
};

export type NotionSelectProperty = {
  select: {
    id: string;
    name: string;
    color: string;
  } | null;
};

export type NotionNumberProperty = {
  number: number | null;
};

export type NotionUrlProperty = {
  url: string | null;
};

export type NotionDateProperty = {
  date: {
    start: string;
    end: string | null;
    time_zone: string | null;
  } | null;
};

// Example type for an Upload entry in Notion
export interface NotionUploadPage {
  id: string;
  properties: {
    Name: NotionTitleProperty;
    Status: NotionSelectProperty;
    Summary: NotionRichTextProperty;
    "File URL": NotionUrlProperty;
    "Created At": NotionDateProperty; // Assuming a 'Created At' property
  };
}

// Example type for a Flashcard entry in Notion
export interface NotionFlashcardPage {
  id: string;
  properties: {
    Question: NotionTitleProperty;
    Answer: NotionRichTextProperty;
    Topic: NotionSelectProperty;
    "Last Reviewed": NotionDateProperty;
  };
}

// Example type for a Quiz entry in Notion
export interface NotionQuizPage {
  id: string;
  properties: {
    Title: NotionTitleProperty;
    Topic: NotionSelectProperty;
    "Number of Questions": NotionNumberProperty;
    "Created At": NotionDateProperty;
    QuestionsContent: NotionRichTextProperty; // Added for quiz questions
  };
}