import { notFound } from "next/navigation";
import { getContent } from "@/lib/serverpathutils";
import { renderMarkdown } from "@/lib/markdown";

export const revalidate = 86400;

interface TermsOfUsePageProps {
  params: {
    locale: string;
  };
}

export default async function TermsOfUsePage({ params }: TermsOfUsePageProps) {
  const legalContent = await getContent("terms-of-use.md", params.locale);

  if (!legalContent) {
    notFound();
  }
  const html = renderMarkdown(legalContent.content);

  return (
    <div className="prose prose-lg dark:prose-invert max-w-4xl mx-[5%] md:mx-auto text-content terms-of-use-content">
      <h1>{legalContent.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
