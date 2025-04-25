import { storageService } from './async-storage.service'
import { httpService } from './http.service'

const STORAGE_KEY_LOGGEDIN_USER = 'loggedinUser'
const USER_URL = 'user/'
const AUTH_URL = 'auth/'

export const userService = {
    login,
    logout,
    signup,
    getLoggedinUser,
    getDefaultUser,
    getUsers,
    getById,
    remove,
    update
}


function getUsers() {
    // return storageService.query('user')
    try {
        return httpService.get(USER_URL)
    } catch (err) {
        throw err
    }
}

async function getById(userId) {
    try {
        const user = await httpService.get(USER_URL + userId)
        return user
    } catch (err) {
        throw err
    }
    // const user = await storageService.get('user', userId)
    // return user
}

function remove(userId) {
    try {
        return httpService.delete(USER_URL + userId)
    } catch (err) {
        throw err
    }
    // return storageService.remove('user', userId)
}

async function update(user) {
    if (getLoggedinUser()._id === user._id) {
        try {
            return await httpService.put(USER_URL + user._id, user)
        } catch (err) {
            throw err
        }
    }

    // const user = await storageService.get('user', _id)
    // await storageService.put('user', user)

    // if (getLoggedinUser()._id === user._id) saveLocalUser(user)
    // return user
}

async function login({ username, password }) {
    try {
        const user = await httpService.post(AUTH_URL + 'login', { username, password })
        if (user) return _setLoggedinUser(user)
    } catch (err) {
        throw err
    }
    // const users = await storageService.query('user')
    // const user = users.find(user => user.username === userCred.username)
    // if (user) {
    //     return saveLocalUser(user)
    // }
}

async function signup({ username, password, fullname, imgUrl = 'https://cdn1.monday.com/dapulse_default_photo.png' }) {
    try {
        const userToSign = { username, password, fullname, imgUrl }
        const user = await httpService.post(AUTH_URL + 'signup', userToSign)
        if (user) return _setLoggedinUser(user)
    } catch (err) {
        throw err
    }
    // const user = await storageService.post('user', userCred)
}

async function logout() {
    sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER)
    return Promise.resolve()
    // return await httpService.post('auth/logout')
}

function getLoggedinUser() {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER))
}

function _setLoggedinUser(user) {
    const userToSave = { _id: user._id, fullname: user.fullname, imgUrl: user.imgUrl }
    sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(userToSave))
    return userToSave
}

function getDefaultUser() {
    return {
        _id: 'UjCos',
        fullname: 'Guest',
        imgUrl: "https://cdn1.monday.com/dapulse_default_photo.png"
    }
}

