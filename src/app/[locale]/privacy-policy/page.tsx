import { notFound } from "next/navigation";
import { getContent } from "@/lib/serverpathutils";
import { renderLegalMarkdown } from "@/lib/markdown";

export const revalidate = 86400;

interface PrivacyPolicyPageProps {
  params: {
    locale: string;
  };
}

export default async function PrivacyPolicyPage({
  params,
}: PrivacyPolicyPageProps) {
  const legalContent = await getContent("privacy-policy.md", params.locale);

  if (!legalContent) {
    notFound();
  }
  const html = renderLegalMarkdown(legalContent.content);

  return (
    <div className="prose prose-lg dark:prose-invert max-w-4xl mx-[5%] md:mx-auto text-content privacy-policy-content">
      <h1>{legalContent.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
