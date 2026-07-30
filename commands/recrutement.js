const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('recrutement')
        .setDescription('Planifie un rendez-vous de recrutement avec un candidat')
        .addUserOption(option =>
            option.setName('candidat')
                .setDescription('Le candidat concerné par le rendez-vous')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('jour')
                .setDescription('Le jour du mois (ex: 28)')
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(31))
        .addIntegerOption(option =>
            option.setName('mois')
                .setDescription('Le mois (1 pour Janvier, 12 pour Décembre)')
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(12))
        .addIntegerOption(option =>
            option.setName('annee')
                .setDescription('L\'année (ex: 2026)')
                .setRequired(true)
                .setMinValue(2026))
        .addIntegerOption(option =>
            option.setName('heure')
                .setDescription('L\'heure au format 24h (ex: 18 pour 18h)')
                .setRequired(true)
                .setMinValue(0)
                .setMaxValue(23))
        .addIntegerOption(option =>
            option.setName('minutes')
                .setDescription('Les minutes (ex: 0 ou 30)')
                .setRequired(true)
                .setMinValue(0)
                .setMaxValue(59)),

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

            return await interaction.reply({ embeds: [errorEmbed], flags: MessageFlags.Ephemeral });
        }

        // On diffère la réponse immédiatement pour éviter l'expiration
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        const targetUser = interaction.options.getUser('candidat');
        const jour = interaction.options.getInteger('jour');
        const mois = interaction.options.getInteger('mois');
        const annee = interaction.options.getInteger('annee');
        const heure = interaction.options.getInteger('heure');
        const minutes = interaction.options.getInteger('minutes');
        const recruiter = interaction.user;

        const dateObj = new Date(annee, mois - 1, jour, heure, minutes);
        const timestamp = Math.floor(dateObj.getTime() / 1000);
        const dateFormatee = `<t:${timestamp}:F>`;

        // Embed pour le message PRIVÉ (sans l'avertissement DM)
        const dmEmbed = new EmbedBuilder()
            .setTitle('## 🏥 [EMS] - Confirmation de Rendez-vous')
            .setDescription(
                '**Planification de l\'Entretien**\n\n' +
                'Votre rendez-vous de recrutement à l\'hôpital a bien été enregistré ! \n\n' +
                `- **Candidat :** <@${targetUser.id}>\n` +
                `- **Date et Heure :** ${dateFormatee}\n` +
                `- **Recruteur :** <@${recruiter.id}>`
            )
            .setColor(0x0074FF)
            .setFooter({ text: `${botName} — ${currentDate}`, iconURL: botAvatar });

        // Embed pour le salon PUBLIC (avec l'avertissement DM)
        const publicEmbed = new EmbedBuilder()
            .setTitle('## 🏥 [EMS] - Confirmation de Rendez-vous')
            .setDescription(
                '**Planification de l\'Entretien**\n\n' +
                'Votre rendez-vous de recrutement à l\'hôpital a bien été enregistré ! \n\n' +
                `- **Candidat :** <@${targetUser.id}>\n` +
                `- **Date et Heure :** ${dateFormatee}\n` +
                `- **Recruteur :** <@${recruiter.id}>\n\n` +
                '⚠️ Une confirmation détaillée vous a été envoyée par message privé (DM). Veuillez la conserver précieusement !'
            )
            .setColor(0x0074FF)
            .setFooter({ text: `${botName} — ${currentDate}`, iconURL: botAvatar });

        // Envoi du message privé au candidat
        try {
            await targetUser.send({ embeds: [dmEmbed] });
        } catch (error) {
            console.error("Impossible d'envoyer le message privé au candidat :", error);
        }

        // Envoi de l'embed dans le salon public
        await interaction.channel.send({ embeds: [publicEmbed] });

        // Confirmation finale éphémère pour l'exécutant
        const successEmbed = new EmbedBuilder()
            .setDescription(`## ✅ __Succès de l'envoi__\n\nLe **rendez-vous de recrutement** a été **planifié et publié avec succès** !`)
            .setColor(0x00FF00)
            .setFooter({ text: `${botName} — ${currentDate}`, iconURL: botAvatar });

        await interaction.editReply({ embeds: [successEmbed] });
    }
};