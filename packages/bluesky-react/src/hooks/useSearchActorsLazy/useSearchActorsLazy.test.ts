import { act } from "react-dom/test-utils";

import {
  createPdsServer,
  renderLibHooks,
  waitFor,
  waitForLogin,
} from "@/testing";

import { useClient } from "../useClient";
import { useSession } from "../useSession";
import { useSearchActorsLazy } from ".";

describe("useProfile hook test", () => {
  let service: string;
  beforeEach(async () => {
    service = await createPdsServer("?users&dummy-user");
  });

  test("should all states work", async () => {
    const { client, session, searchActors1, searchActors2 } = renderLibHooks(
      () => ({
        client: useClient(),
        session: useSession(),
        searchActors1: useSearchActorsLazy({ term: "dummy.test" }),
        searchActors2: useSearchActorsLazy({ term: "dummy.test" }),
      }),
      service
    );
    await waitForLogin(session);

    await waitFor(() => expect(searchActors1().loading).toBe(false));

    expect(searchActors1().searchActors).toMatchObject([{
      handle: "dummy.test",
      displayName: "dummy",
    }]);

    await client().agent.upsertProfile(() => ({
      displayName: "dummy(updated)",
    }));

    act(() => {
      searchActors1().fetchSearchActors();
    });

    await waitFor(() => expect(searchActors1().loading).toBe(false));
    console.log(searchActors1().searchActors)
    console.log(searchActors2().searchActors)
    expect(searchActors2().searchActors).toMatchObject([{
      displayName: "dummy(updated)",
    }]);
    expect(searchActors2().searchActors).toMatchObject([{
      displayName: "dummy(updated)",
    }]);
  });
});
