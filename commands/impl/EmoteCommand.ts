import {Command} from "../commands";
import {ChatInputCommandInteraction, EmbedBuilder} from "discord.js";
import {Emote, getEmoteDataFromURL as getBTTVEmote} from "../../util/BetterTTVUtil";
import {getEmoteDataFromURL as get7TVEmote} from "../../util/SevenTVUtil";
import {isEmoteURL} from "../../util/URLUtil";

export class EmoteCommand extends Command {
    constructor() {
        super("emote", async (interaction: ChatInputCommandInteraction) => {
            const urlOption = interaction.options.get('url');
            const sizeOption = interaction.options.get('size');
            const nameOption = interaction.options.get('name');
            const disableAnimationsOption = interaction.options.get('disable_animations');
            if (urlOption === null) return;
            const emoteURL: string = urlOption.value as string
            const platform = isEmoteURL(emoteURL);
            if (platform !== undefined) {
                let emote: Emote | undefined;
                switch (platform) {
                    case '7tv':
                        emote = await get7TVEmote(emoteURL)
                        break
                    case 'bttv':
                        emote = await getBTTVEmote(emoteURL)
                        break
                    default:
                        emote = undefined
                }
                if (emote === undefined) return;
                const name: string = nameOption !== null ? nameOption.value as string : emote.name
                const disableAnimations = disableAnimationsOption !== null ? disableAnimationsOption.value as boolean : false

                const animatedURL = emote.hostURL.replace('{{size}}', sizeOption !== null ? platform === 'bttv' && sizeOption.value === '4x' ? '3x' : sizeOption.value as string : '2x') + '.gif';
                const animatedFullURL = emote.hostURL.replace('{{size}}', platform === 'bttv' ? '3x' : '4x') + '.gif';
                const staticURL = emote.hostURL.replace('{{size}}', sizeOption !== null ? platform === 'bttv' && sizeOption.value === '4x' ? '3x' : sizeOption.value as string : platform === 'bttv' ? '3x' : '4x') + '.webp';
                const staticFullURL = emote.hostURL.replace('{{size}}', platform === 'bttv' ? '3x' : '4x') + '.webp';
                
                let platformIcon: string;
                let platformText: string;
                switch (emote.platform) {
                    case "bttv":
                        platformIcon = '<:BetterTTV:1165355805487399097>';
                        platformText = 'BetterTTV'
                        break;
                    case "ffz":
                        platformIcon = '<:FrankerFaceZ:1165355987096580097>';
                        platformText = 'FrankerFaceZ'
                        break;
                    case "7tv":
                        platformIcon = '<:7TV:1165355988841402458>';
                        platformText = '7TV'
                        break;
                }

                let embed = new EmbedBuilder()
                    .setAuthor({
                        url: undefined,
                        name: emote.author.name,
                        iconURL: emote.author.avatar
                    })
                    .setTitle(`${emote.name} by ${emote.author.name} (${platformText})`)
                    .setDescription('Uploading emote to Discord...')
                    .setThumbnail(emote.animated && !disableAnimations ? animatedFullURL : staticFullURL)
                    .setTimestamp()
                    .setFooter({
                        text: `Executed by @${interaction.user.username}`
                    })
                    .setColor('#262626')
                    .setFields([
                        {
                            name: 'Platform:',
                            value: `${platformIcon} ${platformText}`
                        },
                        {
                            name: 'Selected size:',
                            value: sizeOption !== null ? sizeOption.value as string : 'Default'
                        },
                        {
                            name: 'Animated:',
                            value: emote.animated ? disableAnimations ? 'No (Disabled)' : 'Yes' : 'No'
                        },
                    ])
                interaction.reply({embeds: [embed]}).then(()=>{
                    const guild = interaction.guild;
                    if (guild === null || emote === undefined) return;
                    console.log(`Uploading to Discord: ${emote.animated && !disableAnimations ? animatedURL : staticURL } ${guild.id}`)
                    guild.emojis.create({
                        attachment: emote.animated && !disableAnimations ? animatedURL : staticURL,
                        name: name,
                        reason: `@${interaction.user.username} used /emote`
                    }).then(emoji => {
                        if (emote === undefined) return;
                        embed
                            .setDescription(`Emote ${emoji.toString()} **${emoji.name}** uploaded to Discord!`)
                            .setThumbnail(emote.animated && !disableAnimations ? animatedFullURL : staticFullURL)
                            .setColor('#00ff59')
                        interaction.editReply({embeds: [embed]})
                    }).catch(err => {
                        if (emote === undefined) return;
                        embed
                            .setDescription(`\`❌\` Upload failed:\n**\`${errorMessage(err)}\`**
                            \nReport bugs/issues on [GitHub](<https://github.com/mxgic1337/emote-cloner/issues>).`)
                            .setThumbnail(emote.animated && !disableAnimations ? animatedFullURL : staticFullURL)
                            .setColor('#ff2323')
                        interaction.editReply({embeds: [embed]})
                    })
                })

            } else {
                const embed = new EmbedBuilder()
                    .setTitle("Error")
                    .setAuthor({
                        name: interaction.user.displayName,
                        iconURL: `https://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}.jpeg`
                    })
                    .setTimestamp()
                    .setColor('#ff2020')
                    .setDescription("`❌` Invalid emote URL.\nCurrently supported platforms: `BetterTTV, 7TV`")
                interaction.reply({embeds: [embed]}).then()
            }
        });
    }
}

function errorMessage(err: Error) {
    if (err.message.includes("Asset exceeds maximum size:") || err.message.includes("Failed to resize asset below the maximum size:")) {return "Emote is too big."}
    else if (err.message.includes("name[STRING_TYPE_REGEX]")) {return "Emote name is invalid."}
    else return err.message
}