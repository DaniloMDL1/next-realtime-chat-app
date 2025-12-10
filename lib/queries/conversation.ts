import { getServerSession } from "../get-session"
import prisma from "../prisma"

const getUserConversations = async () => {

    const session = await getServerSession()

    if(!session) return []

    try {
        const userConversations = await prisma.conversation.findMany({
            where: {
                userIds: {
                    has: session.user.id
                }
            },
            include: {
                users: true,
                messages: {
                    include: {
                        seen: true
                    }
                }
            },
            orderBy: { lastMessageAt: "desc" }
        })

        return userConversations

    } catch(error) {
        console.log(error)
        return []
    }
}

const getConversationById = async (conversationId: string) => {

    const session = await getServerSession()

    if(!session) return null

    try {
        const conversation = await prisma.conversation.findUnique({
            where: { id: conversationId },
            include: {
                users: true
            }
        })

        return conversation

    } catch(error) {
        console.log(error)
        return null
    }

}

export { getUserConversations, getConversationById }