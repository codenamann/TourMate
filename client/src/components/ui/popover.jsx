import * as React from "react"
import { cn } from "@/lib/utils"

const PopoverContext = React.createContext({})

const Popover = ({ children, open, onOpenChange }) => {
  const [isOpen, setIsOpen] = React.useState(open || false)
  const actualOpen = open !== undefined ? open : isOpen
  const handleOpenChange = onOpenChange || setIsOpen

  return (
    <PopoverContext.Provider value={{ open: actualOpen, onOpenChange: handleOpenChange }}>
      <div className="relative inline-block">
        {children}
      </div>
    </PopoverContext.Provider>
  )
}

const PopoverTrigger = React.forwardRef(({ className, asChild, children, ...props }, ref) => {
  const context = React.useContext(PopoverContext)
  
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
PopoverTrigger.displayName = "PopoverTrigger"

const PopoverContent = React.forwardRef(({ className, align = "center", ...props }, ref) => {
  const context = React.useContext(PopoverContext)
  if (!context.open) return null

  return (
    <div
      ref={ref}
      className={cn(
        "absolute z-50 w-72 rounded-md border border-border bg-card p-4 text-card-foreground shadow-md outline-none",
        className
      )}
      {...props}
    />
  )
})
PopoverContent.displayName = "PopoverContent"

export { Popover, PopoverTrigger, PopoverContent }

