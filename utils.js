

const {entries} = require('rambda')


const mapObject = object => tables => entries(object).reduce((a, c) =>  ({}), {})