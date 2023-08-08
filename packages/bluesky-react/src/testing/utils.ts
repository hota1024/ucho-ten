import { act } from "react-dom/test-utils";
import { waitFor } from "@testing-library/react";
import { UseSessionReturn } from "@/hooks/useSession/type";

export async function createPdsServer(path = "") {
  const res = await fetch(`http://localhost:1986/${path}`, { method: "POST" });
  const resBody = await res.text();

  return resBody;
}

export async function waitForLogin(
  session: () => UseSessionReturn,
  identifier = "dummy.test",
  password = "dummy"
) {
  act(() => {
    session().login({
      identifier,
      password,
    });
  });

  await waitFor(() => expect(session().authState).toBe("logged-in"));
}
