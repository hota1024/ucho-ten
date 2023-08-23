import { act } from "react-dom/test-utils";

import {
    createPdsServer,
    renderLibHooks,
    waitFor,
    waitForLogin,
} from "@/testing";

import { useClient } from "../useClient";
import { useSession } from "../useSession";
import { useNotificationsLazy } from ".";

describe("usePostLazy hook test", () => {
    let service: string;
    beforeEach(async () => {
        service = await createPdsServer("?users&dummy-user");
    });

    test("Followsの取得が行える", async () => {
        const { client, session, followersLazy } = renderLibHooks(
            () => ({
                client: useClient(),
                session: useSession(),
                followersLazy: useNotificationsLazy(),
            }),
            service
        );
        await waitForLogin(session);

        const post = await client().agent.post({
            text: "test",
        });

        // 取得前の `loading` は `false` であるべき。
        expect(followersLazy().loading).toBeFalsy();
        // 取得前の `post` は `null` であるべき。
        expect(followersLazy().notifications).toBeNull();

        act(() => {
            followersLazy().fetchNotifications();
        });

        // 取得後の `loading` は `true` であるべき。
        expect(followersLazy().loading).toBeTruthy();

        // `loading` が `false` になるまで待つ。
        await waitFor(() => expect(followersLazy().loading).toBeFalsy());

    });

    test("投稿が他の hooks と共有できる", async () => {
        const { client, session, followersLazy1, followersLazy2 } = renderLibHooks(
            () => ({
                client: useClient(),
                session: useSession(),
                followersLazy1: useNotificationsLazy(),
                followersLazy2: useNotificationsLazy(),
            }),
            service
        );
        await waitForLogin(session);

        const post = await client().agent.post({
            text: "test",
        });
        act(() => {
            followersLazy1().fetchNotifications();
            followersLazy2().fetchNotifications();
        });

        await waitFor(() => expect(followersLazy1().loading).toBeFalsy());
        await waitFor(() => expect(followersLazy2().loading).toBeFalsy());

        // 参照先が同じであるべき
        expect(JSON.stringify(followersLazy1().notifications)).toBe(JSON.stringify(followersLazy2().notifications));
    });

    test("fetchPost が取得した投稿を返す", async () => {
        const { client, session, postLazy } = renderLibHooks(
            () => ({
                client: useClient(),
                session: useSession(),
                postLazy: useNotificationsLazy(),
            }),
            service
        );
        await waitForLogin(session);

        const post = await client().agent.post({
            text: "test",
        });

        await act(async () => {
            const post = await client().agent.post({
                text: "test",
            })
            const repost = await client().agent.repost(post.uri,post.cid)
            const like = await client().agent.like(post.uri, post.cid)
            const result = await postLazy().fetchNotifications();
            console.log(result)
            // 取得した投稿は呼び出し元から利用できるべき
            //expect(result).toBe(post.uri);
        });
    });

    /**
     * TODO: 追加のテストを記述する。
     */
});
