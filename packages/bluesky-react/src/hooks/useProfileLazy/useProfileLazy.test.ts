import { act } from "react-dom/test-utils";

import {
  createPdsServer,
  renderLibHooks,
  waitFor,
  waitForLogin,
} from "@/testing";

import { useClient } from "../useClient";
import { useProfile } from "../useProfile";
import { useSession } from "../useSession";
import { useProfileLazy } from ".";

describe("useProfileLazy hook test", () => {
  let service: string;
  beforeEach(async () => {
    service = await createPdsServer("?users&dummy-user");
  });

  test("should store and throws an error", async () => {
    expect.assertions(3);

    const { profileLazy } = renderLibHooks(
      () => ({
        profileLazy: useProfileLazy(),
      }),
      service
    );

    await act(async () => {
      try {
        await profileLazy().fetchProfile({ actor: "dummy.test" });
      } catch (error) {
        // maybe catch unauthorized error
        expect(error).toBeInstanceOf(Error);
      }
    });

    await waitFor(() => expect(profileLazy().loading).toBe(false));

    expect(profileLazy().error).toBeInstanceOf(Error);
  });

  test("should store profile and loading", async () => {
    const { client, session, profile, profileLazy } = renderLibHooks(
      () => ({
        client: useClient(),
        session: useSession(),
        profile: useProfile({ actor: "dummy.test" }),
        profileLazy: useProfileLazy(),
      }),
      service
    );
    await waitForLogin(session);

    await waitFor(() => expect(profile().loading).toBe(false));

    await client().agent.upsertProfile(() => ({
      displayName: "dummy(updated)",
    }));

    expect(profileLazy().loading).toBe(false);

    act(() => {
      profileLazy().fetchProfile({ actor: "dummy.test" });
    });

    expect(profileLazy().loading).toBe(true);

    await waitFor(() => expect(profileLazy().loading).toBe(false));

    expect(profileLazy().profile).toMatchObject({
      handle: "dummy.test",
      displayName: "dummy(updated)",
    });
    expect(profile().profile).toMatchObject({
      handle: "dummy.test",
      displayName: "dummy(updated)",
    });
  });
});
