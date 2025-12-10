import { User as UserType } from "@/lib/generated/prisma/client"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { getInitials } from "@/lib/utils"

type Props = {
    users: UserType[]
}

const AvatarGroup = ({ users }: Props) => {
    const slicedUsers = users.slice(0, 3)

    return (
        <div className="relative inline-block -top-2">
            <div className="flex gap-1">
                {slicedUsers.slice(0, 2).map((user) => (
                    <Avatar key={user.id} className="size-6">
                        <AvatarImage src={user?.image ?? undefined} />
                        <AvatarFallback>
                            {user?.name && getInitials(user.name)}
                        </AvatarFallback>
                    </Avatar>
                ))}
            </div>
            {slicedUsers[2] && (
                <div className="absolute left-3">
                    <Avatar className="size-6">
                        <AvatarImage src={slicedUsers[2].image ?? undefined} />
                        <AvatarFallback>
                            {slicedUsers[2].name && getInitials(slicedUsers[2].name)}
                        </AvatarFallback>
                    </Avatar>
                </div>
            )}
        </div>
    )
}
export default AvatarGroup