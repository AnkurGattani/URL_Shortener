import URL from "../models/url.model";
import { nanoid } from "nanoid";
import { checkCustomShortUrl, getShortUrl, getUserUrls, saveShortUrl } from "../dao/shortUrl.dao";

const createShortUrlSlug = async(url, userId, slug=null) => {
    const shortUrl = slug || nanoid(7);
    const checkIfExists = await checkCustomShortUrl(slug);
    if(checkIfExists) {
        throw new Error("Url already exists. Try again!");
    }

    await saveShortUrl(shortUrl, url, userId);
    return shortUrl;
}

export const createShortUrl = async (req, res) => {
    const data  = req.body;
    const shortUrl = createShortUrlSlug(data.url, data.userId, data.slug);
    return res.status(201).json({
        shortUrl: process.env.BASE_URL + shortUrl
    })
}

export const redirectFromShortUrl = async(req, res) => {
    const {id} = req.params;
    const url = await getShortUrl(id);
    if(!url){
        return res.status(403).json({
            message: "No such URL exists!"
        });
    }
    res.redirect(url.originalUrl);
}

export const getAllUserUrls = async(req, res) => {
    const userId = req.user?._id;
    try {
        const urls = getUserUrls(userId);
        res.status(200).json({urls});
    } catch (error) {
        res.status(500).json({
            message: "Error fetching URLs.",
            error: error.message
        })
    }
}
