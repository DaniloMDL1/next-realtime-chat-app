import { Dispatch, SetStateAction } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog"
import { Button } from "./ui/button"
import { Spinner } from "./ui/spinner"

type Props = {
    title: string,
    desc: string,
    open: boolean,
    setIsOpen: Dispatch<SetStateAction<boolean>>,
    handleDelete: () => Promise<void>,
    isPending: boolean
}

const DeleteDialog = ({ title, desc, open, setIsOpen, handleDelete, isPending }: Props) => {
    return (
        <Dialog open={open} onOpenChange={setIsOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>
                        {desc}
                    </DialogDescription>
                </DialogHeader>

                <div className="flex justify-end">
                    <Button onClick={handleDelete} disabled={isPending} variant={"destructive"} className="w-20">
                        {isPending ? <Spinner className="size-6"/> : "Confirm"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
export default DeleteDialog