"use client"

import UserAvatar from "@/components/UserAvatar"
import { authClient } from "@/lib/auth-client"
import { cn } from "@/lib/utils"
import { FullMessageType } from "@/types/message"
import { format } from "date-fns"
import Image from "next/image"

type Props = {
    message: FullMessageType,
    isLast: boolean
}

const MessageItem = ({ message, isLast }: Props) => {

    const { data: session } = authClient.useSession()

    const isOwn = session?.user.id === message.senderId

    const seenList = (message.seen || []).filter((seenUser) => seenUser.id !== session?.user.id).map((seenUser) => seenUser.name).join(", ")

    return (
        <div className={cn("flex gap-2 p-3", isOwn && "justify-end")}>
            <div className={cn(isOwn && "order-2")}>
                <UserAvatar user={message.sender}/>
            </div>

            <div className={cn("flex flex-col", isOwn && "items-end")}>
                <div className="flex items-center gap-1">
                    <h3 className="font-medium">{message.sender.name}</h3>
                    <p className="text-muted-foreground text-sm">
                        {format(new Date(message.createdAt), "p")}
                    </p>
                </div>

                {message.text && (
                    <div className={cn("w-fit text-sm p-2 rounded-full", isOwn ? "bg-primary text-white" : "bg-neutral-100")}>
                        <p>{message.text}</p>
                    </div>
                )}

                {message.image && (
                    <div className="relative overflow-hidden rounded-lg w-full">
                        <Image 
                            src={message.image}
                            alt="Message Image"
                            width={250}
                            height={250}
                            className="object-cover"
                            loading="eager"
                        />
                    </div>
                )}

                {isLast && isOwn && seenList.length > 0 && (
                    <p className="text-sm text-muted-foreground">Seen by {seenList}</p>
                )}
            </div>

        </div>
    )
}
export default MessageItem