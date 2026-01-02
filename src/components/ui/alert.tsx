import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { AlertCircle, AlertTriangle, CheckCircle, Info, X } from "lucide-react"

import { cn } from "@/lib/utils"

const alertVariants = cva(
  "relative w-full rounded-lg border px-4 py-3 text-sm [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground pl-11",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive:
          "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
        error: "border-burgundy-200 bg-burgundy-50 text-burgundy-900 [&>svg]:text-burgundy-600",
        warning: "border-gold/30 bg-gold/10 text-burgundy-900 [&>svg]:text-gold",
        success: "border-green-200 bg-green-50 text-green-900 [&>svg]:text-green-600",
        info: "border-blue-200 bg-blue-50 text-blue-900 [&>svg]:text-blue-600",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const icons = {
  default: Info,
  destructive: AlertCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  success: CheckCircle,
  info: Info,
}

interface AlertProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof alertVariants> {
  title?: string
  icon?: React.ElementType
  onDismiss?: () => void
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant, title, icon, children, onDismiss, ...props }, ref) => {
    const IconComponent = icon || icons[variant || "default"]

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(alertVariants({ variant }), "animate-fade-in", className)}
        {...props}
      >
        <IconComponent className="h-4 w-4" />
        <div className="flex justify-between items-start gap-2">
          <div className="w-full">
            {title && <h5 className="mb-1 font-medium leading-none tracking-tight">{title}</h5>}
            <div className="text-sm opacity-90">{children}</div>
          </div>
          {onDismiss && (
            <button 
              onClick={onDismiss}
              className="ml-2 -mt-1 -mr-1 rounded-full p-1 hover:bg-black/5 transition-colors"
              aria-label="Dismiss"
              type="button"
            >
              <X className="h-4 w-4 opacity-70" />
            </button>
          )}
        </div>
      </div>
    )
  }
)
Alert.displayName = "Alert"

export { Alert, alertVariants }
