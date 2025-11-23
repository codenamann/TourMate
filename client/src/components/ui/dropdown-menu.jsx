import * as React from "react"
import { cn } from "@/lib/utils"

const DropdownMenuContext = React.createContext({})

const DropdownMenu = ({ children, open, onOpenChange }) => {
  const [isOpen, setIsOpen] = React.useState(open || false)
  const actualOpen = open !== undefined ? open : isOpen
  const handleOpenChange = onOpenChange || setIsOpen

  return (
    <DropdownMenuContext.Provider value={{ open: actualOpen, onOpenChange: handleOpenChange }}>
      <div className="relative inline-block text-left">
        {children}
      </div>
    </DropdownMenuContext.Provider>
  )
}

const DropdownMenuTrigger = React.forwardRef(({ className, asChild, children, ...props }, ref) => {
  const context = React.useContext(DropdownMenuContext)
  
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      ref,
      onClick: () => context.onOpenChange(!context.open),
      ...props,
    })
  }

  return (
    <button
      ref={ref}
      type="button"
      onClick={() => context.onOpenChange(!context.open)}
      className={className}
      {...props}
    >
      {children}
    </button>
  )
})
DropdownMenuTrigger.displayName = "DropdownMenuTrigger"

const DropdownMenuContent = React.forwardRef(({ className, align = "start", ...props }, ref) => {
  const context = React.useContext(DropdownMenuContext)
  if (!context.open) return null

  const alignClasses = {
    start: "left-0",
    end: "right-0",
    center: "left-1/2 -translate-x-1/2",
  }

  return (
    <div
      ref={ref}
      className={cn(
        "absolute z-50 mt-2 min-w-[8rem] overflow-hidden rounded-md border border-border bg-card text-card-foreground shadow-md",
        alignClasses[align],
        className
      )}
      {...props}
    />
  )
})
DropdownMenuContent.displayName = "DropdownMenuContent"

const DropdownMenuItem = React.forwardRef(({ className, ...props }, ref) => {
  const context = React.useContext(DropdownMenuContext)
  return (
    <div
      ref={ref}
      className={cn(
        "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
        className
      )}
      onClick={() => context.onOpenChange(false)}
      {...props}
    />
  )
})
DropdownMenuItem.displayName = "DropdownMenuItem"

export { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem }

