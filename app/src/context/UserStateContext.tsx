"use client"
import { createContext, useContext, useEffect, useState } from "react";
import { api } from "@backend/api";
// import { useConvexAuth } from "convex/react";
import { useQuery } from "convex-helpers/react/cache/hooks";
import businessAccounts from "@lib/bussiness_accounts.json";
import { useAuth } from "@clerk/nextjs";
import { Doc } from "@backend/dataModel";
import { useConvexAuth, useConvex } from "convex/react";





export const UserStateContext = createContext<UserState | undefined>(
    undefined
)

export const useUser = () => {
    const context = useContext(UserStateContext)
    if (!context) throw new Error("There is no UserState provider")
    return context
}

interface userorg extends Doc<"user"> {
    isMember: true;
    organization: Doc<"organization">;
}
interface justuser extends Doc<"user"> {
    isMember: false;
}


export type UserObject = justuser | userorg | null

export type UserState = { user: UserObject, isLoading: boolean, isAuthenticated?: boolean }

export function UserStateProvider({ children }: { children: React.ReactNode }) {
    const [SuperUser, setUser] = useState<UserState["user"]>(null)
    const convex = useConvex()
    // let user: Doc<"user"> | null = null;
    const [user, setuser] = useState<Doc<"user"> | null>(null)
    // const { isLoading, isAuthenticated } = useConvexAuth();
    const { isLoading, isAuthenticated } = useConvexAuth()
    const [isMember, setMembresy] = useState<boolean>(false)
    // user = useQuery(api.user.current);
    const getUser = async () => {
        let usernow = await convex.query(api.user.current)
        setuser(usernow)
    }
    useEffect(() => {
        if (isAuthenticated && !isLoading) {
            console.log(isLoading, isAuthenticated)
            try {
                getUser()
            } catch (error) {
                console.error(error)
            }
            if (user) {
                console.log("user,", user)
                const foundBussiness = businessAccounts.bussiness.find(bussines =>
                    bussines.members.some(member => member.email === user?.email)
                ) as Doc<"organization"> | undefined
                // console.log(foundBussiness)
                if (foundBussiness) {
                    setUser({ ...user, isMember: true, organization: foundBussiness })
                    setMembresy(true)
                } else {
                    setUser({ ...user, isMember: false })
                    setMembresy(false)
                }
            }
            localStorage.setItem("user", JSON.stringify(user));
            console.log("user,", user)
        }
    }, [isLoading, isAuthenticated, user])


    return <UserStateContext.Provider value={{ user: SuperUser, isLoading, isAuthenticated }}>{children}</UserStateContext.Provider>
}