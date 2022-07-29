const { MessageAttachment } = require('discord.js');
const { request } = require('undici');
const { readFile } = require('fs/promises');
const Canvas = require('@napi-rs/canvas');

const applyText = (canvas, text, size) => {
    const context = canvas.getContext('2d');

    let fontSize = size;
    do {
        context.font = `${fontSize -= 10}px Arial`;
    } while (context.measureText(text).width > canvas.width - 300);

    return context.font;
};

const welcome = async(member) => {
    const canvas = Canvas.createCanvas(1200, 445);
    const context = canvas.getContext('2d');

    const backgroundFile = await readFile('./assets/cosana.png');
    const background = new Canvas.Image();
    background.src = backgroundFile;
    context.drawImage(background, 0, 0, canvas.width, canvas.height);

    context.strokeStyle = 'grey';
    context.strokeRect(0, 0, canvas.width, canvas.height);

    context.font = applyText(canvas, member.user.tag, 50);
    context.fillStyle = 'grey';
    context.fillText(member.user.tag, canvas.width / 2 - (context.measureText(`${member.user.tag}`).width / 2), canvas.height - 40);

    context.font = applyText(canvas, "WELCOME", 70);
    context.fillStyle = 'white';
    context.fillText("BENVENUTO", canvas.width / 2 - (context.measureText("WELCOME").width / 2), canvas.height - 100);

    context.font = applyText(canvas, `You are the ${member.guild.memberCount}th member`, 40);
    context.fillStyle = 'grey';
    context.fillText(`You are thr ${member.guild.memberCount}th member`, canvas.width / 2 - (context.measureText(`You are the${member.guild.memberCount}th member`).width / 2), canvas.height - 10);

    context.beginPath();
    context.arc(600, 167, 119, 0, Math.PI * 2, true);
    context.closePath();
    context.clip();

    const { body } = await request(member.user.displayAvatarURL({ format: 'png', size: 1024, dynamic: false }));
    const avatar = new Canvas.Image();
    avatar.src = Buffer.from(await body.arrayBuffer());
    context.drawImage(avatar, 480, 49, 238, 238);

    const attachement = new MessageAttachment(canvas.toBuffer('image/png'), 'benvenuto.png');
    const channel = member.guild.channels.cache.find(ch => ch.name == 'bienvenue');
    channel.send({ files: [attachement] });
    console.log(`${member.user.tag} just join !`);
}

module.exports.welcome = welcome;