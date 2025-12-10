import { useParams } from "next/navigation"

const useConversation = () => {

    const params = useParams()

    const conversationId = params?.conversationId as string ?? ""

    const isChatOpen = !!conversationId

    return { conversationId, isChatOpen }
}
export default useConversation