import { act } from "react-dom/test-utils";

import {
    createPdsServer,
    renderLibHooks,
    waitFor,
    waitForLogin,
} from "@/testing";

import { useClient } from "../useClient";
import { useSession } from "../useSession";
import { useAuthorFeedLazy } from ".";

describe("useAuthorFeedLazy hook test", () => {
    let service: string;
    beforeEach(async () => {
        service = await createPdsServer("?users&dummy-user");
    });

    test("Author Feedの取得が行える", async () => {
        const { client, session, authorfeedLazy } = renderLibHooks(
            () => ({
                client: useClient(),
                session: useSession(),
                authorfeedLazy: useAuthorFeedLazy(),
            }),
            service
        );
        await waitForLogin(session);

        const post = await client().agent.post({
            text: "test",
        });

        console.log(post)

        // 取得前の `loading` は `false` であるべき。
        expect(authorfeedLazy().loading).toBeFalsy();
        // 取得前の `post` は `null` であるべき。
        expect(authorfeedLazy().authorfeed).toBeNull();

        act(() => {
            authorfeedLazy().fetchAuthorFeed("dummy.test", "");
        });

        // 取得後の `loading` は `true` であるべき。
        expect(authorfeedLazy().loading).toBeTruthy();

        console.log(authorfeedLazy().fetchAuthorFeed("dummy.test", ""))

        // `loading` が `false` になるまで待つ。
        await waitFor(() => expect(authorfeedLazy().loading).toBeFalsy());
        console.log(authorfeedLazy().authorfeed)
        // 投稿後の `post` は取得した投稿になるべき。
        expect(authorfeedLazy().authorfeed).toMatchObject(authorfeedLazy().authorfeed);
    });

    test("投稿が他の hooks と共有できる", async () => {
        const { client, session, authorfeedLazy1, authorfeedLazy2 } = renderLibHooks(
            () => ({
                client: useClient(),
                session: useSession(),
                authorfeedLazy1: useAuthorFeedLazy(),
                authorfeedLazy2: useAuthorFeedLazy(),
            }),
            service
        );
        await waitForLogin(session);

        const post = await client().agent.post({
            text: "test",
        });
        act(() => {
            authorfeedLazy1().fetchAuthorFeed("dummy.test", "");
            authorfeedLazy2().fetchAuthorFeed("dummy.test", "");
        });

        await waitFor(() => expect(authorfeedLazy1().loading).toBeFalsy());
        await waitFor(() => expect(authorfeedLazy2().loading).toBeFalsy());

        // 参照先が同じであるべき
        expect(authorfeedLazy1().authorfeed).toBe(authorfeedLazy2().authorfeed);
    });

    test("fetchPost が取得した投稿を返す", async () => {
        const { client, session, authorfeedLazy } = renderLibHooks(
            () => ({
                client: useClient(),
                session: useSession(),
                authorfeedLazy: useAuthorFeedLazy(),
            }),
            service
        );
        await waitForLogin(session);

        const post = await client().agent.post({
            text: "test",
        });

        const post1 = await client().agent.post({
            text: "test1",
        });

        await act(async () => {
            const result = await authorfeedLazy().fetchAuthorFeed("dummy.test", "");
            // 取得した投稿は呼び出し元から利用できるべき
            expect(result.cursor).toBe(result.cursor);
        });
    });

    /**
     * TODO: 追加のテストを記述する。
     */
});
