import {
    ChatInputCommandInteraction,
    PermissionFlagsBits,
    REST,
    Routes,
    SlashCommandBuilder
} from 'discord.js'
import {clientId, token} from "../bot";

/** Command data sent to Discord */
const commandData = [
    new SlashCommandBuilder()
        .setName("emote")
        .setDescription("Adds an BetterTTV/7TV emote.")
        .addStringOption(option =>
            option.setName('url')
                .setDescription("Emote URL")
                .setRequired(true))
        .addStringOption(option =>
            option.setName('size')
                .setDescription("Emote size")
                .addChoices(
                    {name: '1x', value: '1x'},
                    {name: '2x', value: '2x'},
                    {name: '4x (3x on BTTV)', value: '4x'},
                ))
        .addStringOption(option =>
            option.setName('name')
                .setDescription("Name"))
        .addBooleanOption(option =>
            option.setName('disable_animations')
                .setDescription("Disable animations"))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuildExpressions)
        .toJSON(),
]

export class Command {
    private readonly _name: string;
    private readonly _execute: (interaction: ChatInputCommandInteraction) => void;

    constructor(name: string, execute: (interaction: ChatInputCommandInteraction) => void) {
        this._name = name;
        this._execute = execute;
    }


    get name(): string {
        return this._name;
    }

    get execute(): (interaction: ChatInputCommandInteraction) => void {
        return this._execute;
    }
}

/** List of executable commands */
export const commandList: Command[] = []

/** A function that registers commands in Discord */
export async function registerCommands() {
    const rest = new REST({version: '10'}).setToken(token)
    try {
        await rest.put(Routes.applicationCommands(clientId), {body: commandData})
    } catch (err) {
        console.error(err);
    }
}