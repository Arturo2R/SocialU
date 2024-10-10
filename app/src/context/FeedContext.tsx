"use client"
import { createContext, useContext, useEffect, useState } from "react";
import { Doc } from "@backend/dataModel";
import { api } from "../../convex/_generated/api";
import { useStablePaginatedQuery } from "@hooks/useStablePaginatedQuery";
import React from "react";

import { likes, POST } from "convex/post";
import { useDebouncedState } from "@mantine/hooks";

// export type feedPost = Doc<"post"> & likes

interface FeedContext {
  category: CategoryState | null;
  setCategory: React.Dispatch<React.SetStateAction<CategoryState | null>>;
  posts: POST[];
  status: "LoadingFirstPage" | "LoadingMore" | "CanLoadMore" | "Exhausted";
  loadMore: (numItems: number) => void;
  isLoading: boolean;
  setSearch: (value: React.SetStateAction<string>) => void;
  searchValue: string;
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
  const [searchValue, setSearch] = useDebouncedState('', 200);
  // const query = useQuery(api.post.getFeed, { filterbyCategory: category?.value || undefined, paginationOpts: { cursor: null, numItems: 10 } })

  const { results: posts, status, loadMore, isLoading } = useStablePaginatedQuery(api.post.getFeed, { filterbyCategory: category?.value || undefined, search: searchValue || undefined }, { initialNumItems: 10, })




  return <FeedStateContext.Provider value={{ category, setCategory, posts, status, loadMore, isLoading, setSearch, searchValue }}>{children}</FeedStateContext.Provider>
}