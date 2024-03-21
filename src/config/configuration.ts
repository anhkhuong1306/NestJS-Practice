export default() => ({
    port: parseInt(process.env.PORT) || 3000,
    database: {
        type: process.env.DB_TYPE,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        entities: ["dist/**/*.entity.js"],
        synchronize: process.env.DB_SYNCHRONIZE,
    },
    secret: process.env.JWT_SECRET_KEY,
});