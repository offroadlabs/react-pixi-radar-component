import type { Meta, StoryObj } from "@storybook/react";
import { AirportRadar } from "../components/AirportRadar";

const meta = {
  title: "Components/AirportRadar",
  component: AirportRadar,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: { type: "number", min: 100, max: 800, step: 50 },
      description: "Taille du radar en pixels",
    },
    backgroundColor: {
      control: "color",
      description: "Couleur de fond du radar",
    },
    radarColor: {
      control: "color",
      description: "Couleur de la ligne de balayage",
    },
    speed: {
      control: { type: "number", min: 1, max: 10, step: 0.5 },
      description: "Vitesse de rotation (en secondes par tour)",
    },
    range: {
      control: { type: "number", min: 10, max: 200, step: 10 },
      description: "Portée du radar en unités",
    },
  },
  decorators: [
    (Story) => (
      <div className="p-8 bg-slate-900">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AirportRadar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    size: 500,
    backgroundColor: "#001f3f",
    radarColor: "#00ff00",
    speed: 4,
    range: 100,
  },
};
