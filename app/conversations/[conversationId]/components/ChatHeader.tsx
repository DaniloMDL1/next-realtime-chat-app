"use client"

import UserAvatar from "@/components/UserAvatar"
import useOtherUser from "@/hooks/useOtherUser"
import { ConversationWithUsersType } from "@/types/conversation"
import { ChevronLeft, EllipsisVertical } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import ConversationSheet from "./ConversationSheet"
import AvatarGroup from "@/components/AvatarGroup"
import { useActiveListStore } from "@/lib/store/useActiveListStore"

type Props = {
    conversation: ConversationWithUsersType
}

const ChatHeader = ({ conversation }: Props) => {
    const [isSheetOpen, setIsSheetOpen] = useState(false)

    const members = useActiveListStore((state) => state.members)

    const router = useRouter()

    const otherUser = useOtherUser(conversation)

    const statusText = conversation.isGroup ? `${conversation.users.length} members` : members.includes(otherUser.id) ? "Online" : "Offline"

    return (
        <div className="border-b">
            <div className="h-18 flex items-center justify-between gap-4 px-4">

                <div className="flex items-center gap-2">
                    <button onClick={() => router.push("/conversations")} className="cursor-pointer lg:hidden">
                        <ChevronLeft className="text-primary size-8"/>
                    </button>

                    {conversation.isGroup ? (
                        <AvatarGroup users={conversation.users}/>
                    ) : (
                        <UserAvatar user={otherUser}/>
                    )}

                    <div className="flex flex-col">
                        <h3 className="font-medium">{conversation.name || otherUser.name}</h3>
                        <p className="text-muted-foreground text-sm">{statusText}</p>
                    </div>
                </div>

                <button onClick={() => setIsSheetOpen(true)} className="cursor-pointer">
                    <EllipsisVertical className="text-primary size-6"/>
                </button>
                <ConversationSheet 
                    open={isSheetOpen}
                    setIsOpen={setIsSheetOpen}
                    conversation={conversation}
                />

            </div>
        </div>
    )
}
export default ChatHeader