import Link from "next/link";
import ReactMarkdown from "react-markdown";

interface MarkdownProps {
  children: string | null | undefined;
}

const Markdown = ({ children }: MarkdownProps) => {
  return (
    <ReactMarkdown
      allowedElements={["ul", "ol", "li", "b", "strong", "em", "i", "a", "br", "p"]}
      components={{
        ul: ({ children }) => <ul className="list-inside list-disc">{children}</ul>,
        ol: ({ children }) => <ol className="list-inside list-decimal">{children}</ol>,
        a: ({ children, href }) => (
          <Link
            href={href!}
            target={href?.startsWith("http") ? "_blank" : undefined}
            rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
            className="break-all underline"
          >
            {children}
          </Link>
        ),
      }}
    >
      {children}
    </ReactMarkdown>
  );
};

export default Markdown;
