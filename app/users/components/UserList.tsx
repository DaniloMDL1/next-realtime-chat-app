import { User as UserType } from "@/lib/generated/prisma/client"
import UserItem from "./UserItem"

type Props = {
    users: UserType[]
}

const UserList = ({ users }: Props) => {
    return (
        <div className="fixed inset-y-0 lg:left-16 left-0 lg:pb-2 pb-[65px] lg:w-74 w-full overflow-y-auto lg:border-r px-3">

            <div className="py-2">
                <h2 className="lg:text-xl text-lg font-semibold">Users</h2>
            </div>
            
            <div className="flex flex-col">
                {users.map((user) => (
                    <UserItem key={user.id} user={user}/>
                ))}
            </div>

        </div>
    )
}
export default UserList