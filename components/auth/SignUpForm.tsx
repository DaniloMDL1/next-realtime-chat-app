"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field"
import { z } from "zod"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { authClient } from "@/lib/auth-client"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Spinner } from "../ui/spinner"

const signUpFormSchema = z.object({
    name: z.string().min(3, "Name is required"),
    email: z.email({ error: "Invalid email address" }),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string()
})
.refine((data) => data.confirmPassword === data.password, {
    path: ["confirmPassword"],
    error: "Passwords must match"
})

type SignUpFormDataType = z.infer<typeof signUpFormSchema>

const SignUpForm = () => {

    const router = useRouter()

    const form = useForm<SignUpFormDataType>({
        resolver: zodResolver(signUpFormSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: ""
        }
    })

    const onSignUp = async (formData: SignUpFormDataType) => {
        try {
            await authClient.signUp.email(
                {
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    callbackURL: "/users"
                },
                {
                    onSuccess: () => {
                        toast.success("Signed up successfully")

                        router.push("/users")
                    },
                    onError: (ctx) => {
                        toast.error(ctx.error.message)
                    }
                }
            )


        } catch(error) {
            console.log(error)
        }

    }

    return (
        <Card className="max-w-sm w-full">
            <CardHeader>
                <CardTitle>Sign Up</CardTitle>
                <CardDescription>Enter your information to create an account</CardDescription>
            </CardHeader>
            <CardContent className="-mt-4">
                <form onSubmit={form.handleSubmit(onSignUp)}>
                    <FieldGroup className="gap-4">

                        <Controller
                            name="name"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                                    <Input
                                        {...field}
                                        id={field.name}
                                        aria-invalid={fieldState.invalid}
                                        placeholder="Name"
                                    />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />

                        <Controller
                            name="email"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>Email Address</FieldLabel>
                                    <Input
                                        {...field}
                                        id={field.name}
                                        aria-invalid={fieldState.invalid}
                                        placeholder="Email Address"
                                    />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />

                        <Controller
                            name="password"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                                    <Input
                                        {...field}
                                        id={field.name}
                                        aria-invalid={fieldState.invalid}
                                        type="password"
                                        placeholder="Password"
                                    />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />

                        <Controller
                            name="confirmPassword"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>Confirm Password</FieldLabel>
                                    <Input
                                        {...field}
                                        id={field.name}
                                        aria-invalid={fieldState.invalid}
                                        type="password"
                                        placeholder="Confirm Password"
                                    />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />

                        <Button disabled={form.formState.isSubmitting} type="submit">
                            {form.formState.isSubmitting ? <Spinner className="size-6"/> : "Sign Up"}
                        </Button>

                    </FieldGroup>
                </form>

            </CardContent>

            <CardFooter className="-mt-4">
                <Link className="hover:underline hover:text-primary" href={"/signin"}>
                    Already have an account? Sign In
                </Link>
            </CardFooter>
        </Card>
    )
}
export default SignUpForm