const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('recrutement')
        .setDescription('Planifie un rendez-vous de recrutement avec un candidat')
        .addUserOption(option =>
            option.setName('candidat')
                .setDescription('Le candidat concerné par le rendez-vous')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('date_heure')
                .setDescription('La date et l\'heure du rendez-vous (ex: Samedi 8 août à 15h00)')
                .setRequired(true)),

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

        const targetUser = interaction.options.getUser('candidat');
        const dateHeure = interaction.options.getString('date_heure');
        const recruiter = interaction.user;

        const embed = new EmbedBuilder()
            .setTitle('## 🏥 [EMS] - Confirmation de Rendez-vous')
            .setDescription(
                '**Planification de l\'Entretien**\n\n' +
                'Votre rendez-vous de recrutement à l\'hôpital a bien été enregistré ! \n\n' +
                `- **Candidat :** <@${targetUser.id}>\n` +
                `- **Date et Heure :** ${dateHeure}\n` +
                `- **Recruteur :** <@${recruiter.id}>\n\n` +
                '⚠️ Une confirmation détaillée vous a été envoyée par message privé (DM). Veuillez la conserver précieusement !'
            )
            .setColor(0x0074FF)
            .setFooter({ text: `${botName} — ${currentDate}`, iconURL: botAvatar });

        try {
            await targetUser.send({ embeds: [embed] });
        } catch (error) {
            console.error("Impossible d'envoyer le message privé au candidat :", error);
            const dmErrorEmbed = new EmbedBuilder()
                .setDescription('## ⚠️ __Attention__\n\nLe rendez-vous a bien été planifié dans le salon, mais il a été **impossible d\'envoyer le message privé (DM)** au candidat (ses messages privés sont sûrement fermés).')
                .setColor(0xFFA500)
                .setFooter({ text: `${botName} — ${currentDate}`, iconURL: botAvatar });

            await interaction.reply({ embeds: [embed], ephemeral: false });
            return await interaction.followUp({ embeds: [dmErrorEmbed], ephemeral: true });
        }

        await interaction.reply({ embeds: [embed], ephemeral: false });
    }
};