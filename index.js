require('dotenv')
const express = require('express')
const discord = require('discord.js')
const bodyParser = require('body-parser')

const app = express()
const port = 6969

const webhookClient = new discord.WebhookClient({
    url: process.env.DISCORD_WEBHOOK_URL
})

app.use(bodyParser.json())

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})

app.post('/', (req, res, next) => {
    if (!req.body.hasOwnProperty('incident')) return // This isn't a suitable Google webhook.
    console.dir(req.body, { depth: null })

    let text = '';
    const severity = req.body.incident.severity.toLowerCase();

    if (severity === 'error') {
        text += ':red_circle: '
    } else {
        text += ':yellow_circle: '
    }

    let summary = req.body.incident.summary.replaceAll('\n', ' ')

    text += `**[${req.body.incident.policy_name}](${req.body.incident.url})** (${req.body.incident.condition_name}): ${summary}`;

    webhookClient.send({
        username: 'Google Cloud',
        content: text
    })

    console.log('Received incident. Sending to Discord.')
    res.send(req.body)
})

module.exports = {
    app
}
