const {GraphQLNonNull: notNull} = require('graphql')

const createArgs = (args) => {
    return Object.keys(args).reduce((a, c) => ({...a, [c]: {type: notNull(args[c])}}), {})
}

module.exports = { createArgs }