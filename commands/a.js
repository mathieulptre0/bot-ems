const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageFlags } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('a')
        .setDescription('Affiche le panneau de planification des absences de l\'EMS'),

    async execute(interaction) {
        const requiredRoleId = '1531392863336923246'; // Même rôle requis que pour les matricules (tu peux le modifier si besoin)
        const targetChannelId = '1531382698189393970';

        const botName = interaction.client.user.username;
        const botAvatar = interaction.client.user.displayAvatarURL();
        const currentDate = new Date().toLocaleDateString('fr-FR');

        // Vérification des permissions
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
                .setDescription('## ⛔ __Erreur de configuration__\n\nLe **salon de destination** pour le planning est introuvable.')
                .setColor(0xFF0000)
                .setFooter({ text: `${botName} — ${currentDate}`, iconURL: botAvatar });

            return await interaction.reply({ embeds: [channelErrorEmbed], flags: MessageFlags.Ephemeral });
        }

        // Création de l'embed demandé
        const embed = new EmbedBuilder()
            .setTitle('Planning personnel des agents')
            .setDescription('Bienvenue dans le salon de planification des absences du **Emergency Medical Services (EMS)**.\nAfin de garantir une **organisation optimale** des effectifs et d\'assurer une **couverture médicale constante** à New York, tout agent prévoyant une absence doit impérativement déclarer sa **période d\'indisponibilité** via ce système.')
            .setColor(0x0074FF)
            .setFooter({ text: `${botName} — ${currentDate}`, iconURL: botAvatar });

        // Ajout de boutons interactifs (similaire à ton système de matricules)
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('add_absence')
                    .setLabel('📅 Déclarer une absence')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId('view_absences')
                    .setLabel('📋 Voir les absences')
                    .setStyle(ButtonStyle.Primary),
            );

        try {
            // Vérifie si un message du bot existe déjà dans le salon pour le mettre à jour (évite les doublons)
            const messages = await targetChannel.messages.fetch({ limit: 20 });
            const existingMessage = messages.find(msg => 
                msg.author.id === interaction.client.user.id && 
                msg.embeds.length > 0 && 
                msg.embeds[0].title === 'Planning personnel des agents'
            );

            if (existingMessage) {
                await existingMessage.edit({ embeds: [embed], components: [row] });
                
                const updateEmbed = new EmbedBuilder()
                    .setDescription(`## ✅ __Mise à jour réussie__\n\nLe **panneau du planning** a été mis à jour dans <#${targetChannelId}> !`)
                    .setColor(0x00FF00)
                    .setFooter({ text: `${botName} — ${currentDate}`, iconURL: botAvatar });

                return await interaction.reply({ embeds: [updateEmbed], flags: MessageFlags.Ephemeral });
            }
        } catch (e) {
            console.error("Erreur lors de la recherche du message existant pour /a :", e);
        }

        // Si aucun message n'existe, on l'envoie
        await targetChannel.send({ embeds: [embed], components: [row] });

        const successEmbed = new EmbedBuilder()
            .setDescription(`## ✅ __Succès de l'envoi__\n\nLe **panneau de planification** a été **envoyé avec succès** dans le salon <#${targetChannelId}> !`)
            .setColor(0x00FF00)
            .setFooter({ text: `${botName} — ${currentDate}`, iconURL: botAvatar });

        await interaction.reply({ embeds: [successEmbed], flags: MessageFlags.Ephemeral });
    },

    // Gestion des interactions (clics sur les boutons du panneau)
    async handleInteraction(interaction) {
        const botName = interaction.client.user.username;
        const botAvatar = interaction.client.user.displayAvatarURL();
        const currentDate = new Date().toLocaleDateString('fr-FR');

        if (interaction.isButton()) {
            if (interaction.customId === 'add_absence') {
                return await interaction.reply({ 
                    content: '🛠️ Le système de déclaration d\'absence via modal/formulaire sera bientôt disponible ici !', 
                    flags: MessageFlags.Ephemeral 
                });
            }

            if (interaction.customId === 'view_absences') {
                return await interaction.reply({ 
                    content: '📋 Aucune absence enregistrée pour le moment.', 
                    flags: MessageFlags.Ephemeral 
                });
            }
        }
    }
};