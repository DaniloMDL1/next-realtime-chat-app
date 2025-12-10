"use client"

import { createConversation } from "@/actions/conversationActions"
import UserAvatar from "@/components/UserAvatar"
import { User as UserType } from "@/lib/generated/prisma/client"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

type Props = {
    user: UserType
}

const UserItem = ({ user }: Props) => {

    const router = useRouter()

    const handleCreateConversation = async () => {
        const response = await createConversation({ targetUserId: user.id })

        if(response.success && response.conversation) {
            router.push(`/conversations/${response.conversation.id}`)
        } else {
            toast.error(response.error)
        }
    }

    return (
        <div onClick={handleCreateConversation} className="flex items-center gap-2 px-2 py-3 hover:bg-neutral-100 rounded-lg cursor-pointer">
            <UserAvatar user={user}/>

            <h2 className="font-medium">{user.name}</h2>
        </div>
    )
}
export default UserItem