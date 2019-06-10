module.exports = {
    database: "mongodb://root:root123@ecommerce-shard-00-00-tf14p.mongodb.net:27017,ecommerce-shard-00-01-tf14p.mongodb.net:27017,ecommerce-shard-00-02-tf14p.mongodb.net:27017/dau?ssl=true&replicaSet=ecommerce-shard-0&authSource=admin&retryWrites=true",,
    port : process.env.PORT || 3000,
    secretKey: 'helloformserver'


}
