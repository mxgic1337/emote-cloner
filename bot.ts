import {Client, GatewayIntentBits} from "discord.js";
import dotenv from 'dotenv'
import {commandList, registerCommands} from "./commands/commands";
import {EmoteCommand} from "./commands/impl/EmoteCommand";

dotenv.config()

export const clientId = '' + process.env.CLIENT_ID;
export const token: string = '' + process.env.TOKEN
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.on('ready', (c)=>{
    registerCommands().then()
    commandList.push(new EmoteCommand())
    console.log(`Bot is ready. Logged in as ${c.user.tag}`)
    c.user.setPresence({
        status: 'online',
        activities: [
            {name: '/emote'}
        ]
    })
})

client.on('interactionCreate', (interaction)=>{
    if (!interaction.isChatInputCommand()) return;
    for (const i in commandList) {
        if (commandList[i].name === interaction.commandName) {
            commandList[i].execute(interaction)
        }
    }
})

if (process.env.TOKEN === undefined || process.env.CLIENT_ID === undefined) {
    console.error('Token or Client ID is undefined.')
}else{
    client.login(token)
}