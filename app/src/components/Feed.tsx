"use client"
import React, { useEffect, useState } from 'react'
import { api } from '../../convex/_generated/api'

import { PostCard } from './PostCard';
import { Metadata } from 'next';
import { Anchor, Container } from '@mantine/core';

import Masonry from 'react-masonry-css';
import mansory from "@components/Feed/Feed.module.css";
import FilterByTags from './FilterByTags';

import { } from 'convex-helpers/react/cache/hooks';
import { Preloaded, useAction, usePreloadedQuery } from 'convex/react';

import { usefeed } from '../context/FeedContext';

import InfiniteScroll from 'react-infinite-scroller';
import PostCardLoading from './Post/PostCardLoading';
import { POST } from 'convex/post';


export const metadata = {
  title: "Feed",
  description: "Mira las ultimas noticias de tus compañeros universitarios",
} as Metadata

export const Feed = (props: {
  preloadedPosts: Preloaded<typeof api.post.getFeed>;
}) => {
  const [pageloaded, setPageLoaded] = useState(false)
  const [searchPosts, setSearchPosts] = useState<Array<POST>>()

  const postee = usePreloadedQuery(props.preloadedPosts).page
  const { posts, status, loadMore, isLoading, category, setCategory, searchValue } = usefeed()


  const vectorSearch = useAction(api.post.vectorSearch)

  const search = async () => {
    const AiSearchPost = await vectorSearch({ search: searchValue, type: "post" })
    setSearchPosts(AiSearchPost)
  }
  useEffect(() => {
    if (searchValue) {
      search()
    }
  }, [searchValue])

  useEffect(() => {
    if (status !== "LoadingFirstPage" && !pageloaded) {
      setPageLoaded(true)
    }
  }, [status])

  const breakpointColumnsObj = {
    1920: 6,
    1600: 3,
    1024: 3,
    900: 2,
    500: 1,
    default: 1,
  };
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
          {(pageloaded ? ((searchValue && searchPosts) ? searchPosts! : posts) : postee).map((post) => (
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
              author={post.asBussiness ? post.organization || "anonimo" : (post.anonimo ? "anonimo" : post.author || "anonimo")}
              imageData={post.imageData}
              likesBar={{
                userLiked: post.likedByTheUser,
                likes: post.likes || 0,
                dislikes: post.dislikes || 0,
              }}
              videoId={post.video}
            />)
          )}
        </Masonry>
      </InfiniteScroll>
      {status === "Exhausted" && (
        <div className="text-center text-gray-600 dark:text-gray-400">Esos fueron todos los posts, ya no hay más por aqui. Puedes ver aquí todos los <Anchor color="cyan" href="https://old.redsocialu.com" target='_blank'>posts antigüos</Anchor> </div>
      )}
      {/* <Button onClick={() => loadMore(13)} disabled={status !== "CanLoadMore"} loading={isLoading} fullWidth>Cargar Más Posts</Button> */}
    </Container>
  )
}
