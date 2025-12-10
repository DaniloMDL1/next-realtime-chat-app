"use server"

import { getServerSession } from "@/lib/get-session"
import prisma from "@/lib/prisma"
import { pusherServer } from "@/lib/pusher"

type CreateConversationProps = {
    targetUserId?: string,
    isGroup?: boolean,
    name?: string,
    members?: {
        label: string,
        value: string
    }[]
}

const createConversation = async ({ targetUserId, isGroup, name, members }: CreateConversationProps) => {

    const session = await getServerSession()

    if(!session) return { success: false, error: "Not authenticated" }

    if(isGroup) {
        if(!members || members.length < 2 || !name) return { success: false, error: "Invalid data" }

        const newConversation = await prisma.conversation.create({
            data: {
                isGroup,
                name,
                users: {
                    connect: [
                        ...members.map((member) => ({
                            id: member.value
                        })),
                        { id: session.user.id }
                    ]
                }
            },
            include: {
                users: true
            }
        })

        newConversation.users.forEach((user) => {
            pusherServer.trigger(user.id, "conversation:create", newConversation)
        })

        return { success: true, error: null, conversation: newConversation }

    } else {
        if(!targetUserId) return { success: false, error: "targetUserId is required"}

        const existingConversation = await prisma.conversation.findFirst({
            where: {
                OR: [
                    {
                        userIds: {
                            equals: [session.user.id, targetUserId]
                        }
                    },
                    {
                        userIds: {
                            equals: [targetUserId, session.user.id]
                        }
                    }
                ]
            },
            include: {
                users: true
            }
        })

        if(existingConversation) {
            return { success: true, error: null, conversation: existingConversation }
        } else {
            const newConversation = await prisma.conversation.create({
                data: {
                    users: {
                        connect: [
                            { id: session.user.id },
                            { id: targetUserId }
                        ]
                    }
                },
                include: {
                    users: true
                }
            })

            newConversation.users.forEach((user) => {
                pusherServer.trigger(user.id, "conversation:create", newConversation)
            })

            return { success: true, error: null, conversation: newConversation }
        }
    }
}

const deleteConversation = async (conversationId: string) => {

    const session = await getServerSession()

    if(!session) return { success: false, error: "Not authenticated" }

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

    try {

        const deletedConversation = await prisma.conversation.delete({
            where: {
                id: conversationId,
                userIds: {
                    hasSome: [session.user.id]
                }
            }
        })

        existingConversation.users.forEach((user) => {
            pusherServer.trigger(user.id, "conversation:delete", existingConversation)
        })

        return { success: true, error: null }

    } catch(error) {
        console.log(error)
        return { success: false, error: "Something went wrong" }
    }

}

export { createConversation, deleteConversation }