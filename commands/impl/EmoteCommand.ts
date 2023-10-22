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

                const animatedURL = emote.hostURL.replace('{{size}}', sizeOption !== null ? platform === 'bttv' && sizeOption.value === '4x' ? '3x' : '4x' : '1x') + '.gif';
                const animatedFullURL = emote.hostURL.replace('{{size}}', platform === 'bttv' ? '3x' : '4x') + '.gif';
                const staticURL = emote.hostURL.replace('{{size}}', sizeOption !== null ? platform === 'bttv' && sizeOption.value === '4x' ? '3x' : '4x' : platform === 'bttv' ? '3x' : '4x') + '.webp';
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

                const embed = new EmbedBuilder()
                    .setTitle(`${emote.name} by ${emote.author.name}`)
                    .setAuthor({
                        name: emote.author.name,
                        iconURL: emote.author.avatar
                    })
                    .setTimestamp()
                    .setFooter({
                        text: 'Added by ' + interaction.user.username,
                        iconURL: interaction.user.avatarURL() !== null ? '' + interaction.user.avatarURL() : interaction.user.defaultAvatarURL
                    })
                    .setDescription(`Uploading emote to Discord...\nSelected size: \`${sizeOption !== null ? sizeOption.value : emote.animated && !disableAnimations ? '1x (Default)' : '4x (Default)'}\``)
                    .setColor('#333333')
                    .setFields([
                        {
                            name: 'State',
                            value: 'Uploading to Discord...',
                            inline: false,
                        },
                        {
                            name: 'Emote Name',
                            value: emote.name,
                            inline: true,
                        },
                        {
                            name: 'Emote Author',
                            value: emote.author.name,
                            inline: true,
                        },
                        {
                            name: 'Animated?',
                            value: emote.animated ? `Yes${disableAnimations ? ' (Disabled)' : ''}` : 'No',
                            inline: true,
                        },
                        {
                            name: 'Platform',
                            value: `${platformIcon} ${platformText}`,
                            inline: true,
                        },
                    ])
                    .setThumbnail(emote.animated ? emote.hostURL.replace('{{size}}', sizeOption !== null ? platform === "bttv" && (sizeOption.value as string) === "4x" ? "3x" : sizeOption.value as string : '4x.gif') : emote.hostURL.replace('{{size}}', sizeOption !== null ? platform === "bttv" && (sizeOption.value as string) === "4x" ? "3x" : sizeOption.value as string : platform === 'bttv' ? '3x.webp' : '4x.webp'))
                interaction.reply({embeds: [embed]}).then(() => {
                    if (!interaction.guild) return;
                    if (emote === undefined) return;
                    interaction.guild.emojis.create({
                        attachment: emote.animated && !disableAnimations ?
                            animatedURL :
                            staticURL,
                            name: name
                    }).then(emoji => {
                        console.error(`Uploaded emote in guild ${interaction.guildId}.`)
                        if (emote === undefined) return;
                        const embed = new EmbedBuilder()
                            .setTitle(`${emote.name} by ${emote.author.name}`)
                            .setAuthor({
                                name: emote.author.name,
                                iconURL: emote.author.avatar
                            })
                            .setFooter({
                                text: 'Added by ' + interaction.user.username,
                                iconURL: interaction.user.avatarURL() !== null ? '' + interaction.user.avatarURL() : interaction.user.defaultAvatarURL
                            })
                            .setTimestamp()
                            .setColor('#00ff59')
                            .setDescription(`Successfully added <${emoji.animated ? 'a' : ''}:${emoji.name}:${emoji.id}> **${emote.name}${name !== emote.name ? ` (${name})` : ''}** emote to Discord\nSelected size: \`${sizeOption !== null ? sizeOption.value : emote.animated && !disableAnimations ? '1x (Default)' : '4x (Default)'}\``)
                            .setFields([
                                {
                                    name: 'State',
                                    value: 'Done',
                                    inline: false,
                                },
                                {
                                    name: 'Emote Name',
                                    value: emote.name,
                                    inline: true,
                                },
                                {
                                    name: 'Emote Author',
                                    value: emote.author.name,
                                    inline: true,
                                },
                                {
                                    name: 'Animated?',
                                    value: emote.animated ? `Yes${disableAnimations ? ' (Disabled)' : ''}` : 'No',
                                    inline: true,
                                },
                                {
                                    name: 'Platform',
                                    value: `${platformIcon} ${platformText}`,
                                    inline: true,
                                },
                            ])
                            .setThumbnail(emote.animated ? animatedFullURL : staticFullURL)
                        interaction.editReply({embeds: [embed]})
                    }).catch(err => {
                        console.error(`Emote upload in guild ${interaction.guildId} failed: ${err.message}`)
                        if (emote === undefined) return;
                        const embed = new EmbedBuilder()
                            .setTitle(`${emote.name} by ${emote.author.name}`)
                            .setAuthor({
                                name: emote.author.name,
                                iconURL: emote.author.avatar
                            })
                            .setDescription(`Selected size: \`${sizeOption !== null ? sizeOption.value : emote.animated && !disableAnimations ? '1x (Default)' : '4x (Default)'}\``)
                            .setTimestamp()
                            .setFooter({
                                text: 'Added by ' + interaction.user.username,
                                iconURL: interaction.user.avatarURL() !== null ? '' + interaction.user.avatarURL() : interaction.user.defaultAvatarURL
                            })
                            .setColor('#ff2020')
                            .setFields([
                                {
                                    name: 'State',
                                    value: 'Failed',
                                    inline: false,
                                },
                                {
                                    name: 'Error Message',
                                    value: '`' + err.message + '`',
                                    inline: false,
                                },
                                {
                                    name: 'Emote Name',
                                    value: emote.name,
                                    inline: true,
                                },
                                {
                                    name: 'Emote Author',
                                    value: emote.author.name,
                                    inline: true,
                                },
                                {
                                    name: 'Animated?',
                                    value: emote.animated ? `Yes${disableAnimations ? ' (Disabled)' : ''}` : 'No',
                                    inline: true,
                                },
                                {
                                    name: 'Platform',
                                    value: `${platformIcon} ${platformText}`,
                                    inline: true,
                                },
                            ])
                            .setThumbnail(emote.animated ? animatedFullURL : staticFullURL)
                        interaction.editReply({embeds: [embed]})
                    })
                }).catch(err => {
                    console.error(err)
                    const embed = new EmbedBuilder()
                        .setTitle("Error")
                        .setAuthor({
                            name: interaction.user.displayName,
                            iconURL: `https://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}.jpeg`
                        })
                        .setTimestamp()
                        .setColor('#ff2020')
                        .setDescription("`❌` Failed to send a status message.\nError: `"+err.message+"`")
                    interaction.reply({embeds: [embed]}).then().catch(console.error)
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