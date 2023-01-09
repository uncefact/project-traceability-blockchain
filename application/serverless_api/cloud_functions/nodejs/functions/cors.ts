import { HttpFunction } from '@google-cloud/functions-framework';

export const cors: HttpFunction = (req, res) => {

    if (req.method === "OPTIONS") {
        res.set("Access-Control-Allow-Headers", "*");
        res.set("Access-Control-Allow-Origin", "*");
        res.set("Access-Control-Allow-Methods", "*");

        // stop preflight requests here
        res.status(204).send('OK');
        return;
    };
};