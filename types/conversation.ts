import { Conversation as ConversationType, Message as MessageType, User as UserType } from "@/lib/generated/prisma/client";

export type ConversationMessageType = MessageType & {
    seen: UserType[]
}

export type FullConversationType = ConversationType & {
    users: UserType[],
    messages: ConversationMessageType[]
}

export type ConversationWithUsersType = ConversationType & {
    users: UserType[]
}