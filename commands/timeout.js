const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('timeout')
        .setDescription('Applique un timeout (exclusion temporaire) à un utilisateur')
        .addUserOption(option =>
            option.setName('utilisateur')
                .setDescription('La personne à timeout')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('temps')
                .setDescription('Durée de la sanction (ex: 30s, 5m, 2h, 1j)')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('raison')
                .setDescription('La raison du timeout')
                .setRequired(false)),

    async execute(interaction) {
        const requiredRoleId = '1531392863336923246';
        const botName = interaction.client.user.username;
        const botAvatar = interaction.client.user.displayAvatarURL();
        const currentDate = new Date().toLocaleDateString('fr-FR');

        // 1. Vérification du rôle requis
        if (!interaction.member.roles.cache.has(requiredRoleId)) {
            const errorEmbed = new EmbedBuilder()
                .setDescription('## ⛔ __Permission refusée__\n\nVous n\'avez pas la **permission** d\'utiliser cette commande car il vous **manque le rôle requis**.')
                .setColor(0xFF0000)
                .setFooter({ text: `${botName} — ${currentDate}`, iconURL: botAvatar });

            return await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }

        const targetUser = interaction.options.getUser('utilisateur');
        const timeString = interaction.options.getString('temps').trim();
        const reason = interaction.options.getString('raison') || 'Aucune raison spécifiée.';
        const targetMember = await interaction.guild.members.fetch(targetUser.id).catch(() => null);

        // Vérification si le membre est sur le serveur
        if (!targetMember) {
            const notFoundEmbed = new EmbedBuilder()
                .setDescription('## ⛔ __Erreur__\n\nImpossible de trouver cet utilisateur sur le serveur.')
                .setColor(0xFF0000)
                .setFooter({ text: `${botName} — ${currentDate}`, iconURL: botAvatar });

            return await interaction.reply({ embeds: [notFoundEmbed], ephemeral: true });
        }

        // Vérification si l'utilisateur peut être modéré par le bot
        if (!targetMember.moderatable) {
            const unmoderatableEmbed = new EmbedBuilder()
                .setDescription('## ⛔ __Erreur__\n\nJe ne peux pas appliquer de timeout à cet utilisateur (son rôle est supérieur ou égal au mien).')
                .setColor(0xFF0000)
                .setFooter({ text: `${botName} — ${currentDate}`, iconURL: botAvatar });

            return await interaction.reply({ embeds: [unmoderatableEmbed], ephemeral: true });
        }

        // Analyse du format du temps saisi (ex: 30s, 15m, 2h, 1j)
        const regex = /^(\d+)([smhj])$/i;
        const match = timeString.match(regex);

        if (!match) {
            const formatErrorEmbed = new EmbedBuilder()
                .setDescription('## ⛔ __Format invalide__\n\nLe format du temps est incorrect. Utilisez un nombre suivi de :\n• **s** (secondes)\n• **m** (minutes)\n• **h** (heures)\n• **j** (jours)\n\n*Exemple : `10m`, `2h`, `1j`*')
                .setColor(0xFF0000)
                .setFooter({ text: `${botName} — ${currentDate}`, iconURL: botAvatar });

            return await interaction.reply({ embeds: `formatErrorEmbed`, ephemeral: true });
        }

        const value = parseInt(match[1], 10);
        const unit = match[2].toLowerCase();

        let durationMs = 0;
        let durationText = '';

        switch (unit) {
            case 's':
                durationMs = value * 1000;
                durationText = `${value} seconde(s)`;
                break;
            case 'm':
                durationMs = value * 60 * 1000;
                durationText = `${value} minute(s)`;
                break;
            case 'h':
                durationMs = value * 60 * 60 * 1000;
                durationText = `${value} heure(s)`;
                break;
            case 'j':
                durationMs = value * 24 * 60 * 60 * 1000;
                durationText = `${value} jour(s)`;
                break;
        }

        if (isNaN(durationMs) || durationMs <= 0) {
            const invalidDurationEmbed = new EmbedBuilder()
                .setDescription('## ⛔ __Erreur__\n\nLa durée spécifiée est invalide.')
                .setColor(0xFF0000)
                .setFooter({ text: `${botName} — ${currentDate}`, iconURL: botAvatar });

            return await interaction.reply({ embeds: [invalidDurationEmbed], ephemeral: true });
        }

        // Limitation stricte à 27 jours maximum pour éviter les bugs d'arrondi de l'API Discord (limite max réelle : 28 jours)
        const maxTimeoutMs = 27 * 24 * 60 * 60 * 1000;
        if (durationMs > maxTimeoutMs) {
            const limitErrorEmbed = new EmbedBuilder()
                .setDescription('## ⛔ __Erreur de durée__\n\nLe timeout ne peut pas dépasser **27 jours** pour des raisons techniques de sécurité.')
                .setColor(0xFF0000)
                .setFooter({ text: `${botName} — ${currentDate}`, iconURL: botAvatar });

            return await interaction.reply({ embeds: [limitErrorEmbed], ephemeral: true });
        }

        // 2. Envoi du message privé en rouge à la personne ciblée
        const dmEmbed = new EmbedBuilder()
            .setTitle('⚠️ __Vous avez reçu un timeout__')
            .setDescription(`Vous avez été réduit au silence (timeout) sur le serveur **${interaction.guild.name}** pour une durée de **${durationText}**.\n\n**Raison :** ${reason}`)
            .setColor(0xFF0000)
            .setFooter({ text: `${botName} — ${currentDate}`, iconURL: botAvatar });

        await targetUser.send({ embeds: [dmEmbed] }).catch(() => {
            console.log(`Impossible d'envoyer un message privé à ${targetUser.tag}.`);
        });

        // 3. Application du timeout sur le serveur en utilisant l'objet de configuration direct
        try {
            await targetMember.edit({
                communicationDisabledUntil: Date.now() + durationMs,
                reason: reason
            });
        } catch (error) {
            console.error(error);
            const timeoutErrorEmbed = new EmbedBuilder()
                .setDescription('## ⛔ __Erreur__\n\nUne erreur est survenue lors de l\'application du timeout à cet utilisateur.')
                .setColor(0xFF0000)
                .setFooter({ text: `${botName} — ${currentDate}`, iconURL: botAvatar });

            return await interaction.reply({ embeds: [timeoutErrorEmbed], ephemeral: true });
        }

        // 4. Réponse de confirmation en embed éphémère vert
        const successEmbed = new EmbedBuilder()
            .setDescription(`## ✅ __Timeout réussi__\n\nL'utilisateur **${targetUser.tag}** a reçu un timeout de **${durationText}** avec succès.\n**Raison :** ${reason}`)
            .setColor(0x00FF00)
            .setFooter({ text: `${botName} — ${currentDate}`, iconURL: botAvatar });

        await interaction.reply({ embeds: [successEmbed], ephemeral: true });
    }
};