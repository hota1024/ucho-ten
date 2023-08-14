import { act } from "react-dom/test-utils";

import {
  createPdsServer,
  renderLibHooks,
  waitFor,
  waitForLogin,
} from "@/testing";

import { useClient } from "../useClient";
import { useSession } from "../useSession";
import { usePostLazy } from ".";

describe("usePostLazy hook test", () => {
  let service: string;
  beforeEach(async () => {
    service = await createPdsServer("?users&dummy-user");
  });

  test("投稿の取得が行える", async () => {
    const { client, session, postLazy } = renderLibHooks(
      () => ({
        client: useClient(),
        session: useSession(),
        postLazy: usePostLazy(),
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
    expect(postLazy().post).toBeNull();

    act(() => {
      postLazy().fetchPost(post.uri);
    });

    // 取得後の `loading` は `true` であるべき。
    expect(postLazy().loading).toBeTruthy();

    // `loading` が `false` になるまで待つ。
    await waitFor(() => expect(postLazy().loading).toBeFalsy());

    // 投稿後の `post` は取得した投稿になるべき。
    expect(postLazy().post).toMatchObject({
      uri: post.uri,
    });
  });
  test("投稿が他の hooks と共有できる", async () => {
    const { client, session, postLazy1, postLazy2 } = renderLibHooks(
      () => ({
        client: useClient(),
        session: useSession(),
        postLazy1: usePostLazy(),
        postLazy2: usePostLazy(),
      }),
      service
    );
    await waitForLogin(session);

    const post = await client().agent.post({
      text: "test",
    });
    act(() => {
      postLazy1().fetchPost(post.uri);
      postLazy2().fetchPost(post.uri);
    });

    await waitFor(() => expect(postLazy1().loading).toBeFalsy());
    await waitFor(() => expect(postLazy2().loading).toBeFalsy());

    // 参照先が同じであるべき
    expect(postLazy1().post).toBe(postLazy2().post);
  });

  /**
   * TODO: 追加のテストを記述する。
   */
});
