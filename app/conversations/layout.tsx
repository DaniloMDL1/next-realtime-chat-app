import Sidebar from "@/components/Sidebar"
import { ReactNode } from "react"
import ConversationList from "./components/ConversationList"
import { getUserConversations } from "@/lib/queries/conversation"
import { getUsers } from "@/lib/queries/user"

type Props = {
    children: ReactNode
}

const ConversationsLayout = async ({ children }: Props) => {

    const userConversations = await getUserConversations()

    const users = await getUsers()

    return (
        <Sidebar>
            <div className="h-full">
                <ConversationList userConversations={userConversations} users={users}/>
                {children}
            </div>
        </Sidebar>
    )
}
export default ConversationsLayout