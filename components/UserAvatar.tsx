import { User as UserType } from "@/lib/generated/prisma/client"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { getInitials } from "@/lib/utils"
import { useActiveListStore } from "@/lib/store/useActiveListStore"

type Props = {
    user: UserType,
    size?: string
}

const UserAvatar = ({ user, size }: Props) => {

    const members = useActiveListStore((state) => state.members)

    const isOnline = members.includes(user.id)

    return (
        <div className="relative w-fit">
            <Avatar className={`${size ? size : "size-10"}`}>
                <AvatarImage src={user?.image ?? undefined} />
                <AvatarFallback>
                    {user?.name && getInitials(user.name)}
                </AvatarFallback>
            </Avatar>
            
            {isOnline && (
                <span className="border-2 border-background absolute -top-0.5 -right-0.5 size-3 rounded-full bg-green-500">
                    <span className="sr-only">Online</span>    
                </span>
            )}

        </div>
    )
}
export default UserAvatar