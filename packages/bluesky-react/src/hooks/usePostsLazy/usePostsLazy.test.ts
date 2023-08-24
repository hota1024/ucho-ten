import { act } from "react-dom/test-utils";

import {
    createPdsServer,
    renderLibHooks,
    waitFor,
    waitForLogin,
} from "@/testing";

import { useClient } from "../useClient";
import { useSession } from "../useSession";
import {usePostsLazy} from ".";
import type { PostView } from "@atproto/api/dist/client/types/app/bsky/feed/defs";


describe("usePostsLazy hook test", () => {
    let service: string;
    beforeEach(async () => {
        service = await createPdsServer("?users&dummy-user");
    });

    test("Postsの取得が行える", async () => {
        const { client, session, postsLazy } = renderLibHooks(
            () => ({
                client: useClient(),
                session: useSession(),
                postsLazy: usePostsLazy(),
            }),
            service
        );
        await waitForLogin(session);

        const post1 = await client().agent.post({
            text: "test2",
        });

        const post2 = await client().agent.post({
            text: "test2",
        });

        // 取得前の `loading` は `false` であるべき。
        expect(postsLazy().loading).toBeFalsy();
        // 取得前の `post` は `null` であるべき。
        expect(postsLazy().post).toBeNull();

        act(() => {
            postsLazy().fetchPosts([post1.uri,post2.uri]);
        });

        // 取得後の `loading` は `true` であるべき。
        expect(postsLazy().loading).toBeTruthy();

        // `loading` が `false` になるまで待つ。
        await waitFor(() => expect(postsLazy().loading).toBeFalsy());


        const uris:string[] = [post1.uri,post2.uri]
        const posts = postsLazy().post as PostView[]

        posts.forEach((item, index) => {
            expect(item).toMatchObject({
                uri:uris[index]
            })

        });
    });

    test("投稿が他の hooks と共有できる", async () => {
        const { client, session, postsLazy1, postsLazy2 } = renderLibHooks(
            () => ({
                client: useClient(),
                session: useSession(),
                postsLazy1: usePostsLazy(),
                postsLazy2: usePostsLazy(),
            }),
            service
        );
        await waitForLogin(session);

        const post1 = await client().agent.post({
            text: "test2",
        });

        const post2 = await client().agent.post({
            text: "test2",
        });
        act(() => {
            postsLazy1().fetchPosts([post1.uri,post2.uri]);
            postsLazy2().fetchPosts([post1.uri,post2.uri]);
        });

        await waitFor(() => expect(postsLazy1().loading).toBeFalsy());
        await waitFor(() => expect(postsLazy2().loading).toBeFalsy());

        // 参照先が同じであるべき
        expect(JSON.stringify(postsLazy1().post)).toBe(JSON.stringify(postsLazy2().post));
    });

    test("fetchPosts が取得した投稿を返す", async () => {
        const { client, session, postsLazy } = renderLibHooks(
            () => ({
                client: useClient(),
                session: useSession(),
                postsLazy: usePostsLazy(),
            }),
            service
        );
        await waitForLogin(session);

        await act(async () => {
            const post1 = await client().agent.post({
                text: "test2",
            });

            const post2 = await client().agent.post({
                text: "test2",
            });
            const result = await postsLazy().fetchPosts([post1.uri,post2.uri]);

            const uris:string[] = [post1.uri,post2.uri]

            // 取得した投稿は呼び出し元から利用できるべき
            result.forEach((item, index) => {
                expect(item.uri).toBe(uris[index])
            });
        });
    });

    /**
     * TODO: 追加のテストを記述する。
     */
});
