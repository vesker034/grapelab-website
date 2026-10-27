import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

export async function getContent(fileName: string, locale: string) {
  try {
    const filePath = path.join(
      process.cwd(),
      'src',
      'messages',
      'content',
      locale,
      fileName
    );
    const fileContent = await fs.readFile(filePath, 'utf8');
    const { data, content } = matter(fileContent);
    return { title: data.title, content };
  } catch (error) {
    console.error(
      `Error reading content for ${fileName} in locale ${locale}:`,
      error
    );
    return null;
  }
}
