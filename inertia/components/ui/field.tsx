import * as React from 'react'
import { cn } from '~/lib/utils'

const Field = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col gap-1.5', className)} {...props} />
  )
)
Field.displayName = 'Field'

export { Field }
