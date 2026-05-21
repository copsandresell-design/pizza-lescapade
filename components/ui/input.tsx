import * as React from 'react'
import { cn } from '@/lib/utils'

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      'w-full rounded-xl border border-[#e8d5b0] bg-white px-4 py-2.5 text-sm text-[#2c1a0e] placeholder:text-[#b8a080] outline-none focus:border-[#7a5c2e] focus:ring-2 focus:ring-[#7a5c2e]/20 transition',
      className
    )}
    {...props}
  />
))
Input.displayName = 'Input'
