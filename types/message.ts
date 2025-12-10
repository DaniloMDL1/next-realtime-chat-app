import { Message as MessageType, User as UserType } from "@/lib/generated/prisma/client";

export type FullMessageType = MessageType & {
    sender: UserType,
    seen: UserType[]
}