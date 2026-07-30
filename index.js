const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Le bot Discord est bien en ligne !');
});

app.listen(port, () => {
  console.log(`Serveur web prêt sur le port ${port}`);
});

const { Client, GatewayIntentBits, Collection, MessageFlags } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
require('dotenv').config();

const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ] 
});

client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(foldersPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(foldersPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
    }
}

client.once('clientReady', () => {
    console.log(`Connecté en tant que ${client.user.tag} !`);
});

client.on('guildMemberAdd', async member => {
    const roleIdToAdd = '1531393923031761137';

    try {
        await member.roles.add(roleIdToAdd);
        console.log(`Le rôle a été attribué avec succès à ${member.user.tag}`);
    } catch (error) {
        console.error(`Erreur lors de l'attribution automatique du rôle au nouveau membre ${member.user.tag} :`, error);
    }
});

client.on('messageCreate', async (message) => {
    const dossierCommand = client.commands.get('dossier');
    if (dossierCommand && typeof dossierCommand.handleMessage === 'function') {
        await dossierCommand.handleMessage(message);
    }
});

client.on('interactionCreate', async interaction => {

    if (interaction.isChatInputCommand()) {
        const command = client.commands.get(interaction.commandName);
        if (!command) return;

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            if (!interaction.replied && !interaction.deferred) {
                await interaction.reply({ content: 'Une erreur est survenue lors de l\'exécution de cette commande !', flags: [MessageFlags.Ephemeral] }).catch(() => {});
            }
        }
    }

    else if (interaction.isButton()) {
        let commandName = null;
        
        if (interaction.customId === 'create_ticket' || interaction.customId === 'close_ticket') {
            commandName = 'ticket';
        } else if (interaction.customId === 'create_dossier') {
            commandName = 'dossier';
        } else if (interaction.customId === 'add_matricule' || interaction.customId === 'remove_matricule') {
            commandName = 'matricule';
        } else if (
            interaction.customId === 'start_questionnaire' || 
            interaction.customId === 'to_culture_generale' || 
            interaction.customId === 'to_mises_en_situation' ||
            interaction.customId === 'show_results' ||
            interaction.customId.startsWith('q') || 
            interaction.customId.startsWith('cg') ||
            interaction.customId.startsWith('sit')
        ) {
            commandName = 'questionnaire'; 
        }

        if (commandName) {
            const command = client.commands.get(commandName);
            if (command && command.handleInteraction) {
                try {
                    await command.handleInteraction(interaction);
                } catch (error) {
                    console.error("Erreur lors de l'interaction bouton :", error);
                    if (!interaction.replied && !interaction.deferred) {
                        await interaction.reply({ content: 'Une erreur est survenue lors du traitement de ce bouton.', flags: [MessageFlags.Ephemeral] }).catch(() => {});
                    }
                }
            }
        }
    }

    else if (interaction.isModalSubmit()) {
        let commandName = null;

        if (interaction.customId === 'modal_dossier') {
            commandName = 'dossier';
        } else if (interaction.customId === 'modal_add_matricule' || interaction.customId === 'modal_remove_matricule') {
            commandName = 'matricule';
        }

        if (commandName) {
            const command = client.commands.get(commandName);
            if (command && command.handleInteraction) {
                try {
                    await command.handleInteraction(interaction);
                } catch (error) {
                    console.error("Erreur dans le gestionnaire de modal :", error);
                }
            }
        }
    }
});

client.login(process.env.DISCORD_TOKEN);