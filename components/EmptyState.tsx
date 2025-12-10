import { MessageCircle } from "lucide-react"

const EmptyState = () => {
    return (
        <div className="flex justify-center items-center h-full bg-slate-100 p-4">
            <div className="flex flex-col items-center gap-2">
                <MessageCircle className="size-8 text-primary"/>

                <div className="text-center">
                    <h2 className="text-xl max-md:text-lg font-semibold text-muted-foreground">
                        No conversation selected
                    </h2>

                    <p className="text-muted-foreground/80">
                        Choose an existing chat from the sidebar or start a new one
                    </p>
                </div>
            </div>
        </div>
    )
}
export default EmptyState