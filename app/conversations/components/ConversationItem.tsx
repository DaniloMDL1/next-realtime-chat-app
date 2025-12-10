"use client"

import AvatarGroup from "@/components/AvatarGroup"
import UserAvatar from "@/components/UserAvatar"
import useOtherUser from "@/hooks/useOtherUser"
import { authClient } from "@/lib/auth-client"
import { cn } from "@/lib/utils"
import { FullConversationType } from "@/types/conversation"
import { format } from "date-fns"
import { useRouter } from "next/navigation"

type Props = {
    conversation: FullConversationType,
    isChatSelected: boolean
}

const ConversationItem = ({ conversation, isChatSelected }: Props) => {

    const router = useRouter()

    const otherUser = useOtherUser(conversation)

    const { data: session } = authClient.useSession()

    const lastMessage = conversation.messages && conversation.messages.length > 0 ? conversation.messages[conversation.messages.length - 1] : null

    const lastMessageText = lastMessage?.text ? lastMessage.text : lastMessage?.image ? "Sent an image" : "Started a conversation"

    const hasSeenLastMessage = lastMessage ? lastMessage.seen.some((seenUser) => seenUser.id === session?.user.id) : true

    return (
        <div onClick={() => router.push(`/conversations/${conversation.id}`)} className={cn("flex items-center gap-2 px-2 py-3 hover:bg-neutral-100 rounded-lg cursor-pointer", isChatSelected && "bg-neutral-100")}>
            {conversation.isGroup ? (
                <AvatarGroup users={conversation.users}/>
            ) : (
                <UserAvatar user={otherUser}/>
            )}

            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                    <h3 className="font-medium text-sm">
                        {conversation.name || otherUser.name}
                    </h3>
                    {lastMessage?.createdAt && (
                        <p className="text-xs text-muted-foreground">
                            {format(new Date(lastMessage.createdAt), "p")}
                        </p>
                    )}
                </div>

                <p className={cn("text-sm truncate", hasSeenLastMessage ? "text-muted-foreground" : "text-foreground font-semibold")}>
                    {lastMessageText}
                </p>
            </div>
        </div>
    )
}
export default ConversationItem