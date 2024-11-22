type Body = {
    url: string;
};

export default defineEventHandler(async (event) => {
    setHeader(event, "Access-Control-Allow-Methods", "POST");

    const body = (await readBody(event)) as Body;

    if (!body.url) {
        return { error: "URL is required" };
    }

    try {
        const response = await fetch(body.url, { headers: { "User-Agent": "Mozilla/5.0" } });
        const html = await response.text();

        const metadata: Record<string, string | null> = {};
        const titleMatch = html.match(/<title>(.*?)<\/title>/i);
        metadata.title = titleMatch ? titleMatch[1] : null;

        const metaTags = html.match(/<meta[^>]*>/gi);
        if (metaTags) {
            metaTags.forEach((tag) => {
                const nameMatch = tag.match(/name=["'](.*?)["']/i);
                const propertyMatch = tag.match(/property=["'](.*?)["']/i);
                const contentMatch = tag.match(/content=["'](.*?)["']/i);

                const key = nameMatch?.[1] || propertyMatch?.[1];
                const value = contentMatch?.[1];

                if (key && value) {
                    metadata[key] = value;
                }
            });
        }

        return { metadata };
    } catch (error) {
        if (error instanceof Error) return { error: error.message };
    }
});
