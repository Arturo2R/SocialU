"use client"
import { createContext, useContext, useEffect, useState } from "react";
import {Doc} from "@backend/dataModel";
import {api} from "@backend/api";
import { useConvexAuth } from "convex/react";
import { useQuery } from "convex-helpers/react/cache/hooks";
import businessAccounts from "@lib/bussiness_accounts.json";





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

export type UserState = justuser |  userorg | null

export function UserStateProvider({children}: {children: React.ReactNode}) {
    const [SuperUser, setUser] = useState<UserState>(null)
    
    const { isLoading, isAuthenticated } = useConvexAuth();
    let user = useQuery(api.user.current);

    useEffect(() => {
        if(isAuthenticated && !isLoading) {
            if(user) {
                console.log(user)
                const foundBussiness = businessAccounts.bussiness.find(bussines =>
                    bussines.members.some(member => member.email === user.email)
                ) as Doc<"organization"> | undefined
                console.log(foundBussiness)
                if(foundBussiness) {
                    setUser({...user, isMember: true, organization: foundBussiness})
                    console.log(user)
                } else {
                    setUser({...user, isMember: false})}
                }
        }
    }, [isLoading, isAuthenticated, user])


    return <UserStateContext.Provider value={SuperUser}>{children}</UserStateContext.Provider>
}