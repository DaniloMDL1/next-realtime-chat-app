"use client"

import { Spinner } from "@/components/ui/spinner";
import { UploadButton } from "@/utils/uploadthing";
import { ImageIcon, X } from "lucide-react";

type Props = {
    onChange: (url: string) => void,
}

const MessageImageUploader = ({ onChange }: Props) => {

    return (
        <UploadButton
            endpoint="messageImage"
            onClientUploadComplete={(res) => {
                onChange(res?.[0].ufsUrl)
            }}
            onUploadError={(error: Error) => {
                console.log(error)
            }}
            appearance={{
                allowedContent: "hidden",
            }}
            content={{
                button: ({ isUploading }) => {
                    if(isUploading) {
                        return <Spinner className="text-primary size-6"/>
                    }

                    return <ImageIcon className="size-6 text-primary"/>
                }
            }}
        />
    )
}
export default MessageImageUploader