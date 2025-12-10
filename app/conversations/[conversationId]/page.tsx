import EmptyState from "@/components/EmptyState"
import { getConversationById } from "@/lib/queries/conversation"
import ChatHeader from "./components/ChatHeader"
import ChatBody from "./components/ChatBody"
import { getConversationMessages } from "@/lib/queries/message"
import ChatFooter from "./components/ChatFooter"

type Props = {
    params: Promise<{ conversationId: string }>
}

const ConversationPage = async ({ params }: Props) => {

    const { conversationId } = await params

    const conversation = await getConversationById(conversationId)

    if(!conversation) {
        return (
            <div className="h-full lg:pl-90">
                <EmptyState />
            </div>
        )
    }

    const conversationMessages = await getConversationMessages(conversationId)

    return (
        <div className="h-full flex flex-col lg:pl-90">
            <ChatHeader conversation={conversation}/>
            <ChatBody conversationMessages={conversationMessages}/>
            <ChatFooter />
        </div>
    )
}
export default ConversationPage