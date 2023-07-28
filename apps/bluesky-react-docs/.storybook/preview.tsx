import React from "react";
import type { Preview } from "@storybook/react";
import { provideLocalStorage } from "../decorators/provideLocalStorage";

const preview: Preview = {
  decorators: [(Story) => provideLocalStorage(<Story />)],
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

export default preview;
