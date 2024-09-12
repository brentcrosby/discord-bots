(async () => {
	const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
	require('dotenv').config();
	const loadCommands = require('./loaders/loadCommands');
	const loadEvents = require('./loaders/loadEvents');
	const { Player } = require('discord-player');
	const { YoutubeiExtractor } = require('discord-player-youtubei');

	const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates] });
	const token = process.env.TOKEN;

	client.commands = new Collection();

	// Load commands and events
	loadCommands(client);
	loadEvents(client);

	// Setup player
	const player = new Player(client);

	// Setup extractors
	await player.extractors.register(YoutubeiExtractor, {
		streamOptions: {
			useClient: "ANDROID",
		},
	});

	await player.extractors.loadDefault(
		(ext) => !["YouTubeExtractor"].includes(ext)
	);

	await client.login(token);

// prevent crash on unhandled promise rejection
process.on("unhandledRejection", (reason) => console.error(reason));
// prevent crash on uncaught exception
process.on("uncaughtException", (error) => console.error(error));
// log warning
process.on("warning", (warning) => console.error(warning));

})();