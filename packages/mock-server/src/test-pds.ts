/**
 * this source file use a modified version of https://github.com/bluesky-social/social-app/blob/main/jest/test-pds.ts
 *
 * Copyright 2023 Bluesky PBLLC
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import net from "node:net";
import {
  TestPds as DevEnvTestPDS,
  TestNetworkNoAppView,
} from "@atproto/dev-env";
import { BskyAgent } from "@atproto/api";

export interface TestUser {
  email: string;
  did: string;
  handle: string;
  password: string;
  agent: BskyAgent;
}

export interface TestPDS {
  pdsUrl: string;
  mocker: Mocker;
  close: () => Promise<void>;
}

export async function createServer(
  { inviteRequired }: { inviteRequired: boolean } = { inviteRequired: false }
): Promise<TestPDS> {
  const port = await getPort();
  const port2 = await getPort(port + 1);
  const pdsUrl = `http://localhost:${port}`;
  console.log({ pdsUrl });
  const { pds, plc } = await TestNetworkNoAppView.create({
    pds: { port, publicUrl: pdsUrl, inviteRequired },
    plc: { port: port2 },
  })
    .then((r) => r)
    .catch((e) => {
      console.log(e.message);
      throw e;
    });
  console.log({ pds, plc });

  const profilePic = new Uint8Array([
    255, 216, 255, 224, 0, 16, 74, 70, 73, 70, 0, 1, 1, 1, 0, 100, 0, 100, 0, 0,
    255, 219, 0, 67, 0, 2, 1, 1, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 3, 5, 3, 3, 3,
    3, 3, 6, 4, 4, 3, 5, 7, 6, 7, 7, 7, 6, 7, 7, 8, 9, 11, 9, 8, 8, 10, 8, 7, 7,
    10, 13, 10, 10, 11, 12, 12, 12, 12, 7, 9, 14, 15, 13, 12, 14, 11, 12, 12,
    12, 255, 219, 0, 67, 1, 2, 2, 2, 3, 3, 3, 6, 3, 3, 6, 12, 8, 7, 8, 12, 12,
    12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12,
    12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12,
    12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 255, 192, 0, 17, 8, 0, 128, 0, 128,
    3, 1, 34, 0, 2, 17, 1, 3, 17, 1, 255, 196, 0, 31, 0, 0, 1, 5, 1, 1, 1, 1, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 255, 196, 0,
    181, 16, 0, 2, 1, 3, 3, 2, 4, 3, 5, 5, 4, 4, 0, 0, 1, 125, 1, 2, 3, 0, 4,
    17, 5, 18, 33, 49, 65, 6, 19, 81, 97, 7, 34, 113, 20, 50, 129, 145, 161, 8,
    35, 66, 177, 193, 21, 82, 209, 240, 36, 51, 98, 114, 130, 9, 10, 22, 23, 24,
    25, 26, 37, 38, 39, 40, 41, 42, 52, 53, 54, 55, 56, 57, 58, 67, 68, 69, 70,
    71, 72, 73, 74, 83, 84, 85, 86, 87, 88, 89, 90, 99, 100, 101, 102, 103, 104,
    105, 106, 115, 116, 117, 118, 119, 120, 121, 122, 131, 132, 133, 134, 135,
    136, 137, 138, 146, 147, 148, 149, 150, 151, 152, 153, 154, 162, 163, 164,
    165, 166, 167, 168, 169, 170, 178, 179, 180, 181, 182, 183, 184, 185, 186,
    194, 195, 196, 197, 198, 199, 200, 201, 202, 210, 211, 212, 213, 214, 215,
    216, 217, 218, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234, 241, 242,
    243, 244, 245, 246, 247, 248, 249, 250, 255, 196, 0, 31, 1, 0, 3, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 255,
    196, 0, 181, 17, 0, 2, 1, 2, 4, 4, 3, 4, 7, 5, 4, 4, 0, 1, 2, 119, 0, 1, 2,
    3, 17, 4, 5, 33, 49, 6, 18, 65, 81, 7, 97, 113, 19, 34, 50, 129, 8, 20, 66,
    145, 161, 177, 193, 9, 35, 51, 82, 240, 21, 98, 114, 209, 10, 22, 36, 52,
    225, 37, 241, 23, 24, 25, 26, 38, 39, 40, 41, 42, 53, 54, 55, 56, 57, 58,
    67, 68, 69, 70, 71, 72, 73, 74, 83, 84, 85, 86, 87, 88, 89, 90, 99, 100,
    101, 102, 103, 104, 105, 106, 115, 116, 117, 118, 119, 120, 121, 122, 130,
    131, 132, 133, 134, 135, 136, 137, 138, 146, 147, 148, 149, 150, 151, 152,
    153, 154, 162, 163, 164, 165, 166, 167, 168, 169, 170, 178, 179, 180, 181,
    182, 183, 184, 185, 186, 194, 195, 196, 197, 198, 199, 200, 201, 202, 210,
    211, 212, 213, 214, 215, 216, 217, 218, 226, 227, 228, 229, 230, 231, 232,
    233, 234, 242, 243, 244, 245, 246, 247, 248, 249, 250, 255, 218, 0, 12, 3,
    1, 0, 2, 17, 3, 17, 0, 63, 0, 232, 40, 162, 138, 255, 0, 67, 15, 243, 188,
    40, 162, 138, 0, 40, 162, 138, 0, 40, 162, 138, 0, 40, 162, 138, 0, 40, 162,
    138, 0, 40, 162, 138, 0, 40, 162, 138, 0, 40, 162, 138, 0, 40, 162, 138, 0,
    40, 162, 138, 0, 40, 162, 138, 0, 40, 162, 138, 0, 40, 162, 138, 0, 40, 162,
    138, 0, 40, 162, 138, 0, 40, 162, 138, 0, 40, 162, 138, 0, 40, 162, 138, 0,
    40, 162, 138, 0, 40, 162, 138, 0, 40, 162, 138, 0, 40, 162, 138, 0, 40, 162,
    138, 0, 40, 162, 138, 0, 40, 162, 138, 0, 40, 162, 138, 0, 42, 230, 129,
    225, 251, 255, 0, 21, 235, 22, 250, 118, 151, 99, 121, 169, 106, 23, 109,
    178, 11, 107, 88, 90, 105, 166, 108, 103, 10, 138, 9, 39, 3, 160, 21, 78,
    189, 231, 246, 49, 199, 195, 29, 3, 199, 191, 21, 38, 10, 175, 224, 221, 40,
    217, 105, 12, 195, 174, 165, 121, 152, 98, 43, 235, 177, 75, 146, 7, 102, 6,
    188, 204, 227, 30, 240, 120, 73, 87, 130, 230, 150, 138, 43, 188, 164, 212,
    98, 190, 114, 105, 63, 35, 211, 201, 240, 17, 198, 98, 225, 66, 111, 150,
    58, 185, 62, 209, 138, 114, 147, 249, 69, 54, 188, 207, 17, 215, 52, 43,
    239, 12, 106, 247, 26, 126, 165, 103, 119, 167, 223, 218, 57, 142, 123, 107,
    152, 90, 25, 161, 97, 213, 89, 24, 2, 167, 216, 138, 169, 94, 249, 251, 114,
    218, 167, 143, 31, 193, 31, 20, 109, 81, 124, 159, 136, 58, 44, 109, 124,
    80, 124, 171, 168, 218, 129, 5, 194, 241, 211, 162, 99, 215, 4, 215, 129,
    209, 147, 230, 15, 27, 131, 134, 34, 75, 150, 78, 234, 75, 180, 162, 220,
    100, 190, 82, 77, 6, 115, 151, 172, 22, 50, 120, 120, 190, 104, 171, 56,
    190, 241, 146, 82, 139, 249, 197, 166, 20, 81, 69, 122, 103, 152, 20, 81,
    69, 0, 20, 81, 69, 0, 20, 81, 69, 0, 20, 81, 69, 0, 20, 81, 69, 0, 21, 244,
    165, 207, 237, 13, 117, 251, 49, 126, 204, 254, 4, 240, 239, 129, 53, 237,
    25, 245, 205, 124, 207, 175, 248, 138, 72, 98, 181, 212, 68, 13, 33, 84,
    130, 7, 18, 44, 138, 142, 177, 175, 204, 164, 6, 82, 59, 102, 190, 107, 162,
    188, 172, 207, 40, 163, 143, 116, 227, 137, 92, 208, 132, 185, 156, 90, 77,
    73, 217, 165, 116, 250, 43, 222, 221, 210, 236, 122, 185, 94, 111, 91, 0,
    170, 75, 12, 249, 103, 56, 242, 169, 38, 211, 138, 186, 110, 205, 117, 118,
    181, 251, 55, 220, 250, 86, 247, 227, 244, 223, 180, 255, 0, 236, 151, 226,
    253, 35, 198, 250, 238, 140, 190, 40, 240, 157, 245, 190, 179, 160, 180,
    169, 107, 167, 181, 228, 108, 26, 57, 237, 227, 72, 213, 21, 216, 46, 231,
    192, 5, 152, 176, 235, 129, 143, 154, 168, 162, 140, 175, 40, 163, 151, 251,
    72, 97, 180, 132, 165, 204, 162, 146, 74, 55, 73, 52, 146, 232, 218, 230,
    245, 108, 51, 92, 222, 182, 96, 233, 207, 19, 172, 227, 30, 87, 38, 219,
    114, 179, 109, 54, 223, 84, 159, 47, 162, 65, 69, 20, 87, 170, 121, 65, 69,
    20, 80, 1, 69, 20, 80, 1, 69, 20, 80, 1, 69, 20, 80, 1, 69, 20, 80, 1, 69,
    20, 80, 1, 69, 20, 80, 1, 69, 20, 80, 1, 69, 20, 80, 1, 69, 20, 80, 1, 69,
    20, 80, 1, 69, 20, 80, 1, 69, 20, 80, 1, 69, 20, 80, 1, 69, 20, 80, 1, 69,
    20, 80, 1, 69, 20, 80, 1, 69, 20, 80, 1, 69, 20, 80, 1, 69, 20, 80, 1, 69,
    20, 80, 1, 69, 20, 80, 1, 69, 20, 80, 1, 69, 20, 80, 1, 69, 20, 80, 1, 69,
    20, 80, 7, 255, 217,
  ]);

  return {
    pdsUrl,
    mocker: new Mocker(pds, pdsUrl, profilePic),
    async close() {
      await pds.server.destroy();
      await plc.server.destroy();
    },
  };
}

class Mocker {
  agent: BskyAgent;
  users: Record<string, TestUser> = {};

  constructor(
    public pds: DevEnvTestPDS,
    public service: string,
    public profilePic: Uint8Array
  ) {
    this.agent = new BskyAgent({ service });
  }

  // NOTE
  // deterministic date generator
  // we use this to ensure the mock dataset is always the same
  // which is very useful when testing
  *dateGen() {
    let start = 1657846031914;
    while (true) {
      yield new Date(start).toISOString();
      start += 1e3;
    }
  }

  async registerUser(email: string, handle: string, password: string) {
    const agent = new BskyAgent({ service: this.agent.service });

    const inviteRes = await agent.api.com.atproto.server.createInviteCode(
      { useCount: 1 },
      {
        headers: {
          authorization: `Basic ${btoa(
            `admin:${this.pds.ctx.cfg.adminPassword}`
          )}`,
        },
        encoding: "application/json",
      }
    );

    const res = await agent.createAccount({
      inviteCode: inviteRes.data.code,
      email,
      handle,
      password,
    });
    await agent.upsertProfile(async () => {
      const blob = await agent.uploadBlob(this.profilePic, {
        encoding: "image/jpeg",
      });
      return {
        displayName: handle,
        avatar: blob.data.blob,
      };
    });
    this.users["dummy"] = {
      did: res.data.did,
      email,
      handle,
      password,
      agent: agent,
    };
  }

  async createUser(name: string) {
    const agent = new BskyAgent({ service: this.agent.service });

    const inviteRes = await agent.api.com.atproto.server.createInviteCode(
      { useCount: 1 },
      {
        headers: {
          authorization: `Basic ${btoa(
            `admin:${this.pds.ctx.cfg.adminPassword}`
          )}`,
        },
        encoding: "application/json",
      }
    );

    const email = `fake${Object.keys(this.users).length + 1}@fake.com`;
    const res = await agent.createAccount({
      inviteCode: inviteRes.data.code,
      email,
      handle: name + ".test",
      password: "hunter2",
    });
    await agent.upsertProfile(async () => {
      const blob = await agent.uploadBlob(this.profilePic, {
        encoding: "image/jpeg",
      });
      return {
        displayName: name,
        avatar: blob.data.blob,
      };
    });
    this.users[name] = {
      did: res.data.did,
      email,
      handle: name + ".test",
      password: "hunter2",
      agent: agent,
    };
  }

  async follow(a: string, b: string) {
    await this.users[a].agent.follow(this.users[b].did);
  }

  async generateStandardGraph() {
    await this.createUser("alice");
    await this.createUser("bob");
    await this.createUser("carla");

    await this.users.alice.agent.upsertProfile(() => ({
      displayName: "Alice",
      description: "Test user 1",
    }));

    await this.users.bob.agent.upsertProfile(() => ({
      displayName: "Bob",
      description: "Test user 2",
    }));

    await this.users.carla.agent.upsertProfile(() => ({
      displayName: "Carla",
      description: "Test user 3",
    }));

    await this.follow("alice", "bob");
    await this.follow("alice", "carla");
    await this.follow("bob", "alice");
    await this.follow("bob", "carla");
    await this.follow("carla", "alice");
    await this.follow("carla", "bob");
  }

  async createPost(user: string, text: string) {
    const agent = this.users[user]?.agent;
    if (!agent) {
      throw new Error(`Not a user: ${user}`);
    }
    return await agent.post({
      text,
      langs: ["en"],
      createdAt: new Date().toISOString(),
    });
  }

  async createQuotePost(
    user: string,
    text: string,
    { uri, cid }: { uri: string; cid: string }
  ) {
    const agent = this.users[user]?.agent;
    if (!agent) {
      throw new Error(`Not a user: ${user}`);
    }
    return await agent.post({
      text,
      embed: { $type: "app.bsky.embed.record", record: { uri, cid } },
      langs: ["en"],
      createdAt: new Date().toISOString(),
    });
  }

  async createReply(
    user: string,
    text: string,
    { uri, cid }: { uri: string; cid: string }
  ) {
    const agent = this.users[user]?.agent;
    if (!agent) {
      throw new Error(`Not a user: ${user}`);
    }
    return await agent.post({
      text,
      reply: { root: { uri, cid }, parent: { uri, cid } },
      langs: ["en"],
      createdAt: new Date().toISOString(),
    });
  }

  async like(user: string, { uri, cid }: { uri: string; cid: string }) {
    const agent = this.users[user]?.agent;
    if (!agent) {
      throw new Error(`Not a user: ${user}`);
    }
    return await agent.like(uri, cid);
  }

  async createInvite(forAccount: string) {
    const agent = new BskyAgent({ service: this.agent.service });
    await agent.api.com.atproto.server.createInviteCode(
      { useCount: 1, forAccount },
      {
        headers: {
          authorization: `Basic ${btoa(
            `admin:${this.pds.ctx.cfg.adminPassword}`
          )}`,
        },
        encoding: "application/json",
      }
    );
  }

  async labelAccount(label: string, user: string) {
    const did = this.users[user]?.did;
    if (!did) {
      throw new Error(`Invalid user: ${user}`);
    }
    const ctx = this.pds.ctx;
    if (!ctx) {
      throw new Error("Invalid PDS");
    }

    await ctx.db.db
      .insertInto("label" as any)
      .values([
        {
          src: (ctx.cfg as any).labelerDid,
          uri: did,
          cid: "",
          val: label,
          neg: 0,
          cts: new Date().toISOString(),
        },
      ])
      .execute();
  }

  async labelProfile(label: string, user: string) {
    const agent = this.users[user]?.agent;
    const did = this.users[user]?.did;
    if (!did) {
      throw new Error(`Invalid user: ${user}`);
    }

    const profile = await agent.app.bsky.actor.profile.get({
      repo: user + ".test",
      rkey: "self",
    });

    const ctx = this.pds.ctx;
    if (!ctx) {
      throw new Error("Invalid PDS");
    }
    await ctx.db.db
      .insertInto("label" as any)
      .values([
        {
          src: (ctx.cfg as any).labelerDid,
          uri: profile.uri,
          cid: profile.cid,
          val: label,
          neg: 0,
          cts: new Date().toISOString(),
        },
      ])
      .execute();
  }

  async labelPost(label: string, { uri, cid }: { uri: string; cid: string }) {
    const ctx = this.pds.ctx;
    if (!ctx) {
      throw new Error("Invalid PDS");
    }
    await ctx.db.db
      .insertInto("label" as any)
      .values([
        {
          src: (ctx.cfg as any).labelerDid,
          uri,
          cid,
          val: label,
          neg: 0,
          cts: new Date().toISOString(),
        },
      ])
      .execute();
  }

  async createMuteList(user: string, name: string): Promise<string> {
    const res = await this.users[user]?.agent.app.bsky.graph.list.create(
      { repo: this.users[user]?.did },
      {
        purpose: "app.bsky.graph.defs#modlist",
        name,
        createdAt: new Date().toISOString(),
      }
    );
    await this.users[user]?.agent.app.bsky.graph.muteActorList({
      list: res.uri,
    });
    return res.uri;
  }

  async addToMuteList(owner: string, list: string, subject: string) {
    await this.users[owner]?.agent.app.bsky.graph.listitem.create(
      { repo: this.users[owner]?.did },
      {
        list,
        subject,
        createdAt: new Date().toISOString(),
      }
    );
  }
}

const checkAvailablePort = (port: number) =>
  new Promise((resolve) => {
    const server = net.createServer();
    server.unref();
    server.on("error", () => resolve(false));
    server.listen({ port }, () => {
      server.close(() => {
        resolve(true);
      });
    });
  });

async function getPort(start = 3000) {
  for (let i = start; i < 65000; i++) {
    if (await checkAvailablePort(i)) {
      return i;
    }
  }
  throw new Error("Unable to find an available port");
}
