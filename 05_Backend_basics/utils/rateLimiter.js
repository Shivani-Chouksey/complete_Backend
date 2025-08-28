import { rateLimit } from 'express-rate-limit'

export const limiter=rateLimit({
    windowMs: 2 * 60 * 1000, // 15 minutes
	limit: 1, 
    message:"Too many login attempts from this IP, please try again after a 2 minutes",
    statusCode:429,
})