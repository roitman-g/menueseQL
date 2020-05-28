
const mutation = require('./mutationSchema')
const zeros = (n) => [...Array(n)].map(e => Array(n).fill(0));
const query = require('./querySchema')
const { GraphQLSchema: schema } = require('graphql')
module.exports = new schema ({
    mutation, 
    query,
    context: ({ req }) => ({
      user: req.user
    })
    // context: ({ req }) => {
    //     // get the user token from the headers
    //     const token = req.headers.authentication || '';
         
    //     // try to retrieve a user with the token
    //     const user = getUser(token);
       
    //     // optionally block the user
    //     // we could also check user roles/permissions here
    //     // if (!user) throw new AuthenticationError('you must be logged in to query this schema');  
       
    //     // add the user to the context
    //     return {
    //       user,
    //       models: {
    //         User: generateUserModel({ user }),
    //       }
    //     };
    //    },
}) 