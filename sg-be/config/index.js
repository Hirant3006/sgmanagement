require('dotenv').config({
    path: process.env.NODE_ENV === 'production' 
        ? '.env.production' 
        : '.env.development'
});

const config = {
    env: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT, 10) || 3000,
    dbPath: process.env.DB_PATH,
    corsOrigin: process.env.CORS_ORIGIN,
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN,
    isDevelopment: process.env.NODE_ENV === 'development',
    isProduction: process.env.NODE_ENV === 'production',
};

module.exports = config; 