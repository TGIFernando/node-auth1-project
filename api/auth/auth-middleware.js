const Auth = require('./auth-model')

const checkPayload = (req, res, next) => {
    if (!req.body.username || !req.body.password) {
      res.status(401).json('username and password are required')
    } else {
      next()
    }
}

const checkUsernameUnique = async (req, res, next) => {
    try {
      const rows = await Auth.findBy({ username: req.body.username })
      if (!rows.length) {
        next()
      } else {
        res.status(401).json('username taken')
      }
    } catch (err) {
      res.status(500).json('something failed tragically')
    }
}

const checkUsernameExists = async (req, res, next) => {

    try {
      const rows = await Auth.findBy({ username: req.body.username })
      if (rows.length) {
        req.userData = rows[0]
        next()
      } else {
        res.status(401).json('who is that exactly?')
      }
    } catch (err) {
      res.status(500).json('something failed tragically')
    }
}

const restricted = (req, res, next) => {
    if (req.session && req.session.user) {
      next()
    } else {
      res.status(401).json('unauthorized')
    }
}

module.exports = {
    checkPayload,
    checkUsernameUnique,
    checkUsernameExists,
    restricted
}