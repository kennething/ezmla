/**
 * @warning Be sure to await this function in order to actually use the delay.
 * @param {number} ms - Number of milliseconds to delay.
 * @example await delay(1000); // Wait for 1 second
 */
export function delay(ms: number): Promise<void> {
    return new Promise((executor: any) => setTimeout(executor, ms));
}

/** Returns a random integer between `min` and `max`, inclusive. */
export function getRandomInt(min: number, max: number) {
    const minCeiled: number = Math.ceil(min);
    const maxFloored: number = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled);
}

export function getRandomItemFromArray(arr: any[]) {
    return arr[getRandomInt(0, arr.length - 1)];
}

export function formatDescription(description: string) {
    const parts = [];
    const regex = /\*\*(.*?)\*\*/g;
    let lastIndex = 0;

    let match;
    while ((match = regex.exec(description)) !== null) {
        if (match.index > lastIndex) {
            parts.push({ text: description.slice(lastIndex, match.index), bold: false });
        }

        parts.push({ text: match[1], bold: true });
        lastIndex = regex.lastIndex;
    }

    if (lastIndex < description.length) {
        parts.push({ text: description.slice(lastIndex), bold: false });
    }

    return parts;
}
