"use client"
import { createContext, useContext, useEffect, useState } from "react";
import { Doc } from "@backend/dataModel";
import { api } from "../../convex/_generated/api";
import { useStablePaginatedQuery } from "@hooks/useStablePaginatedQuery";
import React from "react";
import { usePaginatedQuery } from "convex/react";
import { useQuery } from "convex-helpers/react/cache/hooks";

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
export function FeedStateProvider({ children }: { children: React.ReactNode }) {
  const [category, setCategory] = useState<CategoryState | null>(null)
  // const query = useQuery(api.post.getFeed, { filterbyCategory: category?.value || undefined, paginationOpts: { cursor: null, numItems: 10 } })

  const { results: posts, status, loadMore, isLoading } = usePaginatedQuery(api.post.getFeed, { filterbyCategory: category?.value || undefined }, { initialNumItems: 10, })




  return <FeedStateContext.Provider value={{ category, setCategory, posts, status, loadMore, isLoading }}>{children}</FeedStateContext.Provider>
}