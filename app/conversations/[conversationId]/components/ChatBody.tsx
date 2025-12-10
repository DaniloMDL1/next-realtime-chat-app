"use client"

import { FullMessageType } from "@/types/message"
import MessageItem from "./MessageItem"
import { useEffect, useRef, useState } from "react"
import useConversation from "@/hooks/useConversation"
import { markAsSeen } from "@/actions/messageActions"
import { pusherClient } from "@/lib/pusher"

type Props = {
    conversationMessages: FullMessageType[]
}

const ChatBody = ({ conversationMessages }: Props) => {
    const [messages, setMessages] = useState(conversationMessages)
    const { conversationId } = useConversation()
    
    const bottomRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        const markAsSeenAction = async () => {
            await markAsSeen(conversationId)
        } 

        markAsSeenAction()

    }, [conversationId])

    useEffect(() => {

        pusherClient.subscribe(conversationId)

        bottomRef.current?.scrollIntoView({ behavior: "smooth" })

        const handleCreateMessage = (newMessage: FullMessageType) => {
            markAsSeen(conversationId)

            setMessages((prev) => {
                const existingMessage = prev.find((message) => message.id === newMessage.id)

                if(existingMessage) {
                    return prev
                }

                return [...prev, newMessage]
            })

            bottomRef.current?.scrollIntoView({ behavior: "smooth" })
        }

        const handleUpdateMessage = (updatedMessage: FullMessageType) => {
            setMessages((prev) => {
                const updatedMessages = prev.map((message) => {
                    if(message.id === updatedMessage.id) {
                        return updatedMessage
                    }

                    return message
                })

                return updatedMessages
            })
        }

        pusherClient.bind("messages:create", handleCreateMessage)
        pusherClient.bind("message:update", handleUpdateMessage)

        return () => {
            pusherClient.unsubscribe(conversationId)
            pusherClient.unbind("messages:create", handleCreateMessage)
            pusherClient.unbind("message:update", handleUpdateMessage)
        }

    }, [conversationId])

    return (
        <div className="flex-1 p-2 overflow-y-auto">

            {messages.map((message, index) => (
                <MessageItem
                    isLast={index === messages.length - 1} 
                    key={message.id}
                    message={message}
                />
            ))}

            <div ref={bottomRef} className="pt-20"/>
        </div>
    )
}
export default ChatBody