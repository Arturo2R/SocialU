// Base styles for media player and provider (~400B).
import '@vidstack/react/player/styles/base.css';
import { MediaPlayer, MediaProvider, Poster } from '@vidstack/react';
import Image from 'next/image';
import { defaultLayoutIcons, DefaultVideoLayout, DefaultAudioLayout } from '@vidstack/react/player/layouts/default';
// import { defaultLayoutIcons, DefaultVideoLayout } from '@vidstack/react/types/vidstack-react.js';
import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/video.css';

export interface VidePlayerInterface {
    playbackId?: string;
    poster?: string;
    source?: string;
    title?: string;
    aspectRatio?: string;
}

export const VideoPlayer = (props: VidePlayerInterface) => {
    return (
        <MediaPlayer playsInline
            title={props.title || "Sprite Fight"}
            src={props.playbackId ? `https://stream.mux.com/${props.playbackId}.m3u8?redundant_streams=true` : props.source}
            viewType='video'
            streamType='on-demand'
            logLevel='warn'
            className="mb-6"
            crossOrigin
            // preload="metadata"
            aspectRatio={props.aspectRatio}
        >
            <MediaProvider >
                <Poster asChild>
                    <Image className="absolute rounded-lg inset-0 block h-full w-full bg-black  opacity-0 transition-opacity data-[visible]:opacity-100 [&>img]:h-full [&>img]:w-full [&>img]:object-cover"
                        src={props.poster ? props.poster : `https://image.mux.com/${props.playbackId}/thumbnail.png?width=1920&height=1080&time=2` || 'https://files.vidstack.io/sprite-fight/poster.webp'}
                        width={1920} height={1080} alt="A description of my image."
                    />
                </Poster>
            </MediaProvider>
            <DefaultAudioLayout icons={defaultLayoutIcons} />
            <DefaultVideoLayout icons={defaultLayoutIcons} />
        </MediaPlayer>
    )
}