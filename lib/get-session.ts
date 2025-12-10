import { auth } from "@/auth"
import { headers } from "next/headers"

const getServerSession = async () => {

    const session = await auth.api.getSession({
        headers: await headers()
    })

    return session
}

export { getServerSession }