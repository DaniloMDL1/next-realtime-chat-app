import { getServerSession } from "../get-session"
import prisma from "../prisma"

const getConversationMessages = async (conversationId: string) => {

    const session = await getServerSession()

    if(!session) return []

    try {

        const conversationMessages = await prisma.message.findMany({
            where: { conversationId },
            include: {
                sender: true,
                seen: true
            }
        })

        return conversationMessages

    } catch(error) {
        console.log(error)
        return []
    }

}

export { getConversationMessages }