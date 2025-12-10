import PusherServer from "pusher"
import PusherClient from "pusher-js"

export const pusherServer = new PusherServer({
    appId: process.env.PUSHER_APP_ID!,
    secret: process.env.PUSHER_SECRET!,
    key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
    cluster: "eu",
    useTLS: true
})

export const pusherClient = new PusherClient(
    process.env.NEXT_PUBLIC_PUSHER_KEY!,
    {
        cluster: "eu",
        channelAuthorization: {
            endpoint: "/api/pusher/auth",
            transport: "ajax"
        }
    }
)