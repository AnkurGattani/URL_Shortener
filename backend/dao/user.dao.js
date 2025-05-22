import User from '../models/user.model.js'
import URL from '../models/url.model.js'

const findUserByEmail = async (email) => {
    return await User.findOne({email});
}

const findUserByEmailAndPassword = async(email) => {
    return await User.findOne({email}.select('+password'));
}

const findUserById = async(id) => {
    return await User.findById(id);
}

const getAllUserUrls = async (id) => {
    return await URL.find({user: id});
}

export { findUserByEmail, findUserByEmailAndPassword, findUserById, getAllUserUrls };