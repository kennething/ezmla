import rateLimiter from "~/utils/rateLimiter";

export default defineEventHandler(async (event) => {
    const ip = getRequestHeader(event, "x-forwarded-for") || getRequestHeader(event, "host") || "unknown";

    try {
        await rateLimiter.consume(ip);
    } catch (rateLimitError) {
        return sendError(
            event,
            createError({
                statusCode: 429,
                statusMessage: "Too many requests. Try again later."
            })
        );
    }
});
