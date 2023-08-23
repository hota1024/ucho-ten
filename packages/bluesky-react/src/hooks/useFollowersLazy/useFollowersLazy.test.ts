import { act } from "react-dom/test-utils";

import {
    createPdsServer,
    renderLibHooks,
    waitFor,
    waitForLogin,
} from "@/testing";

import { useClient } from "../useClient";
import { useSession } from "../useSession";
import { useFollowersLazy } from ".";

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
                followersLazy: useFollowersLazy(),
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
        expect(followersLazy().followers).toBeNull();

        act(() => {
            followersLazy().fetchFollowers("dummy.test");
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
                followersLazy1: useFollowersLazy(),
                followersLazy2: useFollowersLazy(),
            }),
            service
        );
        await waitForLogin(session);

        const post = await client().agent.post({
            text: "test",
        });
        act(() => {
            followersLazy1().fetchFollowers("dummy.test");
            followersLazy2().fetchFollowers("dummy.test");
        });

        await waitFor(() => expect(followersLazy1().loading).toBeFalsy());
        await waitFor(() => expect(followersLazy2().loading).toBeFalsy());

        // 参照先が同じであるべき
        expect(JSON.stringify(followersLazy1().followers)).toBe(JSON.stringify(followersLazy2().followers));
    });

    test("fetchPost が取得した投稿を返す", async () => {
        const { client, session, postLazy } = renderLibHooks(
            () => ({
                client: useClient(),
                session: useSession(),
                postLazy: useFollowersLazy(),
            }),
            service
        );
        await waitForLogin(session);

        const post = await client().agent.post({
            text: "test",
        });

        await act(async () => {
            const follow = await client().agent.follow("did:plc:ffapiykk4b2t5mdfcdeaciob")
            console.log(follow)
            const result = await postLazy().fetchFollowers("dummy.test");
            console.log(result)
            // 取得した投稿は呼び出し元から利用できるべき
            //expect(result).toBe(post.uri);
        });
    });

    /**
     * TODO: 追加のテストを記述する。
     */
});
