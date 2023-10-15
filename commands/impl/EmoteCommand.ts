import {Command} from "../commands";
import {ChatInputCommandInteraction, EmbedBuilder} from "discord.js";
import {getEmoteDataFromURL, isURLValid} from "../../util/SevenTVUtil";

export class EmoteCommand extends Command {
    constructor() {
        super("emote", async (interaction: ChatInputCommandInteraction) => {
            const urlOption = interaction.options.get('url');
            const sizeOption = interaction.options.get('size');
            const nameOption = interaction.options.get('name');
            const disableAnimationsOption = interaction.options.get('disable_animations');
            if (urlOption === null) return;
            const emoteURL: string = urlOption.value as string
            if (isURLValid(emoteURL, 'emotes')) {
                const emote = await getEmoteDataFromURL(emoteURL);
                const name = nameOption !== null ? nameOption.value : emote.name
                const disableAnimations = disableAnimationsOption !== null ? disableAnimationsOption.value as boolean : false
                const embed = new EmbedBuilder()
                    .setTitle(`${emote.name} by ${emote.owner.display_name}`)
                    .setAuthor({
                        name: emote.owner.display_name,
                        iconURL: 'https:' + emote.owner.avatar_url
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
                            value: emote.owner.display_name,
                            inline: true,
                        },
                        {
                            name: 'Animated?',
                            value: emote.animated ? `Yes${disableAnimations ? ' (Disabled)' : ''}` : 'No',
                            inline: true,
                        },
                    ])
                    .setThumbnail(emote.animated ? 'https:' + emote.host.url + `/4x.gif` : 'https:' + emote.host.url + `/4x.webp`)
                interaction.reply({embeds: [embed]}).then(()=>{
                    if (!interaction.guild) return;
                    interaction.guild.emojis.create({
                        attachment: emote.animated && !disableAnimations ? 'https:' + emote.host.url + `/${sizeOption !== null ? sizeOption.value : '1x'}.gif` : 'https:' + emote.host.url + `/${sizeOption !== null ? sizeOption.value : '4x'}.webp`,
                        name: name
                    }).then(emoji => {
                        console.error(`Uploaded emote in guild ${interaction.guildId}.`)
                        const embed = new EmbedBuilder()
                            .setTitle(`${emote.name} by ${emote.owner.display_name}`)
                            .setAuthor({
                                name: emote.owner.display_name,
                                iconURL: 'https:' + emote.owner.avatar_url
                            })
                            .setFooter({
                                text: 'Added by ' + interaction.user.username,
                                iconURL: interaction.user.avatarURL() !== null ? '' + interaction.user.avatarURL() : interaction.user.defaultAvatarURL
                            })
                            .setTimestamp()
                            .setColor('#00ff59')
                            .setDescription(`Successfully added <:${emoji.name}:${emoji.id}> **${emote.name}${name !== emote.name ? ` (${name})` : ''}** emote to Discord\nSelected size: \`${sizeOption !== null ? sizeOption.value : emote.animated && !disableAnimations? '1x (Default)' : '4x (Default)'}\``)
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
                                    value: emote.owner.display_name,
                                    inline: true,
                                },
                                {
                                    name: 'Animated?',
                                    value: emote.animated ? `Yes${disableAnimations ? ' (Disabled)' : ''}` : 'No',
                                    inline: true,
                                },
                            ])
                            .setThumbnail(emote.animated ? 'https:' + emote.host.url + '/4x.gif' : 'https:' + emote.host.url + '/4x.webp')
                        interaction.editReply({embeds: [embed]})
                    }).catch(err => {
                        console.error(`Emote upload in guild ${interaction.guildId} failed: ${err.message}`)
                        const embed = new EmbedBuilder()
                            .setTitle(`${emote.name} by ${emote.owner.display_name}`)
                            .setAuthor({
                                name: emote.owner.display_name,
                                iconURL: 'https:' + emote.owner.avatar_url
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
                                    value: emote.owner.display_name,
                                    inline: true,
                                },
                                {
                                    name: 'Animated?',
                                    value: emote.animated ? `Yes${disableAnimations ? ' (Disabled)' : ''}` : 'No',
                                    inline: true,
                                },
                            ])
                            .setThumbnail(emote.animated ? 'https:' + emote.host.url + '/4x.gif' : 'https:' + emote.host.url + '/4x.webp')
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
                    .setDescription("`❌` Invalid 7TV emote URL.")
                console.log(interaction.user)
                interaction.reply({embeds: [embed]}).then()
            }
        });
    }
}