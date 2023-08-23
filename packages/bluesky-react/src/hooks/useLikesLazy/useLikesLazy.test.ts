import { act } from "react-dom/test-utils";

import {
    createPdsServer,
    renderLibHooks,
    waitFor,
    waitForLogin,
} from "@/testing";

import { useClient } from "../useClient";
import { useSession } from "../useSession";
import { useRepostedByLazy } from ".";

describe("useProfileLazy hook test", () => {
    let service: string;
    beforeEach(async () => {
        service = await createPdsServer("?users&dummy-user");
    });

    test("should store and throws an error", async () => {
        expect.assertions(3);

        const { profileLazy } = renderLibHooks(
            () => ({
                profileLazy: useRepostedByLazy(),
            }),
            service
        );

        await act(async () => {
            try {
                await profileLazy().fetchLikes("dummy");
            } catch (error) {
                // maybe catch unauthorized error
                expect(error).toBeInstanceOf(Error);
            }
        });

        await waitFor(() => expect(profileLazy().loading).toBe(false));

        expect(profileLazy().error).toBeInstanceOf(Error);
    });

    test("should store profile and loading", async () => {
        const { client, session, repostedbyLazy } = renderLibHooks(
            () => ({
                client: useClient(),
                session: useSession(),
                repostedbyLazy: useRepostedByLazy(),
            }),
            service
        );
        await waitForLogin(session);

        const post = await client().agent.post({
            text: "test",
        });

        console.log(post)

        const like = await client().agent.like(post.uri, post.cid) ;

        console.log(like)
        console.log(post.uri)
        await act(async () => {
            const result = await repostedbyLazy().fetchLikes(post.uri);
            console.log(result)
            // 取得した投稿は呼び出し元から利用できるべき
            //expect(result.uri).toBe(post.uri);
        });

        console.log(repostedbyLazy().cursor)
    });
});
