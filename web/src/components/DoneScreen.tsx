import { CircleCheck } from 'lucide-react'
import { Button } from './ui/button'

type Props = {
  onClose: () => void
}

export const DoneScreen = ({ onClose }: Props) => {
  return (
    <>
      <div className="">
        <div className="flex flex-col items-center justify-center pt-6">
          <CircleCheck className="text-6xl text-green-500" size={64} />
          All done!
        </div>
      </div>
      <div className="pt-6">
        <Button onClick={onClose} className="w-full" variant="secondary">
          Close
        </Button>
      </div>
    </>
  )
}
