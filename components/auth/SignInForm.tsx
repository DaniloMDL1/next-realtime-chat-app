"use client"

import { Controller, useForm } from "react-hook-form"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import Link from "next/link"
import { authClient } from "@/lib/auth-client"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Spinner } from "../ui/spinner"
import { Separator } from "../ui/separator"
import Image from "next/image"

const signInFormSchema = z.object({
    email: z.email({ error: "Invalid email address" }),
    password: z.string().min(6, "Password must be at least 6 characters")
})

type SignInFormDataType = z.infer<typeof signInFormSchema>

const SignInForm = () => {

    const router = useRouter()

    const form = useForm<SignInFormDataType>({
        resolver: zodResolver(signInFormSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    })

    const onSignIn = async (formData: SignInFormDataType) => {
        try {
            await authClient.signIn.email(
                {
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

    const handleGithubSignIn = async () => {
        try {

            await authClient.signIn.social({
                provider: "github",
                callbackURL: "/users"
            })

        } catch(error) {
            console.log(error)
        }
    }

    return (
        <Card className="max-w-sm w-full">
            <CardHeader>
                <CardTitle>Sign In</CardTitle>
                <CardDescription>Enter the information to access your account</CardDescription>
            </CardHeader>
            <CardContent className="-mt-4">
                <form onSubmit={form.handleSubmit(onSignIn)}>
                    <FieldGroup className="gap-4">

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

                        <Button disabled={form.formState.isSubmitting} type="submit">
                            {form.formState.isSubmitting ? <Spinner className="size-6"/> : "Sign In"}
                        </Button>

                    </FieldGroup>
                </form>

                <div className="flex items-center gap-2 my-2">
                    <Separator orientation="horizontal" className="flex-1"/>
                    <p>OR</p>
                    <Separator orientation="horizontal" className="flex-1"/>
                </div>

                <Button onClick={handleGithubSignIn} variant={"outline"} className="w-full">
                    <Image 
                        src={"/github.png"}
                        alt="Github Image"
                        width={20}
                        height={20}
                    />
                    <span>Github</span>
                </Button>
            </CardContent>

            <CardFooter className="-mt-4">
                <Link className="hover:underline hover:text-primary" href={"/signup"}>
                    Don't have an account? Sign Up
                </Link>
            </CardFooter>
        </Card>
    )
}
export default SignInForm