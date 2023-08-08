import {
  createPdsServer,
  renderLibHooks,
  waitFor,
  waitForLogin,
} from "@/testing";
import { useProfile } from ".";
import { useSession } from "../useSession";
import { useClient } from "../useClient";
import { act } from "react-dom/test-utils";

describe("useProfile hook test", () => {
  let service: string;
  beforeEach(async () => {
    service = await createPdsServer("?users&dummy-user");
  });

  test("should all states work", async () => {
    const { client, session, profile, profile2 } = renderLibHooks(
      () => ({
        client: useClient(),
        session: useSession(),
        profile: useProfile({ actor: "dummy.test" }),
        profile2: useProfile({ actor: "dummy.test" }),
      }),
      service
    );
    await waitForLogin(session);

    await waitFor(() => expect(profile().loading).toBe(false));

    expect(profile().profile).toMatchObject({
      handle: "dummy.test",
      displayName: "dummy",
    });

    await client().agent.upsertProfile(() => ({
      displayName: "dummy(updated)",
    }));

    act(() => {
      profile().fetchProfile();
    });

    await waitFor(() => expect(profile().loading).toBe(false));

    expect(profile().profile).toMatchObject({
      displayName: "dummy(updated)",
    });
    expect(profile2().profile).toMatchObject({
      displayName: "dummy(updated)",
    });
  });
});
