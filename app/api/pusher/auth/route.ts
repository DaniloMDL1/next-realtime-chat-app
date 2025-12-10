import { getServerSession } from "@/lib/get-session";
import { pusherServer } from "@/lib/pusher";
import { NextResponse } from "next/server";

export async function POST(request: Request) {

    const session = await getServerSession()

    if(!session) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    const data = await request.formData()

    const socketId = data.get("socket_id") as string
    const channel = data.get("channel_name") as string

    const userData = {
        user_id: session.user.id
    }

    try {
        const authResponse = pusherServer.authorizeChannel(socketId, channel, userData)

        return new NextResponse(JSON.stringify(authResponse))

    } catch(error) {
        console.log(error)
        return new NextResponse("Something went wrong", { status: 500 })
    }

}