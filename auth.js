const passport = require('passport')
const passportJWT = require('passport-jwt')
const jwt = require('jsonwebtoken')
const { getItem } = require('./db')
const sha256 = require('sha256')

const { Strategy, ExtractJwt } = passportJWT
const secretOrKey = 'SomeVeryCoolSecretCode'

// auth middleware
const authMiddleware = () => {
    const params = {
        secretOrKey,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        credentialsRequired: false
      }
      
      const strategy = new Strategy(params, (payload, done) => {
          console.log('here is the payload', payload)
          const { id } = payload
          const user = getItem('user', { id })
          console.log('something is happening here')
      
          return done(null, user)
      })
      
      passport.use(strategy)
      passport.initialize()

      return (req, res, next) => passport.authenticate('jwt', { session: false }, (err, user, info) => {
          console.log('here is error', err)
          console.log('in auth middleware', user)
          console.log('here is info', info)

        if (user) {
            req.user = user
        } else {
            req.user = null
        }
        next()
    })(req, res, next)
}

// if credentials are valid returns user id, else 0 
const validate = (username, password) => {
    const user = getItem('user', {username})
    const hashedPassword = sha256(password)

    if (hashedPassword != user.password) return 0
    return user.id
}

const hashPassword = (password) => sha256(password)

const createToken = (userId) => jwt.sign({ id: userId }, secret, {
    expiresIn: 86400 // 24 hours
});


module.exports = {
    hashPassword,
    createToken,
    validate,
    authMiddleware
}
