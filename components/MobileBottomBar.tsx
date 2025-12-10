"use client"

import useConversation from "@/hooks/useConversation"
import useRoutes from "@/hooks/useRoutes"
import { cn } from "@/lib/utils"
import Link from "next/link"

const MobileBottomBar = () => {

    const routes = useRoutes()

    const { isChatOpen } = useConversation()

    return (
        <div className={cn("lg:hidden fixed w-full border-t z-50 bg-background bottom-0 h-16", isChatOpen ? "hidden" : "block")}>

            <ul className="flex h-full">
                {routes.map((route) => (
                    <li onClick={route.onSignOut} className="flex-1 flex justify-center items-center border-r text-muted-foreground hover:text-foreground hover:bg-neutral-100" key={route.label}>
                        <Link href={route.href}>
                            <route.icon className="size-6"/>
                            <span className="sr-only">{route.label}</span>
                        </Link>
                    </li>
                ))}
            </ul>

        </div>
    )
}
export default MobileBottomBar