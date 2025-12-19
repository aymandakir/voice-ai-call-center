import * as React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-12 sm:h-14 lg:h-16 w-full rounded-xl sm:rounded-2xl border border-gray-200/50 dark:border-gray-800/50 bg-white/80 dark:bg-black/80 backdrop-blur-xl px-3 sm:px-4 lg:px-5 py-2.5 sm:py-3 lg:py-4 text-sm sm:text-base lg:text-lg font-light transition-all duration-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus-visible:outline-none focus-visible:border-[#007AFF] focus-visible:ring-2 focus-visible:ring-[#007AFF]/20 focus-visible:bg-white dark:focus-visible:bg-black disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'

export { Input }

