const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Exclut (kick) un utilisateur du serveur')
        .addUserOption(option =>
            option.setName('utilisateur')
                .setDescription('La personne à expulser')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('raison')
                .setDescription('La raison de l\'expulsion')
                .setRequired(false)),

    async execute(interaction) {
        const requiredRoleId = '1531392863336923246';
        const botName = interaction.client.user.username;
        const botAvatar = interaction.client.user.displayAvatarURL();
        const currentDate = new Date().toLocaleDateString('fr-FR');

        if (!interaction.member.roles.cache.has(requiredRoleId)) {
            const errorEmbed = new EmbedBuilder()
                .setDescription('## ⛔ __Permission refusée__\n\nVous n\'avez pas la **permission** d\'utiliser cette commande car il vous **manque le rôle requis**.')
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

        if (!targetMember.kickable) {
            const unkickableEmbed = new EmbedBuilder()
                .setDescription('## ⛔ __Erreur__\n\nJe ne peux pas expulser cet utilisateur (son rôle est supérieur ou égal au mien).')
                .setColor(0xFF0000)
                .setFooter({ text: `${botName} — ${currentDate}`, iconURL: botAvatar });

            return await interaction.reply({ embeds: [unkickableEmbed], ephemeral: true });
        }

        const dmEmbed = new EmbedBuilder()
            .setTitle('⚠️ __Vous avez été expulsé__')
            .setDescription(`Vous avez été expulsé (kick) du serveur **${interaction.guild.name}**.\n\n**Raison :** ${reason}`)
            .setColor(0xFF0000)
            .setFooter({ text: `${botName} — ${currentDate}`, iconURL: botAvatar });

        await targetUser.send({ embeds: [dmEmbed] }).catch(() => {

            console.log(`Impossible d'envoyer un message privé à ${targetUser.tag}.`);
        });

        try {
            await targetMember.kick(reason);
        } catch (error) {
            console.error(error);
            const kickErrorEmbed = new EmbedBuilder()
                .setDescription('## ⛔ __Erreur__\n\nUne erreur est survenue lors de l\'expulsion de cet utilisateur.')
                .setColor(0xFF0000)
                .setFooter({ text: `${botName} — ${currentDate}`, iconURL: botAvatar });

            return await interaction.reply({ embeds: [kickErrorEmbed], ephemeral: true });
        }

        const successEmbed = new EmbedBuilder()
            .setDescription(`## ✅ __Expulsion réussie__\n\nL'utilisateur **${targetUser.tag}** a été **expulsé** avec succès.\n**Raison :** ${reason}`)
            .setColor(0x00FF00)
            .setFooter({ text: `${botName} — ${currentDate}`, iconURL: botAvatar });

        await interaction.reply({ embeds: [successEmbed], ephemeral: true });
    }
};