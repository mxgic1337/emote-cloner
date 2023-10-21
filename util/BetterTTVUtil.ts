

export async function getEmoteDataFromURL(url: string) {
    return await getEmoteData(url.split('/')[4].split('/')[0])
}

export async function getEmoteData(id: string) {
    const response = await fetch('https://api.betterttv.net/3/emotes/' + id)
    if (response.ok) {
        const emote = await response.json();
        return {
            platform: 'bttv',
            name: emote.code,
            hostURL: 'https://cdn.betterttv.net/emote/'+emote.id+'/{{size}}',
            animated: emote.animated,
            author: {
                name: emote.user.displayName,
                avatar: 'https://pbs.twimg.com/profile_images/1615415316657364994/r3yTCKWx_400x400.jpg',
            }
        } as Emote
    }else{
        const text = await response.text()
        console.error(text)
        return undefined
    }
}

export type Emote = {
    platform: 'bttv' | 'ffz' | '7tv',
    name: string,
    hostURL: string,
    animated: boolean,
    author: {
        name: string,
        avatar: string
    }
}