import {Emote} from "./BetterTTVUtil";


export async function getEmoteDataFromURL(url: string) {
    return await getEmoteData(url.split('/')[4].split('/')[0])
}

export async function getEmoteData(id: string) {
    const response = await fetch('https://7tv.io/v3/emotes/' + id)
    if (response.ok) {
        const emote = await response.json();
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

export async function getEmoteSetDataFromURL(url: string) {
    return await getEmoteSetData(url.split('/')[4].split('/')[0])
}

export async function getEmoteSetData(id: string) {
    const response = await fetch('https://7tv.io/v3/emote-sets/' + id)
    if (response.ok) {
        return await response.json()
    }else{
        const text = await response.text()
        console.error(text)
        return undefined
    }
}