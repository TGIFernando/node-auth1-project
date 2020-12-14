const express = require('express')
const bcrypt = require('bcryptjs')
const Auth = require('./auth-model')
const router = express.Router()
const M = require('./auth-middleware')


router.post('/register', M.checkPayload, M.checkUsernameUnique, async (req, res) => {
    try {
        const hash = bcrypt.hashSync(req.body.password, 12)
        const newUser = await Auth.add({ username: req.body.username, password: hash})
        res.status(201).json(newUser)
    } catch (e) {
        res.status(500).json({ message: e.message})
    }
})

router.post('/login',  M.checkPayload, M.checkUsernameExists, (req, res) => {
    try {
        const verify = bcrypt.compareSync(req.body.password, req.userData.password)
        if (verify) {
            req.session.user = req.userData
            res.json(`Logged in`)
        } else {
            res.status(401).json('You shall not pass!')
        }
    } catch (e) {
        res.status(500).json({ message: e.message})
    }
})



module.exports = router