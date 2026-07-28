const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Mini-serveur web pour empêcher Render de mettre le bot en veille (via UptimeRobot)
app.get('/', (req, res) => {
  res.send('Le bot Discord est bien en ligne !');
});

app.listen(port, () => {
  console.log(`Serveur web prêt sur le port ${port}`);
});

// --- Code de ton bot Discord ---

const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
require('dotenv').config();

// Initialisation du client avec les intents nécessaires (dont GuildMessages et MessageContent pour le ping)
const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ] 
});

// Collection pour stocker les commandes du bot
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

client.once('ready', () => {
    console.log(`Connecté en tant que ${client.user.tag} !`);
});

// Attribution automatique du rôle lors de l'arrivée d'un nouveau membre
client.on('guildMemberAdd', async member => {
    const roleIdToAdd = '1531393923031761137';

    try {
        await member.roles.add(roleIdToAdd);
        console.log(`Le rôle a été attribué avec succès à ${member.user.tag}`);
    } catch (error) {
        console.error(`Erreur lors de l'attribution automatique du rôle au nouveau membre ${member.user.tag} :`, error);
    }
});

// --- Gestion de la suppression automatique des messages (Forum Dossier) ---
client.on('messageCreate', async (message) => {
    const dossierCommand = client.commands.get('dossier');
    if (dossierCommand && typeof dossierCommand.handleMessage === 'function') {
        await dossierCommand.handleMessage(message);
    }
});

client.on('interactionCreate', async interaction => {
    // 1. Gestion des commandes slash
    if (interaction.isChatInputCommand()) {
        const command = client.commands.get(interaction.commandName);
        if (!command) return;

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'Une erreur est survenue lors de l\'exécution de cette commande !', ephemeral: true });
        }
    }

    // 2. Gestion des boutons
    else if (interaction.isButton()) {
        let commandName = 'ticket'; // Par défaut pour les tickets
        
        if (interaction.customId === 'create_dossier') {
            commandName = 'dossier';
        } else if (interaction.customId === 'add_matricule' || interaction.customId === 'remove_matricule') {
            commandName = 'matricule';
        }

        const command = client.commands.get(commandName);
        if (command && command.handleInteraction) {
            try {
                await command.handleInteraction(interaction);
            } catch (error) {
                console.error(error);
            }
        }
    }

    // 3. Gestion de la soumission des formulaires (Modals)
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