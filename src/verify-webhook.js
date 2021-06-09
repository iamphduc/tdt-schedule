
const verifyWebhook = (req, res) => {
    const VERIFY_TOKEN = 'pusher-bot';

    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];

    if (mode && token === VERIFY_TOKEN) {
        return res.status(200).send(challenge);
    }
        
    return res.sendStatus(403);
}

module.exports = verifyWebhook;
