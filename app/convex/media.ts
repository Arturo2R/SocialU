"use node";

import { v } from 'convex/values';
import { api } from './_generated/api';
import { action } from './_generated/server';
import crypto from 'crypto';


export const generateUploadVideoUrl = action({
    handler: async (ctx, args) => {
        const videoId = crypto.randomUUID()
        await ctx.runQuery(api.user.current)
        const { default: Mux } = await import('@mux/mux-node');

        // const videoId = await ctx.storage.store(args.video);
        const mux = new Mux({
            tokenId: process.env.MUX_TOKEN_ID,
            tokenSecret: process.env.MUX_TOKEN_SECRET
        });

        const upload = await mux.video.uploads.create({
            cors_origin: process.env.CONVEX_SITE_URL!,
            new_asset_settings: {
                passthrough: videoId,
                playback_policy: ['public'],
                encoding_tier: 'baseline',
                max_resolution_tier: "1080p",
                "input": [{
                    "url": "https://hallowed-hound-764.convex.cloud/api/storage/e23b65af-a823-4ea0-b5ba-691af1714e2f",
                    "overlay_settings": {
                        "vertical_align": "bottom",
                        "vertical_margin": "5%",
                        "horizontal_align": "right",
                        "horizontal_margin": "5%",
                        "width": "14%",
                        "opacity": "90%"
                    }
                }]

            },

        })
        console.log("upload", upload)
        console.log("assetid", upload.asset_id)

        return { url: upload.url, mux_asset_id: upload.id, videoId }
    }
})



export const getUploadedVideoUrl = action({
    args: {
        uploadId: v.string()
    },
    handler: async (ctx, args) => {
        await ctx.runQuery(api.user.currentLogged)
        const { default: Mux } = await import('@mux/mux-node');

        // const videoId = await ctx.storage.store(args.video);
        const mux = new Mux({
            tokenId: '2086071e-7cfb-496a-98ce-2f1c60b7931d', // process.env.MUX_TOKEN_ID,
            tokenSecret: 'S0ys3Bho8rfP9XSERINg/a8C7bym1J312GeCHzGwh76R96Ll6HVgIM0qS6yZYgqggjSSMzi+4k6', //process.env.MUX_TOKEN_SECRET
        });
        let upload = await mux.video.uploads.retrieve(args.uploadId)

        while (upload.status !== 'asset_created') {
            switch (upload.status) {
                case 'errored':
                    throw new Error('Video upload failed')
                case 'cancelled':
                    throw new Error('Video upload cancelled')
                case 'timed_out':
                    throw new Error('Video upload timed out')
            }

            await new Promise(resolve => setTimeout(resolve, 1000));
            upload = await mux.video.uploads.retrieve(args.uploadId)
        }
        let asset = await mux.video.assets.retrieve(upload.asset_id!)
        console.log("asset", asset)

        while (asset.status !== 'ready') {
            if (asset.status === 'errored') throw new Error('Video processing failed')

            await new Promise(resolve => setTimeout(resolve, 200));

            asset = await mux.video.assets.retrieve(upload.asset_id!)
        }

        if (asset?.playback_ids && asset.playback_ids[0]?.id) {
            return asset.playback_ids[0].id
        } else {
            return "nose bro"
        }
    }
})
