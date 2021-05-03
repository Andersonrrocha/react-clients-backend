require('dotenv').config()
const { ApolloServer, PubSub } = require('apollo-server');

// importação dos typeDefs e Resolvers do Apollo Server
const pubsub = new PubSub();
const typeDefs = require("./graphql/schemas");
const resolvers = require("./graphql/userResolver");

//conectar com banco de dados.
const mongoose = require("mongoose");
const uri = process.env.DB_HOST;
const dbOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
 };

 //conectar com MongoDB cloud
mongoose
    .connect(uri,dbOptions)
    .then( () => {
        console.log("database connected");

        // subir o servidor Apollo APENAS se for possivel conectar ao banco MongoDB.
        const server = new ApolloServer( { typeDefs, resolvers,  context: { pubsub }});
        server
            .listen()
            .then(({url})=> console.log(`Servidor rodando na porta ${url}`))
            .catch( (error) => console.log("Server failed: ", error));
    })
    .catch( (error) => console.log("Database failed: ", error)
);


