import { pusherClient } from "@/lib/pusher"
import { useActiveListStore } from "@/lib/store/useActiveListStore"
import { Channel, Members } from "pusher-js"
import { useEffect, useState } from "react"

const useActiveChannel = () => {
    const [activeChannel, setActiveChannel] = useState<Channel | null>(null)

    const { add, remove, set } = useActiveListStore()

    useEffect(() => {
        let channel = activeChannel

        if(!channel) {
            channel = pusherClient.subscribe("presence-realtimechatapp")
            setActiveChannel(channel)
        }

        channel.bind("pusher:subscription_succeeded", (members: Members) => {
            const initialMembers: string[] = []

            members.each((member: Record<string, any>) => initialMembers.push(member.id))

            set(initialMembers)
        })

        channel.bind("pusher:member_added", (member: Record<string, any>) => {
            add(member.id)
        })

        channel.bind("pusher:member_removed", (member: Record<string, any>) => {
            remove(member.id)
        })

        return () => {
            if(activeChannel) {
                pusherClient.unsubscribe("presence-realtimechatapp")
                setActiveChannel(null)
            }
        }

    }, [activeChannel, set, add, remove])
 
}
export default useActiveChannel