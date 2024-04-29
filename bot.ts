import {Client, GatewayIntentBits, ActivityType} from "discord.js";
import dotenv from 'dotenv'
import {commandList, registerCommands} from "./commands/commands";
import {EmoteCommand} from "./commands/impl/EmoteCommand";

dotenv.config()

export const clientId =  (process.env.DEV_MODE === "true" ? process.env.DEV_CLIENT_ID : process.env.CLIENT_ID) as string;
export const token: string = (process.env.DEV_MODE === "true" ? process.env.DEV_TOKEN : process.env.TOKEN) as string
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.on('ready', (c)=>{
    registerCommands().then()
    commandList.push(new EmoteCommand())
    console.log(`Bot is ready. Logged in as ${c.user.tag}`)
    setInterval(()=>{
        c.user.setPresence({
            status: 'online',
            activities: [
                {name: `/emote`, type: ActivityType.Watching, state: `Cloning emotes on ${c.guilds.cache.size} servers! ✨`},
            ],
        })
    }, 60000)
})

client.on('interactionCreate', (interaction)=>{
    if (!interaction.isChatInputCommand()) return;
    for (const command of commandList) {
        if (command.name === interaction.commandName) {
            command.execute(interaction).catch(err => {
                console.error(`Command /${interaction.commandName} (${interaction.id}) failed:`);
                console.error(err.stack);
            })
        }
    }
})

if (process.env.TOKEN === undefined || process.env.CLIENT_ID === undefined) {
    console.error('Token or Client ID is undefined.')
}else{
    client.login(token)
}