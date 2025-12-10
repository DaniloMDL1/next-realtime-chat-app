"use client"

import { createMessage } from "@/actions/messageActions"
import { Button } from "@/components/ui/button"
import useConversation from "@/hooks/useConversation"
import { Send } from "lucide-react"
import { useActionState, useEffect, useState } from "react"
import MessageImageUploader from "./MessageImageUploader"

const ChatFooter = () => {
    const [text, setText] = useState("")
    const [image, setImage] = useState("")

    const { conversationId } = useConversation()

    const [state, formAction, isPending] = useActionState(createMessage, { success: false, error: null })

    useEffect(() => {
        if(state.success) {
            setText("")
            setImage("")
        }

    }, [state])

    return (
        <div className="border-t">
            <form action={formAction} autoComplete="off" className="flex items-center gap-2 h-16 px-4">
                <input type="hidden" name="conversationId" value={conversationId}/>

                <MessageImageUploader 
                    onChange={(url) => {
                        setImage(url)
                    }}
                />

                <input type="hidden" name="image" value={image}/>

                <input 
                    type="text"
                    placeholder="Type something?!"
                    className="outline-none border-none flex-1"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    name="text"
                />

                <Button disabled={isPending || (!text && !image)} type="submit" variant={"ghost"}>
                    <Send className="text-primary size-6"/>
                </Button>
            </form>
        </div>
    )
}
export default ChatFooter