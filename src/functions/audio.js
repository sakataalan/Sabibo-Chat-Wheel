const voiceDiscord = require("@discordjs/voice");

module.exports = {
    playAudio(audio, msg, channel){
        const player = voiceDiscord.createAudioPlayer();
        const resource = voiceDiscord.createAudioResource(`../assets/audio/${audio}.mp3`);
    
        const connection = voiceDiscord.joinVoiceChannel({
            channelId: channel.id,
            guildId: msg.guild.id,
            adapterCreator: msg.guild.voiceAdapterCreator,
        });
    
        player.play(resource);
        connection.subscribe(player);
    
        player.on(voiceDiscord.AudioPlayerStatus.Idle, () => {
            connection.destroy();
        })
    }
}