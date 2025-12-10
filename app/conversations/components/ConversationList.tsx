"use client"

import { Button } from "@/components/ui/button"
import { UserPlus } from "lucide-react"
import ConversationItem from "./ConversationItem"
import { FullConversationType } from "@/types/conversation"
import useConversation from "@/hooks/useConversation"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import GroupChatDialog from "./GroupChatDialog"
import { User as UserType } from "@/lib/generated/prisma/client"
import { authClient } from "@/lib/auth-client"
import { pusherClient } from "@/lib/pusher"

type Props = {
    userConversations: FullConversationType[],
    users: UserType[]
}

const ConversationList = ({ userConversations, users }: Props) => {
    const [conversations, setConversations] = useState(userConversations)

    const { data: session } = authClient.useSession()

    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const { conversationId, isChatOpen } = useConversation()

    useEffect(() => {
        if(!session?.user.id) return

        pusherClient.subscribe(session.user.id)

        const handleUpdateConversation = (updatedConversation: FullConversationType) => {
            setConversations((prev) => {
                const updatedConversations = prev.map((conversation) => {
                    if(conversation.id === updatedConversation.id) {
                        return {
                            ...conversation,
                            messages: updatedConversation.messages
                        }
                    }

                    return conversation
                })

                return updatedConversations
            })
        }

        const handleMarkAsSeenConversation = (updatedConversation: FullConversationType) => {
            setConversations((prev) => {
                const updatedConversations = prev.map((conversation) => {
                    if(conversation.id === updatedConversation.id) {
                        return {
                            ...conversation,
                            messages: updatedConversation.messages
                        }
                    }

                    return conversation
                })

                return updatedConversations
            })
        }

        const handleCreateConversation = (newConversation: FullConversationType) => {
            setConversations((prev) => {
                const existingConversation = prev.find((conversation) => conversation.id === newConversation.id)

                if(existingConversation) {
                    return prev
                }

                return [...prev, newConversation]
            })
        }

        const handleDeleteConversation = (deletedConversation: FullConversationType) => {
            setConversations((prev) => prev.filter((conversation) => conversation.id !== deletedConversation.id))
        }

        pusherClient.bind("conversation:create", handleCreateConversation)
        pusherClient.bind("conversation:update", handleUpdateConversation)
        pusherClient.bind("conversation:delete", handleDeleteConversation)
        pusherClient.bind("conversation:markAsSeen", handleMarkAsSeenConversation)

        return () => {
            pusherClient.unsubscribe(session.user.id)
            pusherClient.unbind("conversation:update", handleUpdateConversation)
            pusherClient.unbind("conversation:markAsSeen", handleMarkAsSeenConversation)
            pusherClient.unbind("conversation:create", handleCreateConversation)
            pusherClient.unbind("conversation:delete", handleDeleteConversation)
        }

    }, [session?.user.id])

    return (
        <div className={cn("fixed inset-y-0 lg:block lg:left-16 left-0 lg:pb-2 pb-[65px] lg:w-74 w-full overflow-y-auto lg:border-r px-3", isChatOpen ? "hidden" : "block")}>

            <div className="py-2 flex justify-between items-center">
                <h2 className="lg:text-xl text-lg font-semibold">Conversations</h2>

                <Button onClick={() => setIsDialogOpen(true)} className="text-muted-foreground hover:text-foreground" variant={"ghost"}>
                    <UserPlus className="size-5"/>
                </Button>
                <GroupChatDialog 
                    open={isDialogOpen}
                    setIsOpen={setIsDialogOpen}
                    users={users}
                />
            </div>

            <div className="flex flex-col">
                {conversations.map((conversation) => (
                    <ConversationItem 
                        key={conversation.id} 
                        isChatSelected={conversation.id === conversationId}
                        conversation={conversation}
                    />
                ))}
            </div>

        </div>
    )
}
export default ConversationList