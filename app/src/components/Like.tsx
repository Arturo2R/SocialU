import { api } from "@backend/api";
import { Id } from "@backend/dataModel";
import { Text } from "@mantine/core";
import { useToggle } from "@mantine/hooks";
import { IconThumbDown } from "@tabler/icons-react"
import { IconThumbDownFilled } from "@tabler/icons-react"
import { IconThumbUp, IconThumbUpFilled } from "@tabler/icons-react"
import clsx from "clsx";
import { useMutation } from "convex/react";
import { i } from "node_modules/@clerk/clerk-react/dist/controlComponents-B9SlJ0L1.mjs";
import { useEffect, useState } from "react";
import { map } from "svix/dist/openapi/rxjsStub";

interface LikeButtonProps {
    likes: number;
    liked: boolean;
    onClick: () => void;
    positive: boolean;
    likeText: string;
}

export const BigLikeButton = ({ likes, liked, onClick, positive, likeText }: LikeButtonProps) => {
    return (
        <button type="button" onClick={onClick} className={clsx("flex flex-col items-center p-3 bg-transparent border rounded-lg max-w-[12rem]", { 'border-green-400 hover:bg-green-300/15 dark:hover:bg-green-100/10 hover:shadow-md hover:shadow-green-200 shadow-none': positive, 'border-red-700 hover:bg-red-100/20 hover:shadow-red-300 dark:hover:bg-red-200/20 hover:shadow-md shadow-none': !positive })}>
            <div className={clsx("flex ", { 'items-end mb-2': positive, 'items-start mt-2': !positive })} >
                {positive ?
                    (liked ? <IconThumbUpFilled className="text-green-400" size={32} stroke={1} /> : <IconThumbUp className="text-green-400" size={32} stroke={1} />) :
                    (liked ? <IconThumbDownFilled size={32} stroke={1} className="text-red-700" /> : <IconThumbDown size={32} stroke={1} className="text-red-700" />)
                }
                <span className="ml-1">{likes}</span>
            </div>
            <span className="">{likeText}</span>
        </button>
    )
}

interface LikeWallInterface {
    postId: Id<"post">;
    serverLiked: 'like' | 'dislike' | undefined;
    likes: number;
    dislikes: number;
    likeText: {
        positive: string;
        negative: string;
    };
}

const reverseMap = (map: Map<any, any>) => new Map(Array.from(map, ([key, value]) => [value, key]))


export const LikesWall = ({ postId, serverLiked, likes, dislikes, likeText }: LikeWallInterface) => {
    const [value, toggle] = useToggle(['none', 'liked', 'disliked'] as const);

    const reactiongetted: Map<'liked' | 'disliked' | 'none', 'like' | 'dislike' | undefined> = new Map([['liked', 'like'], ['disliked', 'dislike'], ['none', undefined]])
    const reactiongettedReverse = reverseMap(reactiongetted)

    useEffect(() => {
        toggle(reactiongettedReverse.get(serverLiked))
    }
        , [])

    const [likesCounter, setLikesCounter] = useState<number>(0)
    const [dislikesCounter, setDislikesCounter] = useState<number>(0)

    useEffect(() => {
        setLikesCounter(likes)
    }, [likes])

    useEffect(() => {
        setDislikesCounter(dislikes)
    }, [dislikes])

    const reacto = useMutation(api.reaction.give)

    const onLikeChange = (interaction: 'liked' | 'disliked') => {
        reacto({ content_type: 'post', postId: postId, reaction_type: reactiongetted.get(interaction)! });
        value === interaction ? toggle('none') : toggle(interaction);
        if (value === interaction) {
            interaction === 'liked' ? setLikesCounter(likes - 1) : setDislikesCounter(dislikes - 1)
        } else {
            interaction === 'liked' ? setLikesCounter(likes + 1) : setDislikesCounter(dislikes + 1)
        }
    }

    return (
        <div className="grid-cols-2 grid gap-x-3 max-w-full sm:max-w-[21rem]">
            <BigLikeButton onClick={() => onLikeChange("liked")} likeText={likeText.positive} positive liked={value == "liked"} likes={likesCounter} />
            <BigLikeButton onClick={() => onLikeChange("disliked")} likeText={likeText.negative} positive={false} liked={value == "disliked"} likes={dislikesCounter} />
        </div>
    )
}

export interface likesBarInterface {
    likes: number;
    dislikes: number;
    userLiked: 'like' | 'dislike' | undefined;
    contentId?: Id<"post"> | Id<"comment">;
    showIfZero?: boolean;
}

export const LikesBar = (props: likesBarInterface) => {
    const reacto = useMutation(api.reaction.give)


    const onLikeChange = (interaction: 'like' | 'dislike') => {
        if (props.contentId) {
            reacto({ content_type: 'post', postId: props.contentId, reaction_type: interaction });
        }
    }
    return (
        <div className="flex items-center space-x-2">
            {((props.likes > 0) || props.showIfZero) && (
                <div className="flex items-center" onClick={() => onLikeChange("like")} >
                    {props.userLiked === "like" ? <IconThumbUpFilled className="text-green-400" size={props.showIfZero ? 24 : 16} stroke={1} /> : <IconThumbUp className="text-green-400" size={props.showIfZero ? 24 : 16} stroke={1} />}
                    <Text size="xs" c="dimmed">{props.likes}</Text>
                </div>

            )}
            {((props.dislikes > 0) || props.showIfZero) && (
                <div className="flex items-center" onClick={() => onLikeChange("dislike")}>
                    {props.userLiked === "dislike" ? <IconThumbDownFilled size={props.showIfZero ? 24 : 16} stroke={1} className="text-red-700" /> : <IconThumbDown size={props.showIfZero ? 24 : 16} stroke={1} className="text-red-700" />}
                    <Text size="xs" c="dimmed">{props.dislikes}</Text>
                </div>
            )}
        </div>
    )
}
