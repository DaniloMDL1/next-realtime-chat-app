import { authClient } from "@/lib/auth-client"
import { LogOut, MessageCircle, Users } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { toast } from "sonner"

const useRoutes = () => {
    const pathname = usePathname()

    const router = useRouter()

    const handleSignOut = async () => {
        try {
            await authClient.signOut(
                {
                    fetchOptions: {
                        onSuccess: () => {
                            router.push("/signin")
                            toast.success("Signed out successfully")
                        }
                    }
                }
            )
             
        } catch(error) {
            console.log(error)
        }
    }

    const routes = [
        {
            label: "Conversations",
            href: "/conversations",
            icon: MessageCircle,
            isActive: pathname === "/conversations"
        },
        {
            label: "Users",
            href: "/users",
            icon: Users,
            isActive: pathname === "/users"
        },
        {
            label: "SignOut",
            href: "#",
            icon: LogOut,
            onSignOut: handleSignOut
        }
    ]

    return routes

}
export default useRoutes