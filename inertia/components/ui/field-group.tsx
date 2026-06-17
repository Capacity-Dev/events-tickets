import * as React from 'react'
import { cn } from '~/lib/utils'

const FieldGroup = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col gap-4', className)} {...props} />
  )
)
FieldGroup.displayName = 'FieldGroup'

export { FieldGroup }
