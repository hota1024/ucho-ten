import type { ComAtprotoRepoUploadBlob } from "@atproto/api";
import type { BlobRef } from "@atproto/lexicon";
import { useCallback, useEffect, useState } from "react";

import { useClient, useSession } from "@/hooks";
import { useBlobStore } from "@/states";

import type {UseUploadBlobOpts, UseUploadBlobReturn} from "./type";

/**
 * returns user profile that specified in `params.actor`.
 *
 * @param params `AppBskyActorGetProfile.QueryParams`
 * @param opts `UseProfileOpts`
 * @returns `UseProfileReturn`
 */
export function useUploadBlob(
    params: ComAtprotoRepoUploadBlob.InputSchema,
    opts?: UseUploadBlobOpts
): UseUploadBlobReturn {
    // shared states //
    const client = useClient();
    const { session } = useSession();
    const { blobs, merge } = useBlobStore();

    // local states //
    const [uploadblobs, setUploadBlobs] = useState<BlobRef | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<unknown>(null);

    // functions //
    const uploadBlob = useCallback(async () => {
        if (!session) {
            // returns if agent has not a session.
            return;
        }

        try {
            setError(null);
            setLoading(true);
            console.log(params)
            const res = await client.agent.uploadBlob(params, opts);
            const { blob } = res.data;
            console.log(res)
            merge(new Map<string, BlobRef>([["none", blob]]));
            setUploadBlobs(blob);
            console.log(blob)
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [session]);

    // effects //
    useEffect(() => {
        uploadBlob();
    }, [uploadBlob]);

    useEffect(() => {
        if (!uploadblobs) {
            return;
        }

        const newProfile = blobs.get("none");

        if (newProfile) {
            setUploadBlobs(newProfile);
        }
    }, [uploadBlob, blobs]);

    return { uploadblobs, uploadBlob, loading, error };
}


import type { BlobRef } from "@atproto/lexicon";
import { useCallback, useEffect, useState } from "react";

import { BlueskyReactError } from "@/errors";
import { useClient } from "@/hooks";
import { usePostStore } from "@/states";

import type { UsePostLazyReturn } from "./type";

/**
 * returns user profile that specified in `params.actor`.
 *
 * @param params `AppBskyFeedGetPostThread.QueryParams`
 * @param opts `UseProfileOpts`
 * @returns `UseProfileReturn`
 */
export function usePostLazy(
    params?: AppBskyFeedGetPostThread.QueryParams,
    opts?: AppBskyFeedGetPostThread.CallOptions
): UsePostLazyReturn {
    // shared states //
    const client = useClient();
    const { posts, merge } = usePostStore();

    // local states //
    const [post, setPost] = useState<BlobRef | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<unknown>(null);

    // functions //
    const fetchPost = useCallback(
        async (uri: string) => {
            try {
                setError(null);
                setLoading(true);

                const res = await client.agent.getPostThread({ uri: uri }, opts);
                const { thread } = res.data;


                const post = thread.post;
                merge(new Map<string, BlobRef>([[post.uri, post]]));

                setPost(post);

                return post as BlobRef;
            } catch (error) {
                setError(error);

                throw error;
            } finally {
                setLoading(false);
            }
        },
        [client.agent, merge, opts]
    );

    // effects //
    useEffect(() => {
        if (!post) {
            return;
        }

        const newPost = posts.get(post.uri);

        if (newPost) {
            setPost(newPost);
        }
    }, [post, posts]);

    return { post, fetchPost, loading, error };
}

