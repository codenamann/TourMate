import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const SheetContext = React.createContext({})

const Sheet = ({ open, onOpenChange, side = "right", children }) => {
  const [isOpen, setIsOpen] = React.useState(open || false)
  const actualOpen = open !== undefined ? open : isOpen
  const handleOpenChange = onOpenChange || setIsOpen

  React.useEffect(() => {
    if (open !== undefined) {
      setIsOpen(open)
    }
  }, [open])

  if (!actualOpen) return null

  const sideClasses = {
    right: "right-0 top-0 h-full",
    left: "left-0 top-0 h-full",
    top: "top-0 left-0 w-full",
    bottom: "bottom-0 left-0 w-full",
  }

  return (
    <SheetContext.Provider value={{ open: actualOpen, onOpenChange: handleOpenChange }}>
      <div className="fixed inset-0 z-50">
        <div
          className="fixed inset-0 bg-black/50"
          onClick={() => handleOpenChange(false)}
        />
        <div className={cn("fixed z-50", sideClasses[side])}>
          {children}
        </div>
      </div>
    </SheetContext.Provider>
  )
}

const SheetContent = React.forwardRef(({ className, children, side = "right", ...props }, ref) => {
  const context = React.useContext(SheetContext)
  const sideClasses = {
    right: "h-full w-[300px] border-l",
    left: "h-full w-[300px] border-r",
    top: "h-[300px] w-full border-b",
    bottom: "h-[300px] w-full border-t",
  }

  return (
    <div
      ref={ref}
      className={cn(
        "bg-card text-card-foreground shadow-lg p-6 overflow-auto",
        sideClasses[side],
        className
      )}
      {...props}
    >
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-4"
        onClick={() => context.onOpenChange(false)}
      >
        <X className="h-4 w-4" />
      </Button>
      {children}
    </div>
  )
})
SheetContent.displayName = "SheetContent"

const SheetHeader = ({ className, ...props }) => (
  <div className={cn("flex flex-col space-y-2 text-center sm:text-left mb-4", className)} {...props} />
)
SheetHeader.displayName = "SheetHeader"

const SheetTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn("text-lg font-semibold", className)}
    {...props}
  />
))
SheetTitle.displayName = "SheetTitle"

export { Sheet, SheetContent, SheetHeader, SheetTitle }

