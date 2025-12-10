import Sidebar from "@/components/Sidebar"
import { ReactNode } from "react"
import UserList from "./components/UserList"
import { getUsers } from "@/lib/queries/user"

type Props = {
    children: ReactNode
}

const UsersLayout = async ({ children }: Props) => {

    const users = await getUsers()

    return (
        <Sidebar>
            <div className="h-full">
                <UserList users={users}/>
                {children}
            </div>
        </Sidebar>
    )
}
export default UsersLayout