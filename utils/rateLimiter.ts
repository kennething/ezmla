import { RateLimiterMemory } from "rate-limiter-flexible";

export default new RateLimiterMemory({
    points: 10, // Number of requests
    duration: 60 // Per 60 seconds
});
