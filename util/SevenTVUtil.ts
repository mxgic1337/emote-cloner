export function isURLValid(url: string, urlType: 'emotes' | 'users' | 'emote-sets') {
    switch (urlType) {
        default:
            return /^((http|https):\/\/)(www.|)7tv.app\/emotes\/[a-zA-Z0-9]{24}/gi.test(url)
        case 'users':
            return /^((http|https):\/\/)(www.|)7tv.app\/users\/[a-zA-Z0-9]{24}/gi.test(url)
        case 'emote-sets':
            return /^((http|https):\/\/)(www.|)7tv.app\/emote-sets\/[a-zA-Z0-9]{24}/gi.test(url)
    }
}

export async function getEmoteDataFromURL(url: string) {
    return await getEmoteData(url.split('/')[4].split('/')[0])
}

export async function getEmoteData(id: string) {
    const response = await fetch('https://7tv.io/v3/emotes/' + id)
    if (response.ok) {
        return await response.json()
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