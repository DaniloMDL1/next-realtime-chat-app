import { authClient } from "@/lib/auth-client"
import { ConversationWithUsersType, FullConversationType } from "@/types/conversation"

const useOtherUser = (conversation: FullConversationType | ConversationWithUsersType) => {

    const { data: session } = authClient.useSession()

    const otherUser = conversation.users.filter((user) => user.id !== session?.user.id )

    return otherUser[0]
}
export default useOtherUser