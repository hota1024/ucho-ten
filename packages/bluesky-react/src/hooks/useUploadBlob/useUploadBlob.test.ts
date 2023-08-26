import { act } from "react-dom/test-utils";

import {
    createPdsServer,
    renderLibHooks,
    waitFor,
    waitForLogin,
} from "@/testing";

import { useClient } from "../useClient";
import { useSession } from "../useSession";
import { useUploadBlob } from ".";

describe("useProfile hook test", () => {
    let service: string;
    beforeEach(async () => {
        service = await createPdsServer("?users&dummy-user");
    });

    test("should all states work", async () => {
        const { client, session, uploadBlob1, uploadBlob2 } = renderLibHooks(
            () => ({
                client: useClient(),
                session: useSession(),
                uploadBlob1: useUploadBlob("dummy.image",{encoding: "image/jpeg"}),
                uploadBlob2: useUploadBlob("dummy.image", {encoding: "image/jpeg"}),
            }),
            service
        );
        await waitForLogin(session);

        await waitFor(() => expect(uploadBlob1().loading).toBe(false));

        expect(uploadBlob1().uploadblobs).toMatchObject({
            mimeType: "image/jpeg",
            original:{
                '$type': 'blob',
                mimeType: 'image/jpeg',
            }
        });
        console.log(uploadBlob1().blobs)

    });
});
