import { act } from "react-dom/test-utils";

import {
    createPdsServer,
    renderLibHooks,
    waitFor,
    waitForLogin,
} from "@/testing";

import { useClient } from "../useClient";
import { useSession } from "../useSession";
import { useTimelineLazy } from ".";

describe("useTimelineLazy hook test", () => {
    let service: string;
    beforeEach(async () => {
        service = await createPdsServer("?users&dummy-user");
    });

    test("タイムラインの取得が行える", async () => {
        const { client, session, postLazy } = renderLibHooks(
            () => ({
                client: useClient(),
                session: useSession(),
                postLazy: useTimelineLazy(),
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
        expect(postLazy().timeline).toBeNull();

        act(() => {
            postLazy().fetchTimeline();
        });

        // 取得後の `loading` は `true` であるべき。
        expect(postLazy().loading).toBeTruthy();

        // `loading` が `false` になるまで待つ。
        await waitFor(() => expect(postLazy().loading).toBeFalsy());

        // 投稿後の `post` は取得したタイムラインに含まれるべき。
        expect(postLazy().timeline).toMatchObject([{
            "post":{
                "uri":post.uri
            }
        }]);
    });

    test("タイムラインが他の hooks と共有できる", async () => {
        const { client, session, postLazy1, postLazy2 } = renderLibHooks(
            () => ({
                client: useClient(),
                session: useSession(),
                postLazy1: useTimelineLazy(),
                postLazy2: useTimelineLazy(),
            }),
            service
        );
        await waitForLogin(session);

        await client().agent.post({
            text: "test",
        });
        act(() => {
            postLazy1().fetchTimeline();
            postLazy2().fetchTimeline();
        });

        await waitFor(() => expect(postLazy1().loading).toBeFalsy());
        await waitFor(() => expect(postLazy2().loading).toBeFalsy());

        // 参照先が同じであるべき
        expect(postLazy1().timeline).toBe(postLazy2().timeline);
    });

    test("fetchTmeline が取得したカーソルを返す", async () => {
        const { client, session, postLazy } = renderLibHooks(
            () => ({
                client: useClient(),
                session: useSession(),
                postLazy: useTimelineLazy(),
            }),
            service
        );
        await waitForLogin(session);

        await client().agent.post({
            text: "test",
        });
        await client().agent.post({
            text: "test1",
        });

        await act(async () => {

            const result = await postLazy().fetchTimeline();
            console.log(result)

            //console.log(await postLazy().fetchTimeline(result['cursor'], 50))

            // 取得した投稿は呼び出し元から利用できるべき
            //expect(result.uri).toBe(post.uri);
        });
    });

    /**
     * TODO: 追加のテストを記述する。
     */
});
