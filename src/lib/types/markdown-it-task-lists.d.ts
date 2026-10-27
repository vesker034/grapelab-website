declare module 'markdown-it-task-lists' {
  import { PluginWithOptions } from 'markdown-it';
  const markdownItTaskLists: PluginWithOptions<{ enabled?: boolean }>;
  export default markdownItTaskLists;
}
