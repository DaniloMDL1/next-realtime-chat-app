import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./lib/prisma";

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "mongodb",
    }),
    advanced: {
        database: {
            generateId: false
        }
    },
    emailAndPassword: {
        enabled: true,
        minPasswordLength: 6,
        autoSignIn: true
    },
    socialProviders: {
        github: {
            clientId: process.env.GITHUB_CLIENT_ID as string,
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string
        }
    }
});

export type SessionType = typeof auth.$Infer.Session
export type AuthUserType = typeof auth.$Infer.Session.user