const { Client, GatewayIntentBits } = require('discord.js');
const cron = require('node-cron');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const CONFIG = {
    CHANNEL_ID: '1384288007430869083',
    ROLE_ID: '1384649036145098843',
    TIMEZONE: 'America/Sao_Paulo'
};

client.once('ready', () => {
    console.log(`✅ Bot online como ${client.user.tag}!`);
    console.log(`📅 Agendamentos configurados:`);
    console.log(`   🟢 13:00 - Loja Aberta`);
    console.log(`   🔴 23:00 - Loja Fechada`);
});

async function enviarAviso(tipo) {
    try {
        const canal = await client.channels.fetch(CONFIG.CHANNEL_ID);
        
        let mensagem;
        if (tipo === 'aberta') {
            mensagem = `# 🟢 LOJA ABERTA\n<@&${CONFIG.ROLE_ID}>`;
        } else {
            mensagem = `# 🔴 LOJA FECHADA\n<@&${CONFIG.ROLE_ID}>`;
        }

        await canal.send(mensagem);
        console.log(`Aviso enviado: Loja ${tipo} - ${new Date().toLocaleString('pt-BR')}`);
        
    } catch (error) {
        console.error('Erro ao enviar mensagem:', error);
    }
}

cron.schedule('0 13 * * *', () => {
    console.log('⏰ Executando agendamento das 13:00...');
    enviarAviso('aberta');
}, { timezone: CONFIG.TIMEZONE });

cron.schedule('0 23 * * *', () => {
    console.log('⏰ Executando agendamento das 23:00...');
    enviarAviso('fechada');
}, { timezone: CONFIG.TIMEZONE });

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    
    if (message.content === '!testar-abrir') {
        if (message.member.permissions.has('Administrator')) {
            await enviarAviso('aberta');
            message.reply('✅ Teste enviado!');
        }
    }
    
    if (message.content === '!testar-fechar') {
        if (message.member.permissions.has('Administrator')) {
            await enviarAviso('fechada');
            message.reply('✅ Teste enviado!');
        }
    }
});

const token = process.env.DISCORD_TOKEN || 'SEU_TOKEN_AQUI';
client.login(token);

const PORT = process.env.PORT || 3000;
const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('Bot está rodando! 🤖');
});

app.listen(PORT, () => {
    console.log(`🌐 Servidor rodando na porta ${PORT}`);
});