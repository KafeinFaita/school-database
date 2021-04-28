const jwt = require('jsonwebtoken')
const User = require('../models/User')

const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt

    if (token) {
        jwt.verify(token, 'schooldb secret', (err, decodedToken) => {
            if (err) {
                console.log(err.message)
                res.redirect('/login')
            } else {
                next()
            }
        })
    }
    else {
        res.redirect('/login')
    }
}

//check current user
const checkUser = (req, res, next) => {
    const token = req.cookies.jwt

    if (token) {
        jwt.verify(token, 'schooldb secret', async (err, decodedToken) => {
            if (err) {
                console.log(err.message)
                res.locals.user = null
                next()
            } else {
                let user = await User.findById(decodedToken.id)
                res.locals.user = user
                next()
            }
        })
    } else {
        res.locals.user = null
        next()
    }
}

const checkRole = (role) => {
    return (req, res, next) => {
        const token = req.cookies.jwt

        if (token) {
            jwt.verify(token, 'schooldb secret', async (err, decodedToken) => {
                console.log(decodedToken)
                if (err) {
                    console.log(err.message)
                    res.redirect('/404')
                } else {
                    let user = await User.findById(decodedToken.id)

                    const userHasAccess = role.some(r => user.roles.includes(r))

                    if (userHasAccess) {
                        next()
                    } else {
                        res.redirect('/profile')
                    }
                    
                }
            })
        } else {
            res.redirect('/404')
        }
    }
}

module.exports = { requireAuth, checkUser, checkRole }