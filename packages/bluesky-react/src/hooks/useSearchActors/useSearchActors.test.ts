import { act } from "react-dom/test-utils";

import {
  createPdsServer,
  renderLibHooks,
  waitFor,
  waitForLogin,
} from "@/testing";

import { useClient } from "../useClient";
import { useSession } from "../useSession";
import { useSearchActors } from ".";

describe("useProfile hook test", () => {
  let service: string;
  beforeEach(async () => {
    service = await createPdsServer("?users&dummy-user");
  });

  test("should all states work", async () => {
    const { client, session, seatchActors1, seatchActors2 } = renderLibHooks(
      () => ({
        client: useClient(),
        session: useSession(),
        seatchActors1: useSearchActors({ term: "dummy.test" }),
        seatchActors2: useSearchActors({ term: "dummy.test" }),
      }),
      service
    );
    await waitForLogin(session);

    await waitFor(() => expect(seatchActors1().loading).toBe(false));

    expect(seatchActors1().searchActors).toMatchObject([{
      handle: "dummy.test",
      displayName: "dummy",
    }]);

    await client().agent.upsertProfile(() => ({
      displayName: "dummy(updated)",
    }));

    act(() => {
      seatchActors1().fetchSearchActors();
    });

    await waitFor(() => expect(seatchActors1().loading).toBe(false));
    console.log(seatchActors1().searchActors)
    console.log(seatchActors2().searchActors)
    expect(seatchActors2().searchActors).toMatchObject([{
      displayName: "dummy(updated)",
    }]);
    expect(seatchActors2().searchActors).toMatchObject([{
      displayName: "dummy(updated)",
    }]);
  });
});
