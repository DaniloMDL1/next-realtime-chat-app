"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { Dispatch, SetStateAction } from "react"
import { Controller, useForm } from "react-hook-form"
import { z } from "zod"
import Select from "react-select"
import { User as UserType } from "@/lib/generated/prisma/client"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { createConversation } from "@/actions/conversationActions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

type Props = {
    open: boolean,
    setIsOpen: Dispatch<SetStateAction<boolean>>,
    users: UserType[]
}

const formSchema = z.object({
    name: z.string().min(2, "Name is required"),
    members: z.array(z.object({ label: z.string(), value: z.string() })).min(2, "2 members are required")
})

type FormDataType = z.infer<typeof formSchema>

const GroupChatDialog = ({ open, setIsOpen, users }: Props) => {

    const router = useRouter()

    const form = useForm<FormDataType>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            members: []
        }
    })

    const onCreateGroupChat = async (formData: FormDataType) => {
        const response = await createConversation({ isGroup: true, members: formData.members, name: formData.name })

        if(response.success && response.conversation) {
            toast.success("Group created successfully")
            setIsOpen(false)

            router.refresh()

        } else {
            toast.error(response.error)
        }
    }

    const options = users.map((user) => ({
        label: user.name,
        value: user.id
    }))

    return (
        <Dialog open={open} onOpenChange={setIsOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Start a Group Chat</DialogTitle>
                    <DialogDescription>
                        Connect with multiple people
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={form.handleSubmit(onCreateGroupChat)} className="">
                    <FieldGroup className="gap-4">
                        <Controller 
                            name="name"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>Group Name</FieldLabel>
                                    <Input 
                                        id={field.name}
                                        {...field}
                                        aria-invalid={fieldState.invalid}
                                        placeholder="Name"
                                    />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
                                </Field>
                            )}
                        />

                        <Controller 
                            name="members"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>Group Members</FieldLabel>

                                    <Select 
                                        isMulti
                                        isClearable
                                        isSearchable
                                        options={options}
                                        aria-invalid={fieldState.invalid}
                                        classNames={{
                                            control: (state) =>
                                                state.isFocused ? "!border-ring !ring-ring/50 !ring-[3px] !outline-none !shadow-none" : "border-input"
                                        }}
                                        {...field}
                                        onChange={field.onChange}
                                    />
                                    
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
                                </Field>
                            )}
                        />

                        <Button type="submit" disabled={form.formState.isSubmitting}>
                            {form.formState.isSubmitting ? <Spinner className="size-6"/> : "Create Group"}
                        </Button>

                    </FieldGroup>
                </form>
            </DialogContent>
        </Dialog>
    )
}
export default GroupChatDialog