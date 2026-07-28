const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle, MessageFlags } = require('discord.js');
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../../database.json');

function readDB() {
    if (!fs.existsSync(dbPath)) {
        fs.writeFileSync(dbPath, JSON.stringify({}));
    }
    try {
        const data = fs.readFileSync(dbPath, 'utf8');
        return JSON.parse(data);
    } catch (e) {
        return {};
    }
}

function writeDB(data) {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

function generateMatriculeDescription() {
    const dbData = readDB();
    const lines = [];
    
    for (let i = 1; i <= 99; i++) {
        const userId = dbData[i];
        const mention = userId ? `<@${userId}>` : '';
        lines.push(`- \`${i}\` : ${mention}`);
    }

    return ':telephone: **__LISTE MATRICULE__ :**\n\n' + lines.join('\n');
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('matricule')
        .setDescription('Affiche la liste des matricules dans le salon dédié'),

    async execute(interaction) {
        const requiredRoleId = '1531392863336923246';
        const targetChannelId = '1531701487678525630';

        const botName = interaction.client.user.username;
        const botAvatar = interaction.client.user.displayAvatarURL();
        const currentDate = new Date().toLocaleDateString('fr-FR');

        if (!interaction.member.roles.cache.has(requiredRoleId)) {
            const errorEmbed = new EmbedBuilder()
                .setDescription('## ⛔ __Permission refusée__\n\nVous n\'avez pas la **permission** d\'utiliser cette commande car il vous **manque le rôle requis**.')
                .setColor(0xFF0000)
                .setFooter({ text: `${botName} — ${currentDate}`, iconURL: botAvatar });

            return await interaction.reply({ embeds: [errorEmbed], flags: MessageFlags.Ephemeral });
        }

        const targetChannel = interaction.guild.channels.cache.get(targetChannelId);
        
        if (!targetChannel) {
            const channelErrorEmbed = new EmbedBuilder()
                .setDescription('## ⛔ __Erreur de configuration__\n\nLe **salon de destination** pour la liste des matricules est introuvable.')
                .setColor(0xFF0000)
                .setFooter({ text: `${botName} — ${currentDate}`, iconURL: botAvatar });

            return await interaction.reply({ embeds: [channelErrorEmbed], flags: MessageFlags.Ephemeral });
        }

        const embed = new EmbedBuilder()
            .setDescription(generateMatriculeDescription())
            .setColor(0x0074FF)
            .setFooter({ text: `${botName} — ${currentDate}`, iconURL: botAvatar });

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('add_matricule')
                    .setLabel('✅ Ajouter')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId('remove_matricule')
                    .setLabel('❌ Retirer')
                    .setStyle(ButtonStyle.Danger),
            );

        await targetChannel.send({ embeds: [embed], components: [row] });

        const successEmbed = new EmbedBuilder()
            .setDescription(`## ✅ __Succès de l'envoi__\n\nLe **panneau des matricules** a été **envoyé avec succès** dans le salon <#${targetChannelId}> !`)
            .setColor(0x00FF00)
            .setFooter({ text: `${botName} — ${currentDate}`, iconURL: botAvatar });

        await interaction.reply({ embeds: [successEmbed], flags: MessageFlags.Ephemeral });
    },

    async handleInteraction(interaction) {
        const requiredRoleId = '1531392863336923246';
        const botName = interaction.client.user.username;
        const botAvatar = interaction.client.user.displayAvatarURL();
        const currentDate = new Date().toLocaleDateString('fr-FR');

        // Vérification de sécurité du rôle pour les boutons et modals
        if (!interaction.member.roles.cache.has(requiredRoleId)) {
            const errorEmbed = new EmbedBuilder()
                .setDescription('## ⛔ __Permission refusée__\n\nVous n\'avez pas le rôle requis pour effectuer cette action.')
                .setColor(0xFF0000)
                .setFooter({ text: `${botName} — ${currentDate}`, iconURL: botAvatar });

            return await interaction.reply({ embeds: [errorEmbed], flags: MessageFlags.Ephemeral });
        }

        // --- GESTION DES BOUTONS ---
        if (interaction.isButton()) {
            if (interaction.customId === 'add_matricule') {
                const modal = new ModalBuilder()
                    .setCustomId('modal_add_matricule')
                    .setTitle('Ajouter un matricule');

                const matriculeInput = new TextInputBuilder()
                    .setCustomId('matricule_number')
                    .setLabel('Entrez le matricule (entre 1 et 99)')
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)
                    .setMinLength(1)
                    .setMaxLength(2);

                modal.addComponents(new ActionRowBuilder().addComponents(matriculeInput));
                return await interaction.showModal(modal);
            }

            if (interaction.customId === 'remove_matricule') {
                const modal = new ModalBuilder()
                    .setCustomId('modal_remove_matricule')
                    .setTitle('Retirer un matricule');

                const matriculeInput = new TextInputBuilder()
                    .setCustomId('matricule_number')
                    .setLabel('Entrez le matricule à vider (1 à 99)')
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)
                    .setMinLength(1)
                    .setMaxLength(2);

                modal.addComponents(new ActionRowBuilder().addComponents(matriculeInput));
                return await interaction.showModal(modal);
            }
        }

        // --- GESTION DES MODALS (FORMULAIRES) ---
        if (interaction.isModalSubmit()) {
            
            // 1. Soumission du formulaire d'ajout (✅ Ajouter)
            if (interaction.customId === 'modal_add_matricule') {
                const inputVal = interaction.fields.getTextInputValue('matricule_number');
                const numero = parseInt(inputVal, 10);

                if (isNaN(numero) || numero < 1 || numero > 99) {
                    const errorEmbed = new EmbedBuilder()
                        .setDescription('## ⛔ __Erreur de saisie__\n\nLe matricule doit obligatoirement être un nombre compris entre **1 et 99**.')
                        .setColor(0xFF0000)
                        .setFooter({ text: `${botName} — ${currentDate}`, iconURL: botAvatar });

                    return await interaction.reply({ embeds: [errorEmbed], flags: MessageFlags.Ephemeral });
                }

                const dbData = readDB();

                // Vérification si le matricule est déjà attribué
                if (dbData[numero]) {
                    const errorEmbed = new EmbedBuilder()
                        .setDescription(`## ⛔ __Erreur__\n\nLe matricule **${numero}** est **déjà attribué** à <@${dbData[numero]}>. Veuillez le retirer d'abord si vous souhaitez le réattribuer.`)
                        .setColor(0xFF0000)
                        .setFooter({ text: `${botName} — ${currentDate}`, iconURL: botAvatar });

                    return await interaction.reply({ embeds: [errorEmbed], flags: MessageFlags.Ephemeral });
                }

                const promptEmbed = new EmbedBuilder()
                    .setDescription(`Veuillez maintenant **ping la personne** associée au matricule **${numero}** dans ce salon (tapez son mention @utilisateur).`)
                    .setColor(0x0074FF)
                    .setFooter({ text: `${botName} — ${currentDate}`, iconURL: botAvatar });

                await interaction.reply({ embeds: [promptEmbed], flags: MessageFlags.Ephemeral });

                const filter = m => m.author.id === interaction.user.id && m.mentions.users.size > 0;
                const collector = interaction.channel.createMessageCollector({ filter, time: 30000, max: 1 });

                collector.on('collect', async m => {
                    const targetUser = m.mentions.users.first();
                    try { await m.delete(); } catch (e) {}

                    const currentDbData = readDB();
                    currentDbData[numero] = targetUser.id;
                    writeDB(currentDbData);

                    try {
                        const messages = await interaction.channel.messages.fetch({ limit: 15 });
                        const targetMessage = messages.find(msg => msg.embeds.length > 0 && msg.embeds[0].description?.includes('LISTE MATRICULE'));
                        
                        if (targetMessage) {
                            const updatedEmbed = EmbedBuilder.from(targetMessage.embeds[0])
                                .setDescription(generateMatriculeDescription());
                            await targetMessage.edit({ embeds: [updatedEmbed] });
                        }
                    } catch (e) {
                        console.error("Erreur mise à jour embed:", e);
                    }

                    const successEmbed = new EmbedBuilder()
                        .setDescription(`✅ Le matricule **${numero}** a bien été attribué à <@${targetUser.id}> !`)
                        .setColor(0x00FF00)
                        .setFooter({ text: `${botName} — ${currentDate}`, iconURL: botAvatar });

                    await interaction.followUp({ embeds: [successEmbed], flags: MessageFlags.Ephemeral });
                });

                collector.on('end', async (collected, reason) => {
                    if (reason === 'time') {
                        const timeEmbed = new EmbedBuilder()
                            .setDescription('⏰ Temps écoulé, vous n\'avez pas pingué de personne à temps.')
                            .setColor(0xFF0000)
                            .setFooter({ text: `${botName} — ${currentDate}`, iconURL: botAvatar });

                        await interaction.followUp({ embeds: [timeEmbed], flags: MessageFlags.Ephemeral });
                    }
                });
            }

            // 2. Soumission du formulaire de retrait (❌ Retirer)
            if (interaction.customId === 'modal_remove_matricule') {
                const inputVal = interaction.fields.getTextInputValue('matricule_number');
                const numero = parseInt(inputVal, 10);

                if (isNaN(numero) || numero < 1 || numero > 99) {
                    const errorEmbed = new EmbedBuilder()
                        .setDescription('## ⛔ __Erreur de saisie__\n\nLe matricule doit obligatoirement être un nombre compris entre **1 et 99**.')
                        .setColor(0xFF0000)
                        .setFooter({ text: `${botName} — ${currentDate}`, iconURL: botAvatar });

                    return await interaction.reply({ embeds: [errorEmbed], flags: MessageFlags.Ephemeral });
                }

                const dbData = readDB();

                // Vérification si le matricule est déjà vide
                if (!dbData[numero]) {
                    const errorEmbed = new EmbedBuilder()
                        .setDescription(`## ⛔ __Erreur__\n\nLe matricule **${numero}** n'a **aucune personne** associée à retirer.`)
                        .setColor(0xFF0000)
                        .setFooter({ text: `${botName} — ${currentDate}`, iconURL: botAvatar });

                    return await interaction.reply({ embeds: [errorEmbed], flags: MessageFlags.Ephemeral });
                }

                // Suppression de l'attribution
                delete dbData[numero];
                writeDB(dbData);

                // Mise à jour de l'embed principal
                try {
                    const messages = await interaction.channel.messages.fetch({ limit: 15 });
                    const targetMessage = messages.find(msg => msg.embeds.length > 0 && msg.embeds[0].description?.includes('LISTE MATRICULE'));
                    
                    if (targetMessage) {
                        const updatedEmbed = EmbedBuilder.from(targetMessage.embeds[0])
                            .setDescription(generateMatriculeDescription());
                        await targetMessage.edit({ embeds: [updatedEmbed] });
                    }
                } catch (e) {
                    console.error("Erreur mise à jour embed retrait:", e);
                }

                const successEmbed = new EmbedBuilder()
                    .setDescription(`✅ Le matricule **${numero}** a bien été vidé avec succès !`)
                    .setColor(0x00FF00)
                    .setFooter({ text: `${botName} — ${currentDate}`, iconURL: botAvatar });

                return await interaction.reply({ embeds: [successEmbed], flags: MessageFlags.Ephemeral });
            }
        }
    }
};