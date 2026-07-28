const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, ModalBuilder, TextInputBuilder, TextInputStyle, FileUploadBuilder, LabelBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dossier')
        .setDescription('Crée le post du panneau de dossier dans le forum des ressources humaines'),

    async execute(interaction) {
        const requiredRoleId = '1531392863336923246';
        const targetChannelId = '1531382781014180090';

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

        const targetChannel = interaction.guild.channels.cache.get(targetChannelId);
        
        if (!targetChannel || targetChannel.type !== ChannelType.GuildForum) {
            const channelErrorEmbed = new EmbedBuilder()
                .setDescription('## ⛔ __Erreur de configuration__\n\nLe salon cible est introuvable ou n\'est pas un salon de type **Forum**.')
                .setColor(0xFF0000)
                .setFooter({ text: `${botName} — ${currentDate}`, iconURL: botAvatar });

            return await interaction.reply({ embeds: [channelErrorEmbed], ephemeral: true });
        }

        const embed = new EmbedBuilder()
            .setDescription(
                '## 🏥 RESSOURCES HUMAINES - PÔLE MÉDICAL\n\n' +
                'Bienvenue dans l\'espace des **Ressources Humaines** des EMS. \n\n' +
                'Vous souhaitez intégrer nos équipes, poser une question concernant votre carrière ou faire une demande particulière ? Tout se passe ici.\n\n' +
                '> 1. Cliquez sur le bouton **📁 Créer un dossier** ci-dessous.\n\n' +
                '> 2. Un **formulaire interactif** va s\'ouvrir sur votre écran.\n\n' +
                '> 3. Remplissez les différents champs demandés.\n\n' +
                '> 4. Un forum de suivi sera créé.'
            )
            .setColor(0x0074FF)
            .setFooter({ text: `${botName} — ${currentDate}`, iconURL: botAvatar });

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('create_dossier')
                    .setLabel('📁 Créer un dossier')
                    .setStyle(ButtonStyle.Primary),
            );

        try {
            await targetChannel.threads.create({
                name: 'Comment créer un dossier ?',
                message: {
                    embeds: [embed],
                    components: [row]
                }
            });
        } catch (error) {
            console.error("Erreur lors de la création du post dans le forum :", error);
            const technicalErrorEmbed = new EmbedBuilder()
                .setDescription('## ⛔ __Erreur__\n\nUne erreur est survenue lors de la création du post dans le forum.')
                .setColor(0xFF0000)
                .setFooter({ text: `${botName} — ${currentDate}`, iconURL: botAvatar });

            return await interaction.reply({ embeds: [technicalErrorEmbed], ephemeral: true });
        }

        const successEmbed = new EmbedBuilder()
            .setDescription(`## ✅ __Succès de l'envoi__\n\nLe post du **panneau de dossiers** a été **créé avec succès** dans le forum <#${targetChannelId}> !`)
            .setColor(0x00FF00)
            .setFooter({ text: `${botName} — ${currentDate}`, iconURL: botAvatar });

        await interaction.reply({ embeds: [successEmbed], ephemeral: true });
    },

    async handleInteraction(interaction) {
        if (!interaction.isButton() && !interaction.isModalSubmit()) return;

        const botName = interaction.client.user.username;
        const botAvatar = interaction.client.user.displayAvatarURL();
        const currentDate = new Date().toLocaleDateString('fr-FR');
        const targetChannelId = '1531382781014180090';

        const allowedRoleIds = ['1531693399051079700', '1531392863336923246'];

        if (interaction.isButton() && interaction.customId === 'create_dossier') {
            const hasRequiredRole = allowedRoleIds.some(roleId => interaction.member.roles.cache.has(roleId));

            if (!hasRequiredRole) {
                const errorEmbed = new EmbedBuilder()
                    .setDescription('## ⛔ __Permission refusée__\n\nVous n\'avez pas la **permission** de cliquer sur ce bouton car il vous **manque le rôle requis**.')
                    .setColor(0xFF0000)
                    .setFooter({ text: `${botName} — ${currentDate}`, iconURL: botAvatar });

                return await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            }

            const modal = new ModalBuilder()
                .setCustomId('modal_dossier')
                .setTitle('Formulaire - Création de dossier');

            const matriculeInput = new TextInputBuilder()
                .setCustomId('dossier_matricule')
                .setLabel('MATRICULE | Nom Prénom')
                .setStyle(TextInputStyle.Short)
                .setPlaceholder('Ex: 1234 | Dr John Doe')
                .setRequired(true);

            const naissanceInput = new TextInputBuilder()
                .setCustomId('dossier_naissance')
                .setLabel('Date de Naissance')
                .setStyle(TextInputStyle.Short)
                .setPlaceholder('Ex: 15/06/1998')
                .setRequired(true);

            const telephoneInput = new TextInputBuilder()
                .setCustomId('dossier_telephone')
                .setLabel('Numéro de Téléphone')
                .setStyle(TextInputStyle.Short)
                .setPlaceholder('Ex: 555-0199')
                .setRequired(true);

            const sexeSelect = new StringSelectMenuBuilder()
                .setCustomId('dossier_sexe')
                .setPlaceholder('Sélectionnez le sexe')
                .setRequired(true)
                .addOptions(
                    new StringSelectMenuOptionBuilder()
                        .setLabel('Masculin')
                        .setValue('Masculin'),
                    new StringSelectMenuOptionBuilder()
                        .setLabel('Féminin')
                        .setValue('Féminin')
                );

            const sexeLabel = new LabelBuilder()
                .setLabel('Sexe')
                .setStringSelectMenuComponent(sexeSelect);

            const fileUploadComponent = new FileUploadBuilder()
                .setCustomId('dossier_piece_jointe')
                .setMinValues(1)
                .setMaxValues(1)
                .setRequired(true);

            const fileLabel = new LabelBuilder()
                .setLabel('Pièce jointe')
                .setFileUploadComponent(fileUploadComponent);

            modal.addComponents(
                new ActionRowBuilder().addComponents(matriculeInput),
                new ActionRowBuilder().addComponents(naissanceInput),
                new ActionRowBuilder().addComponents(telephoneInput)
            );
            modal.addLabelComponents(sexeLabel);
            modal.addLabelComponents(fileLabel);

            return await interaction.showModal(modal);
        }

        else if (interaction.isModalSubmit() && interaction.customId === 'modal_dossier') {
            const matricule = interaction.fields.getTextInputValue('dossier_matricule');
            const naissance = interaction.fields.getTextInputValue('dossier_naissance');
            const telephone = interaction.fields.getTextInputValue('dossier_telephone');
            
            let sexe = 'Non spécifié';
            try {
                const sexeValues = interaction.fields.getStringSelectValues('dossier_sexe');
                if (sexeValues && sexeValues.length > 0) sexe = sexeValues[0];
            } catch (e) {}
            
            let fileUrl = '';
            try {
                const uploadedFiles = interaction.fields.getUploadedFiles('dossier_piece_jointe');
                if (uploadedFiles && uploadedFiles.size > 0) {
                    fileUrl = uploadedFiles.first().url;
                }
            } catch (e) {}
            
            const targetChannel = interaction.guild.channels.cache.get(targetChannelId);

            if (!targetChannel || targetChannel.type !== ChannelType.GuildForum) {
                return await interaction.reply({
                    content: 'Erreur : Le salon forum des dossiers est introuvable ou mal configuré.',
                    ephemeral: true
                });
            }

            await interaction.deferReply({ ephemeral: true });

            try {
                const dossierEmbed = new EmbedBuilder()
                    .setTitle('👨‍⚕️ Nouvel agent recensé !')
                    .setDescription(
                        `## 👤 INFORMATIONS :\n\n` +
                        `- **__Matricule & Nom Prénom__ :** \`${matricule}\`\n\n` +
                        `- **__Date de Naissance__ :** \`${naissance}\`\n\n` +
                        `- **__Numéro de téléphone__ :** \`${telephone}\`\n\n` +
                        `- **__Sexe__ :** \`${sexe}\`\n\n` +
                        `- **__Carte d'identité__ :**`
                    )
                    .setColor(0x0074FF)
                    .setFooter({ text: `${botName} — ${currentDate}`, iconURL: botAvatar });

                if (fileUrl) {
                    dossierEmbed.setImage(fileUrl);
                }

                // Création du post avec application des permissions spécifiques
                const forumPost = await targetChannel.threads.create({
                    name: matricule.substring(0, 100),
                    message: {
                        embeds: [dossierEmbed]
                    },
                    permissionOverwrites: [
                        {
                            id: interaction.guild.id, // @everyone
                            deny: [PermissionFlagsBits.ViewChannel],
                        },
                        {
                            id: '1531400982817280020', // Rôle qui peut seulement voir
                            allow: [PermissionFlagsBits.ViewChannel],
                            deny: [PermissionFlagsBits.SendMessages],
                        },
                        {
                            id: '1531392863336923246', // Rôle 1 (accès complet)
                            allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
                        },
                        {
                            id: '1531693399051079700', // Rôle 2 (accès complet)
                            allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
                        }
                    ]
                });

                const starterMessage = await forumPost.fetchStarterMessage();
                if (starterMessage) {
                    await starterMessage.pin();
                }

                await interaction.editReply({
                    content: `Votre dossier a été créé avec succès dans le forum : <#${forumPost.id}>`
                });
            } catch (error) {
                console.error("Erreur lors de la création du post forum via modale :", error);
                await interaction.editReply({
                    content: 'Une erreur est survenue lors de la création de votre dossier.'
                });
            }
        }
    }
};