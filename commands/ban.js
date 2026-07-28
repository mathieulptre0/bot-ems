const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Bannit un utilisateur du serveur')
        .addUserOption(option =>
            option.setName('utilisateur')
                .setDescription('La personne à bannir')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('raison')
                .setDescription('La raison du bannissement')
                .setRequired(false)),

    async execute(interaction) {
        const requiredRoleId = '1531392863336923246';
        const botName = interaction.client.user.username;
        const botAvatar = interaction.client.user.displayAvatarURL();
        const currentDate = new Date().toLocaleDateString('fr-FR');

        if (!interaction.member.roles.cache.has(requiredRoleId)) {
            const errorEmbed = new EmbedBuilder()
                .setDescription("## ⛔ __Permission refusée__\n\nVous n'avez pas la **permission** d'utiliser cette commande car il vous **manque le rôle requis**.")
                .setColor(0xFF0000)
                .setFooter({ text: `${botName} — ${currentDate}`, iconURL: botAvatar });

            return await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }

        const targetUser = interaction.options.getUser('utilisateur');
        const reason = interaction.options.getString('raison') || 'Aucune raison spécifiée.';
        const targetMember = await interaction.guild.members.fetch(targetUser.id).catch(() => null);

        if (!targetMember) {
            const notFoundEmbed = new EmbedBuilder()
                .setDescription('## ⛔ __Erreur__\n\nImpossible de trouver cet utilisateur sur le serveur.')
                .setColor(0xFF0000)
                .setFooter({ text: `${botName} — ${currentDate}`, iconURL: botAvatar });

            return await interaction.reply({ embeds: [notFoundEmbed], ephemeral: true });
        }

        if (!targetMember.bannable) {
            const unbannableEmbed = new EmbedBuilder()
                .setDescription('## ⛔ __Erreur__\n\nJe ne peux pas bannir cet utilisateur (son rôle est supérieur ou égal au mien).')
                .setColor(0xFF0000)
                .setFooter({ text: `${botName} — ${currentDate}`, iconURL: botAvatar });

            return await interaction.reply({ embeds: [unbannableEmbed], ephemeral: true });
        }

        const dmEmbed = new EmbedBuilder()
            .setTitle('⚠️ __Vous avez été banni__')
            .setDescription(`Vous avez été banni du serveur **${interaction.guild.name}**.\n\n**Raison :** ${reason}`)
            .setColor(0xFF0000)
            .setFooter({ text: `${botName} — ${currentDate}`, iconURL: botAvatar });

        await targetUser.send({ embeds: [dmEmbed] }).catch(() => {
            console.log(`Impossible d'envoyer un message privé à ${targetUser.tag}.`);
        });

        try {
            await interaction.guild.members.ban(targetUser.id, { reason: reason });
        } catch (error) {
            console.error(error);
            const banErrorEmbed = new EmbedBuilder()
                .setDescription('## ⛔ __Erreur__\n\nUne erreur est survenue lors du bannissement de cet utilisateur.')
                .setColor(0xFF0000)
                .setFooter({ text: `${botName} — ${currentDate}`, iconURL: botAvatar });

            return await interaction.reply({ embeds: [banErrorEmbed], ephemeral: true });
        }

        const successEmbed = new EmbedBuilder()
            .setDescription(`## ✅ __Bannissement réussi__\n\nL'utilisateur **${targetUser.tag}** a été **banni** avec succès.\n**Raison :** ${reason}`)
            .setColor(0x00FF00)
            .setFooter({ text: `${botName} — ${currentDate}`, iconURL: botAvatar });

        await interaction.reply({ embeds: [successEmbed], ephemeral: true });
    }
};