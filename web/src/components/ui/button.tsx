import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'
import { LoaderCircle } from 'lucide-react'

const buttonVariants = cva(
  ' inline-flex h-9 items-center justify-center gap-2 overflow-hidden whitespace-nowrap rounded-xl border border-[#eeeeee] bg-white px-3.5 py-2 text-sm shadow-[0px_4px_5px_0px_rgba(10,13,20,0.03)] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground shadow hover:bg-primary/90',
        destructive:
          'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
        outline:
          'h-11 rounded-3xl border border-gray-700 bg-background px-3.5 py-2.5 text-center text-base font-medium text-neutral-700 shadow-sm hover:bg-accent hover:text-accent-foreground',
        secondary:
          'h-11 rounded-3xl border border-gray-700 bg-gray-900 px-3.5 py-2.5 text-center text-base font-medium text-white shadow-sm hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline'
        // large:
        //   'inline-flex h-[67px] items-center justify-center gap-2 overflow-hidden rounded-3xl border border-[#e1e3e9] bg-white px-6 py-4 shadow-[0px_4px_5px_0px_rgba(10,13,20,0.03)]'
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-xl px-3 text-xs',
        lg: 'inline-flex h-[67px] w-[25rem] justify-center gap-2 overflow-hidden rounded-3xl bg-white px-6 py-4',
        icon: 'size-9'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
)

export type ButtonProps = {
  loading?: boolean
  asChild?: boolean
} & React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, loading, variant, size, asChild = false, children, ...props },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {children}
        {loading && <LoaderCircle className="animate-spin" />}
      </Comp>
    )
  }
)
Button.displayName = 'Button'

// eslint-disable-next-line react-refresh/only-export-components
export { Button, buttonVariants }
