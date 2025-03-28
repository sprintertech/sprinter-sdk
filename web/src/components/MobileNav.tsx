import { useState } from 'react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Menu as MenuIcon } from 'lucide-react'
import { Root as VisuallyHiddenRoot } from '@radix-ui/react-visually-hidden'

const mobileItems = ['A', 'B', 'C']

export default function MobileNav() {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetHeader>
        <SheetTitle>
          <VisuallyHiddenRoot>Menu</VisuallyHiddenRoot>
        </SheetTitle>
        <SheetDescription>
          <VisuallyHiddenRoot>Menu for mobile</VisuallyHiddenRoot>
        </SheetDescription>
      </SheetHeader>
      {/* This button will trigger open the mobile sheet menu */}
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <MenuIcon />
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="bg-white">
        <div className="flex flex-col items-start">
          {mobileItems.map((item, index) => (
            <Button
              key={index}
              variant="link"
              onClick={() => {
                setOpen(false)
              }}
            >
              {item}
            </Button>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  )
}
