import { ReactNode } from "react"
import DesktopSidebar from "./DesktopSidebar"
import MobileBottomBar from "./MobileBottomBar"
import { redirect } from "next/navigation"
import { getUser } from "@/lib/queries/user"

type Props = {
    children: ReactNode
}

const Sidebar = async ({ children }: Props) => {

    const user = await getUser()

    if(!user) {
        redirect("/signin")
    }

    return (
        <div className="h-full">
            <DesktopSidebar user={user}/>
            <MobileBottomBar />
            <div className="h-full">
                {children}
            </div>
        </div>
    )
}
export default Sidebar