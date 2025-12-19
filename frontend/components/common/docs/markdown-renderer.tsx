"use client";

import React from "react";
import ReactMarkdown, { Components } from "react-markdown";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { CodeBlock } from "@/components/common/docs/code-block";
import { cn } from "@/lib/utils";
import { Hash } from "lucide-react";

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
}) => {
  const components: Partial<Components> = {
    code: ({ className, children, ...props }: React.HTMLAttributes<HTMLElement>) => {
      const match = /language-(\w+)/.exec(className || "");
      const language = match ? match[1] : undefined;
      const isInline = !match && !String(children).includes("\n");

      if (isInline) {
        return (
          <code
            className={cn(
              "rounded px-1.5 py-0.5 font-mono text-[13px]",
              "bg-muted text-foreground/90",
              className
            )}
            {...props}
          >
            {children}
          </code>
        );
      }

      return (
        <CodeBlock
          language={language}
          raw={String(children).replace(/\n$/, "")}
          className={className}
          {...props}
        >
          {children}
        </CodeBlock>
      );
    },
    blockquote: ({ className, children, ...props }: React.BlockquoteHTMLAttributes<HTMLQuoteElement>) => {
      return (
        <blockquote
          className={cn(
            "my-6 border-l-2 border-primary pl-6 italic text-muted-foreground",
            className
          )}
          {...props}
        >
          {children}
        </blockquote>
      );
    },
    table: ({ className, ...props }: React.TableHTMLAttributes<HTMLTableElement>) => (
      <div className="my-8 w-full overflow-hidden">
        <div className="overflow-x-auto">
          <table className={cn("w-full caption-bottom text-sm text-left", className)} {...props} />
        </div>
      </div>
    ),
    thead: ({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => (
      <thead className={cn("border-b border-border/40", className)} {...props} />
    ),
    tr: ({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
      <tr
        className={cn(
          "border-b border-border/40 transition-colors hover:bg-muted/30 data-[state=selected]:bg-muted last:border-0",
          className
        )}
        {...props}
      />
    ),
    th: ({ className, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) => (
      <th
        className={cn(
          "h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
          className
        )}
        {...props}
      />
    ),
    td: ({ className, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) => (
      <td
        className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0 text-foreground", className)}
        {...props}
      />
    ),
    h1: ({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h1 className={cn("group flex items-center gap-2 scroll-m-20 text-3xl font-bold tracking-tight lg:text-4xl mb-8", className)} {...props}>
        {children}
      </h1>
    ),
    h2: ({ className, children, id, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h2 id={id} className={cn("group flex items-center gap-2 scroll-m-20 text-2xl font-semibold tracking-tight mt-12 mb-4 border-b border-border/40 pb-2", className)} {...props}>
        {children}
        <a href={`#${ id }`} className="opacity-0 group-hover:opacity-100 transition-opacity text-primary ml-2"><Hash className="w-4 h-4" /></a>
      </h2>
    ),
    h3: ({ className, children, id, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h3 id={id} className={cn("group flex items-center gap-2 scroll-m-20 text-xl font-semibold tracking-tight mt-8 mb-4", className)} {...props}>
        {children}
        <a href={`#${ id }`} className="opacity-0 group-hover:opacity-100 transition-opacity text-primary ml-2"><Hash className="w-3.5 h-3.5" /></a>
      </h3>
    ),
    h4: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h4 className={cn("scroll-m-20 text-base font-semibold tracking-tight mt-6 mb-2 text-foreground", className)} {...props} />
    ),
    p: ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
      <p className={cn("leading-7 [&:not(:first-child)]:mt-6 text-muted-foreground", className)} {...props} />
    ),
    ul: ({ className, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
      <ul className={cn("my-6 ml-0 pl-6 list-disc [&>li]:mt-2 marker:text-muted-foreground/60", className)} {...props} />
    ),
    ol: ({ className, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
      <ol className={cn("my-6 ml-0 pl-6 list-decimal [&>li]:mt-2 marker:text-muted-foreground/60", className)} {...props} />
    ),
    li: ({ className, ...props }: React.LiHTMLAttributes<HTMLLIElement>) => (
      <li className={cn("text-muted-foreground", className)} {...props} />
    ),
    hr: ({ className, ...props }: React.HTMLAttributes<HTMLHRElement>) => (
      <hr className={cn("my-10 border-t border-border/40", className)} {...props} />
    ),
    a: ({ className, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
      <a
        className={cn("font-medium text-primary underline underline-offset-4 decoration-primary/30 hover:decoration-primary transition-colors cursor-pointer rounded-sm hover:bg-primary/5", className)}
        {...props}
      />
    ),
  };

  return (
    <article className="max-w-none [&>:first-child]:mt-0" >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </article >
  );
};
