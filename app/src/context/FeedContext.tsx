"use client"
import { createContext, useContext, useEffect, useState } from "react";
import {Doc} from "@backend/dataModel";
import {api} from "@backend/api";
import {useStablePaginatedQuery} from "@hooks/useStablePaginatedQuery";
import React from "react";

interface FeedContext {
  category: CategoryState | null;
  setCategory: React.Dispatch<React.SetStateAction<CategoryState | null>>;
  posts: Doc<"post">[];
  status: "LoadingFirstPage" | "LoadingMore" | "CanLoadMore" | "Exhausted";
  loadMore: (numItems: number) => void;
  isLoading: boolean;
}

export const FeedStateContext = createContext<FeedContext | undefined>(
    undefined
)

export const usefeed = () => {
    const context = useContext(FeedStateContext)
    if (!context) throw new Error("There is no feedState provider")
    return context
}


type CategoryState = { color: string, name: string, value: string, variant: string }
export function FeedStateProvider({children}: {children: React.ReactNode}) {
  const [category, setCategory] = useState<CategoryState | null>(null)
  
  const {results:posts, status, loadMore, isLoading} = useStablePaginatedQuery(api.post.getFeed, {filterbyCategory: category?.value || undefined}, {initialNumItems: 10, })

    // useEffect(() => {
    //     if(isAuthenticated && !isLoading) {
    //         if(feed) {
    //             console.log(feed)
    //             const foundBussiness = businessAccounts.bussiness.find(bussines =>
    //                 bussines.members.some(member => member.email === feed.email)
    //             )
    //             console.log(foundBussiness)
    //             if(foundBussiness) {
    //                 setfeed({...feed, isMember: true, organization: foundBussiness})
    //                 console.log(feed)
    //             } else {
    //                 setfeed({...feed, isMember: false})}
    //             }
    //     }
    // }, [isLoading, isAuthenticated])


    return <FeedStateContext.Provider value={{ category, setCategory, posts, status, loadMore, isLoading }}>{children}</FeedStateContext.Provider>
}