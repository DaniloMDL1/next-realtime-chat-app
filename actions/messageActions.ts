"use server"

import { getServerSession } from "@/lib/get-session"
import prisma from "@/lib/prisma"
import { pusherServer } from "@/lib/pusher"
import { z } from "zod"

const messageSchema = z.object({
    text: z.string().optional(),
    conversationId: z.string(),
    image: z.string().optional()
})

const createMessage = async (prevState: { success: boolean, error: string | null }, formData: FormData) => {

    const session = await getServerSession()

    if(!session) return { success: false, error: "Not authenticated" }
    
    const text = formData.get("text") as string
    const conversationId = formData.get("conversationId") as string
    const image = formData.get("image") as string
    
    const validatedFields = messageSchema.safeParse({
        text,
        conversationId,
        image
    })

    if(!validatedFields.success) {
        return { success: false, error: "Invalid data" }
    }

    const data = validatedFields.data

    try {

        const newMessage = await prisma.message.create({
            data: {
                ...data,
                senderId: session.user.id,
                seen: {
                    connect: [
                        { id: session.user.id }
                    ]
                }
            },
            include: {
                sender: true,
                seen: true
            }
        })

        const updatedConversation = await prisma.conversation.update({
            where: { id: conversationId },
            data: {
                lastMessageAt: new Date(),
                messages: {
                    connect: {
                        id: newMessage.id
                    }
                }
            },
            include: {
                users: true,
                messages: {
                    include: {
                        seen: true
                    }
                }
            }
        })

        await pusherServer.trigger(conversationId, "messages:create", newMessage)

        const lastMessage = updatedConversation.messages[updatedConversation.messages.length - 1]

        updatedConversation.users.forEach((user) => {
            pusherServer.trigger(user.id, "conversation:update", {
                id: conversationId,
                messages: [lastMessage]
            })
        })

        return { success: true, error: null }

    } catch(error) {
        console.log(error)
        return { success: false, error: "Something went wrong" }
    }
}

const markAsSeen = async (conversationId: string) => {

    const session = await getServerSession()

    if(!session) return { success: false, error: "Unauthenticated" }

    const existingConversation = await prisma.conversation.findUnique({
        where: { id: conversationId },
        include: {
            users: true,
            messages: {
                include: {
                    seen: true
                }
            }
        }
    })

    if(!existingConversation) return { success: false, error: "Conversation not found" }

    const lastMessage = existingConversation.messages[existingConversation.messages.length - 1]

    if(!lastMessage) return existingConversation

    const updatedMessage = await prisma.message.update({
        where: { id: lastMessage.id },
        data: {
            seen: {
                connect: [
                    { id: session.user.id }
                ]
            }
        },
        include: {
            sender: true,
            seen: true
        }
    })

    await pusherServer.trigger(session.user.id, "conversation:markAsSeen", {
        id: conversationId,
        messages: [updatedMessage]
    })
    
    if(lastMessage.seenIds.includes(session.user.id)) {
        return existingConversation
    }
    
    await pusherServer.trigger(conversationId, "message:update", updatedMessage)

    return updatedMessage
}

export { createMessage, markAsSeen }