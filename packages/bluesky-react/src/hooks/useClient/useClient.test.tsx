import { Client } from "@/client";
import { createPdsServer, renderBlueskyHook } from "@/testing";

import { useClient } from ".";

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
