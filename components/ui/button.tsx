import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all disabled:opacity-50 disabled:pointer-events-none text-sm',
  {
    variants: {
      variant: {
        primary: 'bg-[#7a5c2e] text-[#fdf6ec] hover:bg-[#5c4520]',
        outline: 'border-2 border-[#7a5c2e] text-[#7a5c2e] hover:bg-[#7a5c2e] hover:text-[#fdf6ec]',
        ghost: 'text-[#7a5c2e] hover:bg-[#e8d5b0]',
        danger: 'bg-red-600 text-white hover:bg-red-700',
        success: 'bg-green-600 text-white hover:bg-green-700',
      },
      size: {
        sm: 'px-4 py-1.5 text-xs',
        md: 'px-6 py-2.5',
        lg: 'px-8 py-3 text-base',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  }
)

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'
