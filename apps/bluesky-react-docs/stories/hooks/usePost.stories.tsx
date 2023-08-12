import type { Meta, StoryObj } from "@storybook/react";
import { provideBlueskyContext } from "../../decorators/provideBlueskyContext";
import { useProfile } from "bluesky-react";
import { CodeView } from "../../components/CodeView";
import { useState } from "react";

const meta = {
    title: "hooks/useProfile",
    decorators: [
        (Story) => provideBlueskyContext(<Story />, { requiredAuth: true }),
    ],
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Demo: Story = {
    args: {},
    render() {
        const [actors, setActors] = useState<string[]>([]);
        const [actor, setActor] = useState("");

        return (
            <div>
                <div>
                    <input value={actor} onChange={(e) => setActor(e.target.value)} />
                    <button onClick={() => setActors((a) => [...a, actor])}>add</button>
                </div>
                <div>
                    {actors.map((a, i) => (
                        <Actor actor={a} key={i} />
                    ))}
                </div>
            </div>
        );
    },
};

function Actor({ actor }: { actor: string }) {
    const { profile } = useProfile({ actor });

    return <CodeView>{JSON.stringify(profile, null, 2)}</CodeView>;
}
