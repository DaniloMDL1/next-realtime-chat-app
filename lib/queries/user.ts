import { getServerSession } from "../get-session"
import prisma from "../prisma"

const getUsers = async () => {

    const session = await getServerSession()

    if(!session) {
        return []
    }

    try {
        const users = await prisma.user.findMany({
            where: {
                id: { not: session.user.id }
            }
        })

        return users

    } catch(error) {
        console.log(error)
        return []
    }

}

const getUser = async () => {

    const session = await getServerSession()

    if(!session) return null

    try {

        const user = await prisma.user.findUnique({
            where: { id: session.user.id }
        })

        return user

    } catch(error) {
        console.log(error)
        return null
    }
}

export { getUsers, getUser }