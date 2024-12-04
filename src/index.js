require('dotenv').config();
const { Buffer } = require("buffer");
const bigInt = require("big-integer");
//run using nodemon

const {Client,IntentsBitField, InteractionCollector} = require('discord.js')

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ],
});

client.on('ready',(c)=>{
    console.log(`${c.user.tag} if online.`)
});

client.on('messageCreate',(message)=>{
    console.log(message.content);
    if (message.author.bot){
        return;
    }
    if (message.content==='hello') {
        message.reply('hello');
    }
});

//Encoder func by NuttoFreshy with his CHATGPT
function encodeYouTubeLink(youtubeLink) {
    // RSA public key components
    const RSA_PUBLIC_EXPONENT = bigInt("65537");
    const RSA_MODULUS = bigInt("226601904275238710090801857");

    // Helper function for RSA encryption
    function rsaEncrypt(input, exponent, modulus) {
        const textEncoder = new TextEncoder();
        const bytes = Array.from(textEncoder.encode(input));
        const chunkSize = Math.floor(modulus.bitLength() / 8);
        let encryptedChunks = [];

        for (let i = 0; i < bytes.length; i += chunkSize) {
            const chunk = bigInt.fromArray(bytes.slice(i, i + chunkSize), 256);
            const encryptedChunk = chunk.modPow(exponent, modulus).toArray(256).value;
            encryptedChunks.push(...encryptedChunk);
        }

        const base64String = Buffer.from(encryptedChunks)
            .toString("base64")
            .replace(/\+/g, "-")
            .replace(/\//g, "_")
            .replace(/=+$/, "");
        return base64String;
    }

    // Function to parse and modify YouTube link
    function parseAndEncodeLink(link) {
        const url = new URL(link);
        const baseDomain = "https://play.laibaht.ovh/";

        // Extract the video ID and playlist ID if present
        const videoID = url.searchParams.get("v");
        const playlistID = url.searchParams.get("list");

        // Encode the parameters
        if (videoID) {
            url.searchParams.set("v", rsaEncrypt(videoID, RSA_PUBLIC_EXPONENT, RSA_MODULUS));
        }
        if (playlistID) {
            url.searchParams.set("list", rsaEncrypt(playlistID, RSA_PUBLIC_EXPONENT, RSA_MODULUS));
        }

        // Update the domain to the custom one
        url.hostname = baseDomain.replace("https://", "").replace("/", "");
        return url.toString();
    }

    // Validate the input link
    if (!youtubeLink.includes("youtube.com") && !youtubeLink.includes("youtu.be")) {
        throw new Error("Invalid YouTube link.");
    }

    // Handle short URLs (e.g., youtu.be)
    const expandedLink = youtubeLink.includes("youtu.be")
        ? youtubeLink.replace("youtu.be/", "www.youtube.com/watch?v=")
        : youtubeLink;

    return parseAndEncodeLink(expandedLink);
}

client.on('interactionCreate',(interaction)=>{
    if (!interaction.isChatInputCommand()) return;

    console.log(interaction.commandName);

    if (interaction.commandName==='help') {
        interaction.reply('(/)pai \n')
    };

    if (interaction.commandName==='pai') {
        if (!interaction.options.get('query').value.includes('www.youtube.com/watch?v=')) {
            return interaction.reply('Wrong Input!')
        }
        interaction.reply("```"+encodeYouTubeLink(interaction.options.get('query').value)+"```")
        // console.log(interaction.options.get('query').value)
        // interaction.reply('Hey!')
    };
});

client.login(process.env.TOKEN);
