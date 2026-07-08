"use client";

import type { ComponentPropsWithoutRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";

function ScrollableTable({ children, ...props }: ComponentPropsWithoutRef<"table">) {
  return (
    <div className="my-6 w-full overflow-x-auto rounded-xl border border-border">
      <table {...props} className="min-w-full border-collapse text-sm">
        {children}
      </table>
    </div>
  );
}

function TableHeaderCell({ children, ...props }: ComponentPropsWithoutRef<"th">) {
  return (
    <th
      {...props}
      className="border-b border-border bg-muted px-4 py-3 text-left align-top font-semibold text-foreground"
    >
      {children}
    </th>
  );
}

function TableCell({ children, ...props }: ComponentPropsWithoutRef<"td">) {
  return (
    <td
      {...props}
      className="border-t border-border/60 px-4 py-3 align-top text-foreground"
    >
      {children}
    </td>
  );
}

export function MarkdownContent({ content }: { content: string }) {
  return (
    <div className="prose prose-slate max-w-none
      prose-headings:font-display prose-headings:text-foreground prose-headings:font-bold
      prose-h1:text-3xl prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:scroll-mt-28
      prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3 prose-h3:scroll-mt-28
      prose-p:text-foreground prose-p:leading-relaxed prose-p:text-base
      prose-a:text-accent prose-a:no-underline hover:prose-a:underline
      prose-strong:text-foreground prose-strong:font-semibold
      prose-ul:my-4 prose-li:text-foreground prose-li:leading-relaxed
      prose-ol:my-4
      prose-blockquote:border-l-4 prose-blockquote:border-primary/30 prose-blockquote:bg-primary/5 prose-blockquote:rounded-r-xl prose-blockquote:py-1 prose-blockquote:not-italic
      prose-blockquote:text-muted-foreground
      prose-code:text-accent prose-code:bg-muted prose-code:rounded prose-code:px-1 prose-code:text-sm prose-code:font-mono
      prose-pre:bg-muted prose-pre:rounded-xl prose-pre:border prose-pre:border-border
      prose-img:rounded-xl prose-img:border prose-img:border-border
      prose-hr:border-border prose-hr:my-8
      prose-table:text-sm prose-th:bg-muted prose-th:text-foreground prose-table:my-0
    ">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug]}
        components={{ table: ScrollableTable, th: TableHeaderCell, td: TableCell }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
