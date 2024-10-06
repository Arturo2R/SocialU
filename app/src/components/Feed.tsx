"use client"
import React, { useEffect, useState } from 'react'
import { api } from '../../convex/_generated/api'

import { PostCard } from './PostCard';
import { Metadata } from 'next';
import { Button, Container } from '@mantine/core';

import Masonry from 'react-masonry-css';
import mansory from "@components/Feed/Feed.module.css";
import FilterByTags from './FilterByTags';

import { } from 'convex-helpers/react/cache/hooks';
import { Preloaded, usePreloadedQuery } from 'convex/react';

import { usefeed } from '../context/FeedContext';

import InfiniteScroll from 'react-infinite-scroller';
import PostCardLoading from './Post/PostCardLoading';


export const metadata = {
  title: "Feed",
  description: "Mira las ultimas noticias de tus compañeros universitarios",
} as Metadata

export const Feed = (props: {
  preloadedPosts: Preloaded<typeof api.post.getFeed>;
}) => {
  const [pageloaded, setPageLoaded] = useState(false)

  const postee = usePreloadedQuery(props.preloadedPosts)
  const { posts, status, loadMore, isLoading, category, setCategory } = usefeed()

  const breakpointColumnsObj = {
    1920: 6,
    1600: 3,
    1024: 3,
    900: 2,
    500: 1,
    default: 1,
  };
  useEffect(() => {
    if (status !== "LoadingFirstPage" && !pageloaded) {
      setPageLoaded(true)
    }
  }, [status])

  return (
    <Container className="p-0 mb-10 md:mb-0">
      <FilterByTags category={category} categorySetter={setCategory} />
      <InfiniteScroll
        loadMore={() => loadMore(12)}
        hasMore={status === "CanLoadMore"}
        loader={<Masonry
          breakpointCols={breakpointColumnsObj}
          className={mansory.grid}
          columnClassName={mansory.column}
        >
          <PostCardLoading />
        </Masonry>
        }
        useWindow={true}
        threshold={350}
      >
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className={mansory.grid}
          columnClassName={mansory.column}
        >
          {(pageloaded ? posts : postee.page).map((post) => (
            <PostCard
              commentsQuantity={post.commentsCounter}
              description={post.renderMethod === "DangerouslySetInnerHtml" ? post.contentInHtml || post.content as string : post.content as string}
              key={post._id}
              title={post.title}
              viewsNumber={post.viewsCounter}
              tags={post.categoryValue ? [post.categoryValue] : (post?.tags || undefined)}
              priority={post.priority || false}
              slug={post.slug}
              postId={post._id}
              renderMethod={post.renderMethod}
              image={post.image}
              author={post.asBussiness ? post.author : (post.anonimo ? "anonimo" : post.author)}
              imageData={post.imageData}
            />)
          )}
        </Masonry>
      </InfiniteScroll>
      {status === "Exhausted" && (
        <div className="text-center text-gray-600 dark:text-gray-400">Esos fueron todos los posts, ya no hay más por aqui</div>
      )}
      {/* <Button onClick={() => loadMore(13)} disabled={status !== "CanLoadMore"} loading={isLoading} fullWidth>Cargar Más Posts</Button> */}
    </Container>
  )
}
