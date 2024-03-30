import {Emote} from "./BetterTTVUtil";


export async function getEmoteDataFromURL(url: string) {
    return await getEmoteData(url.split('/')[4].split('/')[0])
}

interface SevenTVEmote {
    id: string,
    name: string,
    animated: boolean,
    owner: {
        id: string,
        username: string,
        display_name: string,
        avatar_url: string,
    },
    host: {
        url: string,
        files: {
            name: string,
            static_name: string,
            width: number,
            height: number,
            frame_count: number,
            size: number,
            format: string,
        }[]
    }
}

export async function getEmoteData(id: string) {
    const response = await fetch('https://7tv.io/v3/emotes/' + id)
    if (response.ok) {
        const emote = await response.json() as SevenTVEmote;
        if (emote.name === "*UnknownEmote") return undefined
        return {
            platform: '7tv',
            name: emote.name,
            hostURL: 'https:' + emote.host.url + '/{{size}}',
            animated: emote.animated,
            author: {
                name: emote.owner.display_name,
                avatar: 'https:' + emote.owner.avatar_url,
            }
        } as Emote
    }else{
        const text = await response.text()
        console.error(text)
        return undefined
    }
}