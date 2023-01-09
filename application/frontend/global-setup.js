module.exports = async () => {
    if (process.platform == "win32" || process.platform == "win64") {
        const setTZ = require('set-tz')
        setTZ('UTC');
    }
    process.env.TZ = 'UTC';
};