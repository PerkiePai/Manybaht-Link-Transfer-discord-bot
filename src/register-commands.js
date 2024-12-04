require('dotenv').config();
const {REST,Routes, Application, ApplicationCommand, ApplicationCommandOptionBase, ApplicationCommandOptionType} = require('discord.js');

const commands = [
    {
        name: 'help',
        description: 'show all commands',
    },
    {
        name: 'pai',
        description: 'Encode link to Manybaht!',
        options: [
            {
                name: 'query',
                description: 'input youtube link!',
                type: ApplicationCommandOptionType.String,
                required: true,
            }
        ]
    },
];

const rest = new REST({version:'10'}).setToken(process.env.TOKEN);

(async ()=>{
    try {
        console.log('Register slash commands...');

        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            {body: commands},
        )

        console.log('Slash command register successfully!');
    } catch (error) {
        console.log(`error: ${error}`)
    }
})();

