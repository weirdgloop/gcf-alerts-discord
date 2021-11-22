require('dotenv');
const express = require('express');
const discord = require('discord.js')
const bodyParser = require('body-parser');

const app = express();
const port = 6969;

const webhookClient = new discord.WebhookClient({
    url: process.env.DISCORD_WEBHOOK_URL
})

app.use(bodyParser.json())

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

app.post('/', (req, res, next) => {
    if (!req.body.hasOwnProperty('incident')) return // This isn't a suitable Google webhook.

    let embed = new discord.MessageEmbed()
        .setTitle(req.body.incident.policy_name)
        .setColor('#f58a42')
        .setDescription(req.body.incident.summary)
        .setFooter(req.body.incident.resource_type_display_name)
        .setURL(req.body.incident.url)
        .setTimestamp(new Date(req.body.incident.started_at * 1000));
    
    webhookClient.send({
        username: 'Google Cloud',
        embeds: [embed]
    });

    console.log('Received incident. Sending to Discord.');
    res.send(req.body);
});

module.exports = {
    app
};