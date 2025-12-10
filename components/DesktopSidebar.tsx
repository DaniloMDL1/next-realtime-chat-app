"use client"

import useRoutes from "@/hooks/useRoutes"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { User as UserType } from "@/lib/generated/prisma/client"
import UserAvatar from "./UserAvatar"

type Props = {
    user: UserType
}

const DesktopSidebar = ({ user }: Props) => {

    const routes = useRoutes()

    return (
        <div className="hidden lg:fixed lg:z-50 lg:left-0 lg:inset-y-0 lg:border-r lg:w-16 lg:px-4 lg:flex lg:flex-col lg:justify-between lg:items-center lg:pb-4 lg:pt-3">

            <ul className="flex flex-col items-center gap-2">
                {routes.map((route) => (
                    <li onClick={route.onSignOut} className={cn("hover:bg-neutral-100 p-2 rounded-lg text-muted-foreground hover:text-foreground", route.isActive && "text-foreground bg-neutral-100")} key={route.label}>
                        <Link className="" href={route.href}>
                            <route.icon className="size-6"/>
                            <span className="sr-only">{route.label}</span>
                        </Link>
                    </li>
                ))}
            </ul>

            <button className="cursor-pointer">
                <UserAvatar user={user}/>
            </button>
        </div>
    )
}
export default DesktopSidebar