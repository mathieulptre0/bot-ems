const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('trello')
        .setDescription('Affiche le panneau officiel du Trello EMS'),

    async execute(interaction) {
        const requiredRoleId = '1531392863336923246';
        const targetChannelId = '1531739483156775125';
        const trelloUrl = 'https://trello.com/invite/b/6a67a272c947cb03d70befa3/ATTI2c1987e96eab1c286ff40c62fc02b90d92402B83/ems-french-plug';

        const botName = interaction.client.user.username;
        const botAvatar = interaction.client.user.displayAvatarURL();
        const currentDate = new Date().toLocaleDateString('fr-FR');

        // Vérification du rôle requis
        if (!interaction.member.roles.cache.has(requiredRoleId)) {
            const errorEmbed = new EmbedBuilder()
                .setDescription('## ⛔ __Permission refusée__\n\nVous n\'avez pas la **permission** d\'utiliser cette commande car il vous **manque le rôle requis**.')
                .setColor(0xFF0000)
                .setFooter({ text: `${botName} — ${currentDate}`, iconURL: botAvatar });

            return await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }

        // Vérification du salon cible
        const targetChannel = interaction.guild.channels.cache.get(targetChannelId);
        
        if (!targetChannel) {
            const channelErrorEmbed = new EmbedBuilder()
                .setDescription('## ⛔ __Erreur de configuration__\n\nLe **salon de destination** est introuvable.')
                .setColor(0xFF0000)
                .setFooter({ text: `${botName} — ${currentDate}`, iconURL: botAvatar });

            return await interaction.reply({ embeds: [channelErrorEmbed], ephemeral: true });
        }

        // Création de l'embed principal non éphémère
        const embed = new EmbedBuilder()
            .setTitle('📃 **Gestion & Suivi EMS - Trello Officiel**')
            .setDescription(
                'Bienvenue dans l\'**espace opérationnel** des EMS !\n' +
                'Cet outil **Trello** est notre **système officiel** en jeu pour le suivi des **prises de service**, des **interventions** et de l\'avancement des agents.\n\n' +
                '## **__Règles d\'utilisation__ :**\n\n' +
                '*🟢 **Activité In-Game :** Cet outil doit **uniquement** être utilisé lorsque vous êtes **connecté** et **en service** sur le serveur FiveM.*\n\n' +
                '*🔒 **Sécurité & Intégrité :** Toute tentative de **piraterie**, de divulgation d\'**informations confidentielles** ou tout **abus** de cet outil sera **lourdement sanctionné** (sanction administrative en jeu et sur le Discord).*\n\n' +
                '**Accéder au lien direct du Trello en cliquant sur le bouton ci-dessous.**'
            )
            .setColor(0x0074FF)
            .setFooter({ text: `${botName} — ${currentDate}`, iconURL: botAvatar });

        // Création du bouton linkable (URL)
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setStyle(ButtonStyle.Link)
                    .setLabel('🔗')
                    .setURL(trelloUrl)
            );

        // Envoi du message dans le salon cible
        await targetChannel.send({ embeds: [embed], components: [row] });

        // Embed de confirmation éphémère pour l'exécutant
        const successEmbed = new EmbedBuilder()
            .setDescription(`## ✅ __Succès de l'envoi__\n\nLe **panneau Trello** a été **envoyé avec succès** dans le salon <#${targetChannelId}> !`)
            .setColor(0x00FF00)
            .setFooter({ text: `${botName} — ${currentDate}`, iconURL: botAvatar });

        await interaction.reply({ embeds: [successEmbed], ephemeral: true });
    }
};