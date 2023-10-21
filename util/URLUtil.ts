/** Checks if provided URL points to BetterTTV */
export function isBTTVURLValid(url: string, urlType: 'emotes' | 'users') {
    switch (urlType) {
        default:
            return /^((http|https):\/\/)(www.|)betterttv.com\/emotes\/[a-zA-Z0-9]{24}/gi.test(url)
        case 'users':
            return /^((http|https):\/\/)(www.|)betterttv.com\/users\/[a-zA-Z0-9]{24}/gi.test(url)
    }
}

/** Checks if provided URL points to FrankerFaceZ */
export function isFFZURLValid(url: string) {
    return /^((http|https):\/\/)(www.|)frankerfacez.com\/emoticon\/*/gi.test(url)
}

/** Checks if provided URL points to 7TV */
export function is7TVURLValid(url: string, urlType: 'emotes' | 'users' | 'emote-sets') {
    switch (urlType) {
        default:
            return /^((http|https):\/\/)(www.|)7tv.app\/emotes\/[a-zA-Z0-9]{24}/gi.test(url)
        case 'users':
            return /^((http|https):\/\/)(www.|)7tv.app\/users\/[a-zA-Z0-9]{24}/gi.test(url)
        case 'emote-sets':
            return /^((http|https):\/\/)(www.|)7tv.app\/emote-sets\/[a-zA-Z0-9]{24}/gi.test(url)
    }
}

/**
 * Checks if provided URL points to any emote provider
 * @returns platform Platform ID (bttv, ffz, 7tv or undefined)
 */
export function isEmoteURL(url: string) {
    if (is7TVURLValid(url, 'emotes')) return '7tv'
    // else if (isFFZURLValid(url)) return 'ffz'
    else if (isBTTVURLValid(url, 'emotes')) return 'bttv'
    else return undefined
}