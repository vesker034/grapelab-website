import MarkdownIt from 'markdown-it';
import * as markdownItEmoji from 'markdown-it-emoji';
import markdownItFootnote from 'markdown-it-footnote';
import markdownItHighlightjs from 'markdown-it-highlightjs';
import markdownItTaskLists from 'markdown-it-task-lists';
import { useMemo } from 'react';


function getMarkdownIt() {
  const instance = new MarkdownIt({
    html: false, // запрещает встроенный HTML
    linkify: true, // превращает ссылки в кликабельные
    typographer: true, // типографические кавычки и тире
    breaks: true, // \n -> <br>
  });

  instance
    .use(markdownItHighlightjs)
    .use(markdownItEmoji.light)
    .use(markdownItFootnote)
    .use(markdownItTaskLists, { enabled: true });
    return instance;
}

/**
 * Преобразует Markdown в HTML с расширениями, подходящими для блогов.
 * @param markdown — исходный Markdown-текст
 * @returns HTML строка (safe для dangerouslySetInnerHTML)
 */
export function useMarkdown(markdown: string) {
  const md = useMemo(getMarkdownIt, []);

  return useMemo(() => md.render(markdown ?? ''), [md, markdown]);
}

/**
 * Экранирует нумерацию вида "2.2." в юридических документах,
 * чтобы markdown-it не воспринимал её как ordered list и не ломал ul после ":".
 */
function prepareLegalMarkdown(markdown: string): string {
  return markdown.replace(/^(\d+)\.(\d+)\.\s/gm, '$1\\.$2\\. ');
}

/**
 * Преобразует Markdown в HTML с расширениями, подходящими для блогов.
 * Работает на сервере (без React).
 */
export function renderMarkdown(markdown: string): string {
  return getMarkdownIt().render(markdown ?? '');
}

/**
 * Markdown для privacy-policy / terms-of-use с корректной нумерацией пунктов.
 */
export function renderLegalMarkdown(markdown: string): string {
  return getMarkdownIt().render(prepareLegalMarkdown(markdown ?? ''));
}