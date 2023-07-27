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

    let embed = new discord.MessageEmbed()
            .setTitle(req.body.incident.policy_name)
            .setColor('#F58A42')
            .setURL(req.body.incident.url)
            .setTimestamp(new Date(req.body.incident.started_at * 1000))

    let resource = req.body.incident.resource_type_display_name
    if ( req.body.incident.resource.type == 'cloudsql_database' ) {
        resource += ' • ' + req.body.incident.resource_display_name
    } else if ( req.body.incident.resource.type == 'k8s_container' ) {
        resource += ' • ' + req.body.incident.resource.labels.cluster_name + '/' + req.body.incident.resource.labels.container_name
    }

    if ( req.body.incident.hasOwnProperty('metric') ) {
        if ( req.body.incident.metric.labels.hasOwnProperty('environment') ) {
            embed.addField('Environment', req.body.incident.metric.labels.environment)
        } else {
            embed.addField('Resource', resource)
        }
        embed.addFields([
            { name: 'Error', value: req.body.incident.condition_name },
            { name: 'Threshold', value: req.body.incident.threshold_value },
            { name: 'Value', value: req.body.incident.observed_value },
        ])
    } else {
        embed.setDescription(req.body.incident.summary)
             .setFooter(resource)
    }
    
    webhookClient.send({
        username: 'Google Cloud',
        embeds: [embed]
    })

    console.log('Received incident. Sending to Discord.')
    res.send(req.body)
})

module.exports = {
    app
}
