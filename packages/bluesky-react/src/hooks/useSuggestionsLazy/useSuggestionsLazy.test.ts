import { act } from "react-dom/test-utils";

import {
    createPdsServer,
    renderLibHooks,
    waitFor,
    waitForLogin,
} from "@/testing";

import { useClient } from "../useClient";
import { useSession } from "../useSession";
import { useSuggestionsLazy } from ".";

describe("useProfile hook test", () => {
    let service: string;
    beforeEach(async () => {
        service = await createPdsServer("?users&dummy-user");
    });

    test("should all states work", async () => {
        const { client, session, suggestions1, suggestions2 } = renderLibHooks(
            () => ({
                client: useClient(),
                session: useSession(),
                suggestions1: useSuggestionsLazy(),
                suggestions2: useSuggestionsLazy(),
            }),
            service
        );
        await waitForLogin(session);

        await waitFor(() => expect(suggestions1().loading).toBe(false));

        await client().agent.upsertProfile(() => ({
            displayName: "dummy(updated)",
        }));

        act(() => {
            suggestions1().fetchSuggestions();
        });

        await waitFor(() => expect(suggestions1().loading).toBe(false));

        console.log(await suggestions1().fetchSuggestions())
        /*
        expect(suggestions1().suggestions).toMatchObject({
            displayName: "dummy(updated)",
        });
        expect(suggestions2().suggestions).toMatchObject({
            displayName: "dummy(updated)",
        });*/
    });
});
