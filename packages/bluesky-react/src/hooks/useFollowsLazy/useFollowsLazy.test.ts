import { act } from "react-dom/test-utils";

import {
    createPdsServer,
    renderLibHooks,
    waitFor,
    waitForLogin,
} from "@/testing";

import { useClient } from "../useClient";
import { useSession } from "../useSession";
import { useFollowsLazy } from ".";

describe("usePostLazy hook test", () => {
    let service: string;
    beforeEach(async () => {
        service = await createPdsServer("?users&dummy-user");
    });

    test("Followsの取得が行える", async () => {
        const { client, session, postLazy } = renderLibHooks(
            () => ({
                client: useClient(),
                session: useSession(),
                postLazy: useFollowsLazy(),
            }),
            service
        );
        await waitForLogin(session);

        const post = await client().agent.post({
            text: "test",
        });

        // 取得前の `loading` は `false` であるべき。
        expect(postLazy().loading).toBeFalsy();
        // 取得前の `post` は `null` であるべき。
        expect(postLazy().follows).toBeNull();

        act(() => {
            postLazy().fetchFollows("dummy.test");
        });

        // 取得後の `loading` は `true` であるべき。
        expect(postLazy().loading).toBeTruthy();

        // `loading` が `false` になるまで待つ。
        await waitFor(() => expect(postLazy().loading).toBeFalsy());

    });

    test("投稿が他の hooks と共有できる", async () => {
        const { client, session, postLazy1, postLazy2 } = renderLibHooks(
            () => ({
                client: useClient(),
                session: useSession(),
                postLazy1: useFollowsLazy(),
                postLazy2: useFollowsLazy(),
            }),
            service
        );
        await waitForLogin(session);

        const post = await client().agent.post({
            text: "test",
        });
        act(() => {
            postLazy1().fetchFollows("dummy.test");
            postLazy2().fetchFollows("dummy.test");
        });

        await waitFor(() => expect(postLazy1().loading).toBeFalsy());
        await waitFor(() => expect(postLazy2().loading).toBeFalsy());

        // 参照先が同じであるべき
        expect(postLazy1().follows).toBe(postLazy2().follows);
    });

    test("fetchPost が取得した投稿を返す", async () => {
        const { client, session, postLazy } = renderLibHooks(
            () => ({
                client: useClient(),
                session: useSession(),
                postLazy: useFollowsLazy(),
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
            const result = await postLazy().fetchFollows("dummy.test");
            console.log(result)
            // 取得した投稿は呼び出し元から利用できるべき
            //expect(result).toBe(post.uri);
        });
    });

    /**
     * TODO: 追加のテストを記述する。
     */
});
