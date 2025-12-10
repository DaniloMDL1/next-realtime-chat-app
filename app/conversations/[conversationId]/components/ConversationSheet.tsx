"use client"

import { deleteConversation } from "@/actions/conversationActions"
import AvatarGroup from "@/components/AvatarGroup"
import DeleteDialog from "@/components/DeleteDialog"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import UserAvatar from "@/components/UserAvatar"
import useOtherUser from "@/hooks/useOtherUser"
import { useActiveListStore } from "@/lib/store/useActiveListStore"
import { ConversationWithUsersType } from "@/types/conversation"
import { Trash } from "lucide-react"
import { useRouter } from "next/navigation"
import { Dispatch, SetStateAction, useState } from "react"
import { toast } from "sonner"

type Props = {
    open: boolean,
    setIsOpen: Dispatch<SetStateAction<boolean>>,
    conversation: ConversationWithUsersType
}

const ConversationSheet = ({ open, setIsOpen, conversation }: Props) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const [isDeletePending, setIsDeletePending] = useState(false)

    const members = useActiveListStore((state) => state.members)

    const router = useRouter()

    const otherUser = useOtherUser(conversation)

    const statusText = conversation.isGroup ? `${conversation.users.length} members` : members.includes(otherUser.id) ? "Online" : "Offline"

    const handleDeleteConversation = async () => {
        setIsDeletePending(true)

        const response = await deleteConversation(conversation.id)

        if(response.success) {
            toast.success("Conversation deleted successfully")
            setIsOpen(false)
            setIsDialogOpen(false)

            router.push("/conversations")

            setIsDeletePending(false)
        } else {
            toast.error(response.error)
            setIsDeletePending(false)
        }

    }

    return (
        <Sheet open={open} onOpenChange={setIsOpen}>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Conversation</SheetTitle>
                    <SheetDescription>
                        Details about this conversation
                    </SheetDescription>
                </SheetHeader>

                <div className="flex flex-col items-center gap-3">

                    <div className="flex flex-col items-center">
                        {conversation.isGroup ? (
                            <AvatarGroup users={conversation.users}/>
                        ) : (
                            <UserAvatar user={otherUser} size={"size-12"}/>
                        )}
                        <h3 className={`font-medium ${conversation.isGroup && "mt-6"}`}>{conversation.name || otherUser.name}</h3>
                        <p className="text-muted-foreground text-sm">{statusText}</p>
                    </div>

                    <Button onClick={() => setIsDialogOpen(true)} className="text-red-600 hover:text-red-500/90" variant={"ghost"}>
                        <Trash className="size-5"/>
                        <span>Delete</span>
                    </Button>

                    <DeleteDialog 
                        title="Delete Conversation"
                        desc="Are you sure you want to delete this conversation? This action cannot be undone."
                        open={isDialogOpen}
                        setIsOpen={setIsDialogOpen}
                        handleDelete={handleDeleteConversation}
                        isPending={isDeletePending}
                    />

                </div>
            </SheetContent>
        </Sheet>
    )
}
export default ConversationSheet