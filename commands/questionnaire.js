const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('questionnaire')
        .setDescription('Envoie le panneau du module de recrutement EMS'),

    async execute(interaction) {
        // Liste des rôles autorisés à exécuter la commande
        const allowedRoleIds = ['1531392863336923246', '1531693399051079700'];

        const botName = interaction.client.user.username;
        const botAvatar = interaction.client.user.displayAvatarURL();
        const currentDate = new Date().toLocaleDateString('fr-FR');

        // Vérification si l'utilisateur possède au moins l'un des rôles requis
        const hasPermission = allowedRoleIds.some(roleId => interaction.member.roles.cache.has(roleId));

        if (!hasPermission) {
            const errorEmbed = new EmbedBuilder()
                .setDescription('## ⛔ __Permission refusée__\n\nVous n\'avez pas la **permission** d\'utiliser cette commande car il vous **manque le rôle requis**.')
                .setColor(0xFF0000)
                .setFooter({ text: `${botName} — ${currentDate}`, iconURL: botAvatar });

            return await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }

        // Construction de l'embed non éphémère pour le salon avec la nouvelle description
        const embed = new EmbedBuilder()
            .setTitle('🗒️ [EMS] - Session de Recrutement')
            .setDescription(
                'Bienvenue dans le **module de recrutement** du **Emergency Medical Services (EMS)**.\n\n' +
                'Une **nouvelle session d\'évaluation** est sur le point d\'être **initiée**. En tant que recruteur, veuillez suivre **attentivement** les réponses du candidat pour **analyser ses compétences** et **décider de son intégration** au sein de notre **équipe médicale**.'
            )
            .setColor(0x0074FF)
            .setFooter({ text: `${botName} — ${currentDate}`, iconURL: botAvatar });

        // Bouton vert "Commencer le questionnaire"
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('start_questionnaire')
                    .setLabel('Commencer le questionnaire')
                    .setStyle(ButtonStyle.Success)
                    .setEmoji('🩺'),
            );

        // Envoi de l'embed dans le salon où la commande a été exécutée
        await interaction.channel.send({ embeds: [embed], components: [row] });

        // Embed de confirmation éphémère
        const successEmbed = new EmbedBuilder()
            .setDescription(`## ✅ __Succès de l'envoi__\n\nLe **panneau de questionnaire** a été **envoyé avec succès** dans ce salon !`)
            .setColor(0x00FF00)
            .setFooter({ text: `${botName} — ${currentDate}`, iconURL: botAvatar });

        await interaction.reply({ embeds: [successEmbed], ephemeral: true });
    },

    async handleInteraction(interaction) {
        if (!interaction.isButton()) return;

        if (interaction.customId === 'start_questionnaire') {
            // Logique future pour lancer le questionnaire (modals, questions en DM, etc.)
            await interaction.reply({
                content: 'Le questionnaire va bientôt commencer ! (Logique à implémenter selon tes étapes)',
                ephemeral: true
            });
        }
    }
};