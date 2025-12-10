"use client"

import EmptyState from "@/components/EmptyState"
import useConversation from "@/hooks/useConversation"
import { cn } from "@/lib/utils"

const ConversationsPage = () => {

    const { isChatOpen } = useConversation()

    return (
        <div className={cn("h-full lg:pl-90 lg:block", isChatOpen ? "block" : "hidden")}>
            <EmptyState />
        </div>
    )
}
export default ConversationsPage