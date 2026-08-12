import type { Meta, StoryObj } from "@storybook/react-vite";
import { AtSign, DollarSign, Search as SearchIcon, Send } from "lucide-react";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput,
	InputGroupText,
	InputGroupTextarea,
} from "./input-group";

const meta = {
	title: "Components/Input Group",
	component: InputGroup,
	tags: ["autodocs"],

	parameters: {
		layout: "centered",

		docs: {
			description: {
				component:
					"Composable input groups for CarBravo forms, search fields, currency values, dates, and inline actions.",
			},
		},
	},
} satisfies Meta<typeof InputGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

/* -------------------------------------------------------------------------- */
/* Basic                                                                       */
/* -------------------------------------------------------------------------- */

export const Default: Story = {
	render: () => (
		<div className="w-96">
			<InputGroup>
				<InputGroupInput placeholder="Enter program name..." />
			</InputGroup>
		</div>
	),
};

/* -------------------------------------------------------------------------- */
/* Search                                                                      */
/* -------------------------------------------------------------------------- */

export const Search: Story = {
	render: () => (
		<div className="w-96">
			<InputGroup>
				<InputGroupAddon align="inline-start">
					<SearchIcon />
				</InputGroupAddon>

				<InputGroupInput
					placeholder="Search programs..."
					aria-label="Search programs"
				/>
			</InputGroup>
		</div>
	),
};

/* -------------------------------------------------------------------------- */
/* Search with action                                                          */
/* -------------------------------------------------------------------------- */

export const SearchWithAction: Story = {
	render: () => (
		<div className="w-96">
			<InputGroup>
				<InputGroupInput
					placeholder="Search programs..."
					aria-label="Search programs"
				/>

				<InputGroupAddon align="inline-end">
					<InputGroupButton aria-label="Search">
						<SearchIcon />
					</InputGroupButton>
				</InputGroupAddon>
			</InputGroup>
		</div>
	),
};

/* -------------------------------------------------------------------------- */
/* Currency                                                                     */
/* -------------------------------------------------------------------------- */

export const Currency: Story = {
	render: () => (
		<div className="w-96">
			<InputGroup>
				<InputGroupAddon align="inline-start">
					<InputGroupText>
						<DollarSign />
					</InputGroupText>
				</InputGroupAddon>

				<InputGroupInput
					type="number"
					placeholder="0.00"
					aria-label="Incentive amount"
				/>
			</InputGroup>
		</div>
	),
};

/* -------------------------------------------------------------------------- */
/* Email                                                                       */
/* -------------------------------------------------------------------------- */

export const Email: Story = {
	render: () => (
		<div className="w-96">
			<InputGroup>
				<InputGroupAddon align="inline-start">
					<AtSign />
				</InputGroupAddon>

				<InputGroupInput
					type="email"
					placeholder="name@example.com"
					aria-label="Email address"
				/>
			</InputGroup>
		</div>
	),
};

/* -------------------------------------------------------------------------- */
/* Date                                                                        */
/* -------------------------------------------------------------------------- */

export const DateInput: Story = {
	render: () => (
		<div className="w-96">
			<InputGroup>
				<InputGroupInput type="date" aria-label="Program expiration date" />
			</InputGroup>
		</div>
	),
};

/* -------------------------------------------------------------------------- */
/* Button                                                                      */
/* -------------------------------------------------------------------------- */

export const WithButton: Story = {
	render: () => (
		<div className="w-96">
			<InputGroup>
				<InputGroupInput
					placeholder="Enter a program..."
					aria-label="Program"
				/>

				<InputGroupAddon align="inline-end">
					<InputGroupButton aria-label="Submit">
						<Send />
					</InputGroupButton>
				</InputGroupAddon>
			</InputGroup>
		</div>
	),
};

/* -------------------------------------------------------------------------- */
/* Block addon                                                                 */
/* -------------------------------------------------------------------------- */

export const BlockAddon: Story = {
	render: () => (
		<div className="w-96">
			<InputGroup>
				<InputGroupAddon align="block-start">
					<InputGroupText>Program description</InputGroupText>
				</InputGroupAddon>

				<InputGroupTextarea
					placeholder="Describe the incentive program..."
					aria-label="Program description"
					rows={4}
				/>
			</InputGroup>
		</div>
	),
};

/* -------------------------------------------------------------------------- */
/* Textarea                                                                    */
/* -------------------------------------------------------------------------- */

export const Textarea: Story = {
	render: () => (
		<div className="w-96">
			<InputGroup>
				<InputGroupTextarea
					placeholder="Enter program description..."
					aria-label="Program description"
					rows={5}
				/>

				<InputGroupAddon align="block-end">
					<InputGroupText>Maximum 500 characters</InputGroupText>
				</InputGroupAddon>
			</InputGroup>
		</div>
	),
};

/* -------------------------------------------------------------------------- */
/* Invalid                                                                     */
/* -------------------------------------------------------------------------- */

export const Invalid: Story = {
	render: () => (
		<div className="w-96 space-y-2">
			<InputGroup>
				<InputGroupInput
					aria-label="Program name"
					aria-invalid="true"
					placeholder="Program name"
				/>
			</InputGroup>

			<p className="text-xs text-destructive">Program name is required.</p>
		</div>
	),
};

/* -------------------------------------------------------------------------- */
/* CarBravo example                                                            */
/* -------------------------------------------------------------------------- */

export const IncentiveAmount: Story = {
	render: () => (
		<div className="w-96 space-y-2">
			<label htmlFor="incentive-amount" className="text-sm font-medium">
				Incentive amount
			</label>

			<InputGroup>
				<InputGroupAddon align="inline-start">
					<InputGroupText>$</InputGroupText>
				</InputGroupAddon>

				<InputGroupInput
					id="incentive-amount"
					type="number"
					placeholder="1,000"
					aria-label="Incentive amount"
				/>
			</InputGroup>

			<p className="text-xs text-muted-foreground">
				Enter the customer incentive amount in USD.
			</p>
		</div>
	),
};
