import URL from "../models/url.model";

const saveShortUrl = async (shortenedUrl, originalUrl, userId, expiresAt) => {
    try {
        const newUrl = await URL.create({
            originalUrl,
            shortenedUrl,
            userId,
            expiresAt
        });
        await newUrl.save();
    } catch (error) {
        console.error(error);
    }
}

const getShortUrl = async(shortUrl) => {
    return await URL.findOneAndUpdate({shortenedUrl: shortUrl}, {$inc: {clicks: 1}});

}

const checkCustomShortUrl = async(slug) => {
    return await URL.findOne({shortenedUrl: slug});
}

const getUserUrls = async (userId) => {
    return await URL.find( {userId} ).sort({createdAt: -1});
}

export { saveShortUrl, checkCustomShortUrl, getShortUrl, getUserUrls };