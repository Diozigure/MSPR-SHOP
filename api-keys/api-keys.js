MONGODB_URI='mongodb://192.168.2.45:27017,192.168.2.28:27017/geronimo-shop?replicaSet=rs0'
//MONGODB_URI='mongodb://localhost:27017/geronimo-shop'
PORT=3500
STRIPE_API_KEY='sk_test_51IS2j1D0SUvKbeyj3qLm62eojTkyfYydcqZ16hoJpVWQuQaKZgdU4E5PBrzWkWYdLsbsjgcW6doJP9BG4NDcQaKV00xSoZk4nK'
ENV_NAME='test'
module.exports = {
    MONGODB_URI,
    PORT,
    STRIPE_API_KEY,
    ENV_NAME
}