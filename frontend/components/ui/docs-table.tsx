import * as React from "react"
import { cn } from "@/lib/utils"

const DocsTable = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <div className="w-full overflow-hidden rounded-lg border border-border/50">
    <table
      ref={ref}
      className={cn("w-full text-sm text-left !my-0", className)}
      {...props}
    />
  </div>
))
DocsTable.displayName = "DocsTable"

const DocsTableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("bg-muted/50 text-muted-foreground font-medium border-b border-border/30", className)} {...props} />
))
DocsTableHeader.displayName = "DocsTableHeader"

const DocsTableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("divide-y divide-border/30 bg-background", className)}
    {...props}
  />
))
DocsTableBody.displayName = "DocsTableBody"

const DocsTableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn("transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted", className)}
    {...props}
  />
))
DocsTableRow.displayName = "DocsTableRow"

const DocsTableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "px-4 py-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
      className
    )}
    {...props}
  />
))
DocsTableHead.displayName = "DocsTableHead"

const DocsTableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn("px-4 py-2 align-middle [&:has([role=checkbox])]:pr-0", className)}
    {...props}
  />
))
DocsTableCell.displayName = "DocsTableCell"

export {
  DocsTable,
  DocsTableHeader,
  DocsTableBody,
  DocsTableHead,
  DocsTableRow,
  DocsTableCell,
}
