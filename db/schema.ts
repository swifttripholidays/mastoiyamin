import { boolean, integer, pgTable, text } from 'drizzle-orm/pg-core';

export const posts = pgTable('posts', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  excerpt: text('excerpt').notNull(),
  content: text('content').notNull(),
  category: text('category').notNull().default('Perspective'),
  status: text('status').notNull().default('draft'),
  featured: boolean('featured').notNull().default(false),
  coverUrl: text('cover_url'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
  publishedAt: text('published_at'),
});

export const messages = pgTable('messages', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  message: text('message').notNull(),
  status: text('status').notNull().default('new'),
  createdAt: text('created_at').notNull(),
});

export const media = pgTable('media', {
  id: text('id').primaryKey(),
  key: text('key').notNull().unique(),
  filename: text('filename').notNull(),
  contentType: text('content_type').notNull(),
  size: integer('size').notNull(),
  createdAt: text('created_at').notNull(),
});

export const chatSessions = pgTable('chat_sessions', {
  id: text('id').primaryKey(),
  visitorName: text('visitor_name').notNull(),
  visitorToken: text('visitor_token').notNull().unique(),
  status: text('status').notNull().default('ai'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
  lastMessageAt: text('last_message_at').notNull(),
});

export const chatMessages = pgTable('chat_messages', {
  id: text('id').primaryKey(),
  sessionId: text('session_id').notNull().references(() => chatSessions.id, { onDelete: 'cascade' }),
  sender: text('sender').notNull(),
  body: text('body').notNull(),
  createdAt: text('created_at').notNull(),
});
