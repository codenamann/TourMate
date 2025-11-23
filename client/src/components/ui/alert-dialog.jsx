import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

const AlertDialog = ({ open, onOpenChange, ...props }) => {
  return <Dialog open={open} onOpenChange={onOpenChange} {...props} />
}

const AlertDialogContent = React.forwardRef(({ className, ...props }, ref) => {
  return <DialogContent ref={ref} className={className} {...props} />
})
AlertDialogContent.displayName = "AlertDialogContent"

const AlertDialogHeader = DialogHeader
const AlertDialogTitle = DialogTitle
const AlertDialogDescription = DialogDescription

const AlertDialogAction = React.forwardRef(({ className, ...props }, ref) => {
  return <Button ref={ref} className={className} {...props} />
})
AlertDialogAction.displayName = "AlertDialogAction"

const AlertDialogCancel = React.forwardRef(({ className, variant = "outline", ...props }, ref) => {
  return <Button ref={ref} variant={variant} className={className} {...props} />
})
AlertDialogCancel.displayName = "AlertDialogCancel"

export {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
}

