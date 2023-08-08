import { act, createPdsServer, renderBlueskyHook, waitFor } from "@/testing";
import { useSession } from ".";

describe("useSession hook test", () => {
  let service: string;
  beforeEach(async () => {
    service = await createPdsServer("?dummy-user");
  });

  test("should all states work", async () => {
    const { result } = renderBlueskyHook(() => useSession(), service);

    expect(result.current.authState).toBe("logged-out");
    expect(result.current.session).toBeFalsy();

    act(() => {
      result.current.login({
        identifier: "dummy@example.com",
        password: "dummy",
      });
    });

    expect(result.current.authState).toBe("logging-in");

    await waitFor(() => expect(result.current.authState).toBe("logged-in"));

    expect(result.current.authState).toBe("logged-in");
    expect(result.current.session).toBeTruthy();

    act(() => {
      result.current.logout();
    });

    await waitFor(() => expect(result.current.authState).toBe("logged-out"));

    expect(result.current.authState).toBe("logged-out");
    expect(result.current.session).toBeFalsy();
  });
});
