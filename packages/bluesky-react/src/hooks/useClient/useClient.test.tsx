import { useClient } from ".";
import { createPdsServer, renderBlueskyHook } from "@/testing";
import { Client } from "@/client";

describe("useClient hook test", () => {
  let service: string;
  beforeEach(async () => {
    service = await createPdsServer();
  });

  test("should return Client instance", async () => {
    const { result } = renderBlueskyHook(() => useClient(), service);

    expect(result.current).toBeInstanceOf(Client);
  });
});
