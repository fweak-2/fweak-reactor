const { Plugin } = require('powercord/entities');
const { getModule } = require('powercord/webpack');

const Settings = require('./Settings.jsx');
const Emojis = require('./data/emoji_dictionary.js');
const emoji_dictionary = require('./data/emoji_dictionary.js');

module.exports = class FweakReact extends Plugin {
    constructor() {
        super();
        this.reactions = new Array();
        this.messages = new Array();
        this.interval = 1500;
    }
    async startPlugin() {
        powercord.api.settings.registerSettings('reactor', {
            category: this.entityID,
            label: 'Fweak React',
            render: Settings
        });
        powercord.api.commands.registerCommand({
            command: 'react',
            aliases: ['fweak-reactor', 'text-react'],
            description: 'Reacts with any text given!',
            usage: '{c} <text>',
            category: 'fun',
            executor: await this.commandExec.bind(this)
        });
    }

    async commandExec(words) {
        this.reactions = new Array();
        this.messages = new Array();
        this.interval = this.settings.get('intervalTime') || 1500;

        const channelId = getModule(['getLastSelectedChannelId'], false).getChannelId();
        const messages = getModule(['getMessages'], false).getMessages(channelId);

        for (const character of words.join(' ')) {
            const char = character.toLowerCase();
            let emote = emoji_dictionary[char][0];
            if (!emote) {
                console.warn(`[FweakReact] Couldn\'t find more emotes for: ${char}`);
                continue;
            }
            if (this.reactions.includes(emote)) {
                console.info(`[FweakReact] Looking for another type for: ${char}`)
                emote = await this.checkForDup(char, 0, this.reactions);
            }
            this.reactions.push(emote);
            await new Promise((res) => setTimeout(res, parseInt(this.interval)));
            await this.react(channelId, messages._array[messages._array.length - 1].id, emote);
        }
    }

    async react(id, message_id, emote) {
        await getModule(['addReaction'], false).addReaction(id, message_id, { name: emote });
        return;
    }
    
    async checkForDup(char, count, reactions) {
        let emote = Emojis[char][count];
        if (!reactions.includes(emote)) return emote;
        count++;
        return await this.checkForDup(char, count, reactions);
    }

    pluginWillUnload() {
        powercord.api.commands.unregisterCommand('reactor');
        powercord.api.settings.unregisterSettings('reactor');
    }
}

// require ('powercord/webpack').getModule(['addReaction'], false).addReaction('746054226970542091', '757317218148024351', { name: '🎉'} )