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

    let footer = req.body.incident.resource_type_display_name
    if ( req.body.incident.resource.type == 'cloudsql_database' ) {
        footer += ' • ' + req.body.incident.resource_display_name
    } else if ( req.body.incident.resource.type == 'k8s_container' ) {
        footer += ' • ' + req.body.incident.resource.labels.cluster_name + '/' + req.body.incident.resource.labels.container_name
    } else if ( req.body.incident.hasOwnProperty('metric') && req.body.incident.metric.type == 'logging.googleapis.com/user/Redis-Fatal-Errors' ) {
        footer += ' • ' + req.body.incident.metric.labels.server
    }

    let embed = new discord.MessageEmbed()
        .setTitle(req.body.incident.policy_name)
        .setColor('#f58a42')
        .setDescription(req.body.incident.summary)
        .setFooter(footer)
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