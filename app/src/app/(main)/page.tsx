// import { fetchQuery, preloadQuery } from "convex/nextjs";
import React from 'react'
import { api } from '@backend/api'
import {Feed} from "@components/Feed";
import { preloadQuery } from 'convex/nextjs';

type Props = {}

const MainPage = async (props: Props) => {
  const preloadedTasks = await preloadQuery(api.post.getFeed, {filterbyCategory: undefined, paginationOpts: {cursor: null, numItems: 10}}, );
  return (
    <>
      <Feed 
        preloadedPosts={preloadedTasks}
      />
    </>
  )
}

export default MainPage