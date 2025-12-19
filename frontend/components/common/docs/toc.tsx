"use client";

import React, { useEffect, useState, useMemo, useRef } from "react";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TocItem {
  id: string;
  level: number;
  text: string;
}

interface TableOfContentsProps {
  content: string;
  className?: string;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/<[^>]+>/g, '')
    .replace(/[\s\t\n]+/g, '-')
    .replace(/[^\p{L}\p{N}\-_]/gu, '')
    .replace(/^-+|-+$/g, '');
}

export function TableOfContents({ content, className }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const toc = useMemo(() => {
    const items: TocItem[] = [];
    const slugCount = new Map<string, number>();
    const lines = content.split('\n');

    lines.forEach((line) => {
      const match = line.match(/^(#{2,4})\s+(.+)$/);
      if (match) {
        const level = match[1].length;
        const text = match[2].trim();
        let slug = slugify(text);

        const count = slugCount.get(slug);
        if (count !== undefined) {
          slugCount.set(slug, count + 1);
          slug = `${ slug }-${ count + 1 }`;
        } else {
          slugCount.set(slug, 0);
        }

        items.push({ id: slug, level, text });
      }
    });

    return items;
  }, [content]);

  useEffect(() => {
    if (!activeId || !scrollAreaRef.current) return;

    const activeElement = scrollAreaRef.current.querySelector(`[data-toc-id="${ activeId }"]`);
    if (activeElement) {
      activeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [activeId]);

  useEffect(() => {
    if (toc.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const intersecting = entries
          .filter(entry => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (intersecting.length > 0) {
          setActiveId(intersecting[0].target.id);
        }
      },
      {
        rootMargin: '-20px 0px -80% 0px',
        threshold: [0, 1]
      }
    );

    const elements: Element[] = [];
    toc.forEach(item => {
      const el = document.getElementById(item.id);
      if (el) {
        elements.push(el);
        observer.observe(el);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [toc]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 20;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
      setActiveId(id);
    }
  };

  if (toc.length === 0) return null;

  return (
    <div className={cn("space-y-4", className)}>
      <div className="text-sm font-medium text-foreground pl-3">在此页</div>
      <ScrollArea className="h-[calc(100vh-10rem)]" ref={scrollAreaRef}>
        <nav className="space-y-1 border-l border-border/40 pl-3 pr-4">
          {toc.map((item) => (
            <a
              key={item.id}
              data-toc-id={item.id}
              href={`#${ item.id }`}
              onClick={(e) => handleClick(e, item.id)}
              className={cn(
                "relative flex items-center py-1.5 px-2 text-sm transition-colors rounded-md",
                activeId === item.id
                  ? "text-primary font-medium bg-primary/5"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
              style={{
                paddingLeft: `${ (item.level - 2) * 12 + 8 }px`,
              }}
            >
              {activeId === item.id && (
                <motion.div
                  layoutId="active-toc-indicator"
                  className="absolute left-[-13.5px] w-0.5 h-4 bg-primary rounded-full"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <span className="truncate">{item.text}</span>
            </a>
          ))}
        </nav>
      </ScrollArea>
    </div>
  );
}
