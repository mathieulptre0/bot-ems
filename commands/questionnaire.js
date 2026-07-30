const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageFlags } = require('discord.js');

const cultureQuestions = [
    { q: "Que signifie l'acronyme EMS ?", r: "Emergency Medical Services." },
    { q: "Quel organe pompe le sang dans tout le corps ?", r: "Le cœur." },
    { q: "Quel est le nom du gaz vital apporté à un patient en détresse respiratoire via une bouteille ?", r: "L'oxygène." },
    { q: "Quel outil permet d'écouter les battements du cœur et les poumons ?", r: "Le stéthoscope." },
    { q: "Dans quel os du corps se situe la rotule ?", r: "Le genou." },
    { q: "Quel est le plus grand organe du corps humain ?", r: "La peau." },
    { q: "Comment appelle-t-on un médecin spécialiste des os et des articulations ?", r: "Un orthopédiste." },
    { q: "Quel instrument mesure la tension artérielle ?", r: "Le tensiomètre (ou sphygmomanomètre)." },
    { q: "Quel type de cellules sanguines transporte l'oxygène ?", r: "Les globules rouges (ou hématies)." },
    { q: "Qu'est-ce qu'un ECG ?", r: "Un examen qui mesure l'activité électrique du cœur." },
    { q: "Quel est le nom de l'os de la cuisse, le plus long du corps humain ?", r: "Le fémur." },
    { q: "À quoi sert principalement le défibrillateur (DAE) ?", r: "À relancer ou régulariser un cœur en arrêt / fibrillation." },
    { q: "Quel est le nom du liquide biologique prélevé pour analyser la formule sanguine ?", r: "Le sang." },
    { q: "Qu'est-ce qu'une hémorragie ?", r: "Un saignement abondant et incontrôlé." },
    { q: "Quel service de l'hôpital gère les urgences vitales immédiates ?", r: "Les urgences (ou Emergency Room / ER)." },
    { q: "Quel est le nom de la position latérale de sécurité (PLS) en anglais ?", r: "Recovery Position." },
    { q: "Quel équipement fixe-t-on autour du cou d'un patient pour immobiliser ses cervicales en cas de choc ?", r: "Un collier cervical (cervical collar)." },
    { q: "Quelle est la température corporelle moyenne d'un humain en bonne santé ?", r: "Autour de 37°C." },
    { q: "Quel produit utilise-t-on pour désinfecter une plaie ?", r: "Un antiseptique." },
    { q: "Qu'est-ce qu'une fracture ?", r: "Une cassure d'os." },
    { q: "Quel nom donne-t-on à la perte de connaissance brève et soudaine ?", r: "Un malaise, une syncope ou un évanouissement." },
    { q: "Quel gaz expire-t-on principalement ?", r: "Le dioxyde de carbone (CO2)." },
    { q: "Quelle est la fonction principale des poumons ?", r: "Oxygéner le sang / les échanges gazeux." },
    { q: "Comment appelle-t-on familièrement le véhicule d'intervention des EMS ?", r: "Une ambulance." },
    { q: "Quel est le nom de l'artère principale qui part du cœur ?", r: "L'aorte." },
    { q: "Qu'est-ce qu'une entorse ?", r: "Une lésion des ligaments due à une torsion." },
    { q: "Quel est le rôle principal d'un EMT (Ambulancier) par rapport à un Paramédic ?", r: "L'EMT gère les soins de base et premiers secours, le paramédic gère les cas lourds et chirurgicaux." },
    { q: "Qu'est-ce qu'un œdème ?", r: "Un gonflement dû à une accumulation de liquide." },
    { q: "Quel outil permet de couper les vêtements d'un accidenté rapidement et sans danger ?", r: "Des ciseaux de trauma." },
    { q: "Qu'est-ce que l'asphyxie ?", r: "Un manque d'oxygène menant à la suffocation." },
    { q: "Quel est l'appareil utilisé pour ventiler artificiellement un patient qui ne respire plus ?", r: "Un insufflateur manuel (Bavu)." },
    { q: "Que signifie le terme CPR (ou RCP) ?", r: "Cardiopulmonary Resuscitation / Réanimation cardio-pulmonaire." },
    { q: "Quel type de brûlure touche toutes les couches de la peau et détruit les tissus en profondeur ?", r: "Une brûlure du 3e degré." },
    { q: "Quel est le nom du personnel hospitalier qui accueille et trie les patients aux urgences ?", r: "Un infirmier de triage." },
    { q: "Qu'est-ce qu'une contusion ?", r: "Un bleu / un coup sans plaie ouverte." },
    { q: "Quel examen d'imagerie médicale utilise des rayons X pour voir les os ?", r: "Une radiographie (X-Ray)." },
    { q: "Quel est l'état d'un patient dont le cœur ne bat plus et qui ne respire plus ?", r: "En arrêt cardiorespiratoire." },
    { q: "Quel type de civière roule et s'installe directement dans l'ambulance ?", r: "Un brancard." },
    { q: "Qu'est-ce qu'un choc anaphylactique ?", r: "Une réaction allergique grave et généralisée." },
    { q: "Quel est le nom de la structure rigide utilisée pour immobiliser un patient suspecté de trauma vertébral ?", r: "Un plan dur (spine board)." },
    { q: "Quel est le rôle principal d'une perfusion (IV) ?", r: "Administrer des liquides ou des médicaments directement dans le sang." },
    { q: "Qu'est-ce qu'une convulsion ?", r: "Des contractions musculaires involontaires et violentes." },
    { q: "Quel est le nom de la tenue spécifique portée par les soignants ?", r: "Une tenue médicale (scrubs)." },
    { q: "Qu'est-ce qu'un taux d'alcoolémie ?", r: "La concentration d'alcool dans le sang." },
    { q: "Pourquoi pose-t-on un garrot ?", r: "Pour stopper une hémorragie massive d'un membre." },
    { q: "Quel est le nom du stylo auto-injecteur utilisé en cas d'allergie critique ?", r: "Un Epipen / stylo d'adrénaline." },
    { q: "Qu'est-ce qu'une amnésie ?", r: "Une perte de mémoire." },
    { q: "Quel est l'organe qui filtre les déchets du sang pour produire l'urine ?", r: "Les reins." },
    { q: "Pourquoi est-il interdit de déplacer un blessé grave sans matériel adapté (sauf danger immédiat) ?", r: "Risque d'aggraver une lésion de la colonne vertébrale ou des fractures." },
    { q: "Quel est le rôle principal d'un défibrillateur automatisé externe (DAE) ?", r: "Analyser le rythme cardiaque et délivrer un choc si nécessaire." }
];

const situationsList = [
    { s: "Un citoyen vient vous voir à l'accueil en se tenant le poignet après une chute en trottinette. Il bouge ses doigts.", r: "L'asseoir, inspecter le poignet, vérifier la mobilité et la douleur, appliquer une attelle de poignet et poser une poche de froid." },
    { s: "En patrouille, vous trouvez une personne avec un petit saignement de nez suite à une bousculade.", r: "Asseoir la personne, pencher légèrement la tête vers l'avant, pincer la narine qui saigne quelques minutes et donner un mouchoir." },
    { s: "Un homme arrive en panique : il s'est coupé légèrement le doigt en cuisinant. La plaie saigne un tout petit peu.", r: "Le rassurer, nettoyer la petite plaie avec un antiseptique et poser un pansement simple." },
    { s: "Un individu se plaint d'une forte chaleur et a des étourdissements en plein soleil. Il est conscient.", r: "L'emmener à l'ombre, lui donner de l'eau fraîche et l'allonger en surélevant légèrement ses jambes." },
    { s: "Une personne présente une petite éraflure au genou suite à une chute à vélo sur le trottoir.", r: "Nettoyer l'éraflure au sérum physiologique / antiseptique pour enlever les impuretés et protéger avec une compresse ou un pansement." },
    { s: "Un patient se plaint d'une piqûre d'insecte bénigne qui gratte sur l'avant-bras.", r: "Nettoyer la zone, vérifier l'absence de dard, appliquer une crème apaisante ou antiseptique." },
    { s: "Quelqu'un renverse de l'eau froide sur ses vêtements et a froid, mais n'est pas blessé.", r: "Lui proposer de se sécher ou de changer de vêtements si disponibles, rassurer." },
    { s: "Un patient a une petite écharde dans le doigt et demande de l'aide.", r: "Désinfecter la zone, utiliser une pince à épiler stérile pour retirer l'écharde, puis désinfecter à nouveau." },
    { s: "Un citoyen est fatigué après une longue journée et demande juste à s'allonger 10 minutes sur un lit d'hôpital vide.", r: "L'installer en salle d'attente ou sur un brancard de repos en surveillant son état général." },
    { s: "Un individu a une crampe musculaire intense au mollet après un footing.", r: "L'aider à étirer doucement le muscle du mollet et lui faire boire de l'eau." },
    { s: "Vous intervenez pour une personne qui s'est tordu la cheville en marchant. Elle ne peut plus poser le pied.", r: "Installer la victime sur un brancard, immobiliser la cheville avec une attelle, appliquer du froid et recommander des radios." },
    { s: "Un individu a reçu du produit nettoyant ménager dans les yeux. Il hurle que ça brûle.", r: "Effectuer un lavage oculaire immédiat et abondant au sérum physiologique ou à l'eau claire pendant plusieurs minutes, puis surveiller." },
    { s: "Vous arrivez sur un léger accrochage. Un conducteur a la tête un peu sonnée, une bosse sur le front, mais est lucide.", r: "Vérifier l'orientation (temps/espace), poser un collier par précaution si choc violent, surveiller les signes de commotion." },
    { s: "Un patient se plaint de nausées et de vertiges persistants dans la rue. Il est assis par terre.", r: "Prendre sa tension artérielle, contrôler ses constantes, lui donner de l'eau et le maintenir au calme." },
    { s: "Une personne s'est brûlée superficiellement la main en touchant une plaque chaude (rougeur simple).", r: "Refroidir immédiatement la brûlure sous de l'eau tempérée (ni glacée) pendant 10 à 15 minutes, puis appliquer un pansement stérile non adhésif." },
    { s: "Un patient panique car il fait une crise de spasmophilie légère (légers tremblements, sensation de stress).", r: "Isoler le patient du bruit, le rassurer avec une voix calme et l'aider à régulariser sa respiration." },
    { s: "Un individu a avalé de travers et tousse fortement mais arrive à respirer.", r: "L'encourager à tousser, rester à côté de lui et se préparer à donner des claques dans le dos si son état s'aggrave." },
    { s: "Un patient présente une coupure franche au niveau de la paume de la main qui saigne de manière continue.", r: "Poser des gants, effectuer un appui direct avec une compresse stérile pour stopper l'hémorragie et faire un pansement compressif." },
    { s: "Une personne a un petit corps étranger (poussière métallique) dans l'œil après du bricolage.", r: "Rincer l'œil au sérum physiologique, ne pas frotter, et orienter vers un examen plus poussé si la douleur persiste." },
    { s: "Un patient se plaint de maux de tête violents (type migraine ophtalmique) dans les couloirs de l'hôpital.", r: "L'isoler dans une pièce sombre, l'allonger, vérifier sa tension et lui administrer un antalgique adapté selon prescription." },
    { s: "Vous êtes appelé pour une personne trouvée inconsciente mais qui respire normalement.", r: "La placer en Position Latérale de Sécurité (PLS), libérer les voies aériennes, surveiller la respiration en continu et appeler du renfort." },
    { s: "Un individu fait une crise d'angoisse majeure (hyperventilation, tremblements, sensation d'étouffement).", r: "Isoler la personne, lui parler calmement, l'aider à contrôler son rythme respiratoire (inspirer par le nez, expirer lentement par la bouche)." },
    { s: "Un patient saigne abondamment de l'avant-bras. Le simple pansement compressif ne suffit pas à stopper l'hémorragie.", r: "Poser un garrot artériel en amont de la blessure (sur le membre) et noter l'heure précise de pose." },
    { s: "Un patient présente des plaques rouges partout, commence à enfler au visage et respire mal après un repas.", r: "Suspecter un choc anaphylactique, préparer l'injection d'adrénaline (Epipen) et oxygéner le patient en urgence." },
    { s: "Un individu s'est cogné la tête, est conscient mais confus, et vomit quelques minutes plus tard.", r: "Suspecter une hypertension intracrânienne / commotion cérébrale grave, immobiliser les cervicales, perfuser et transporter d'urgence en trauma." },
    { s: "Un patient présente une crise d'asthme sévère, il s'asphyxie et n'a plus son inhalateur.", r: "Mettre le patient en position assise (facilitant la respiration), administrer de l'oxygène au masque haute concentration et appeler un paramédic/médecin." },
    { s: "Un individu a ingéré une trop grande quantité de médicaments par erreur (ou volontairement). Il est somnolent.", r: "Évaluer son niveau de conscience, sécuriser ses voies aériennes, perfuser et le transférer rapidement pour un lavage d'estomac ou prise en charge toxo." },
    { s: "Un patient présente une plaie ouverte à l'abdomen avec des viscères qui commencent à s'exposer légèrement.", r: "Ne surtout pas repousser les organes, recouvrir la plaie avec un champ stérile humide, et transporter d'urgence sans comprimer." },
    { s: "Un individu a reçu un coup de poing violent au visage, le nez est visiblement de travers et saigne abondamment.", r: "Contrôler le saignement nasal, rassurer, examiner les globes oculaires et orienter vers l'ORL/chirurgie maxillo-faciale." },
    { s: "Un patient fait une crise d'épilepsie (mouvements convulsifs) active sous vos yeux en pleine consultation.", r: "Écarter les objets dangereux autour de lui, protéger sa tête (ne rien mettre dans sa bouche), chronométrer la crise et le mettre en PLS à la fin." },
    { s: "Un conducteur est inconscient, coincé dans l'habitacle après un choc, avec une respiration très encombrée.", r: "Dégagement d'urgence si danger de mort, libération manuelle des voies aériennes, pose de colliers cervicaux, oxygénation et préparation à l'intubation par le Paramédic." },
    { s: "Un patient fait un arrêt cardiorespiratoire. Les EMT font la RCP et posent le DAE. Quel acte fait le Paramédic ?", r: "Préparer l'intubation trachéale, poser une voie veineuse périphérique (IV) et administrer les médicaments d'urgence (adrénaline, amiodarone) selon protocole." },
    { s: "Un individu a reçu un coup de couteau dans l'abdomen, sa tension chute et il délire (signes de choc).", r: "Remplissage vasculaire rapide par perfusion (solutés de remplissage), oxygénation, pose de voies d'abord larges et transport direct au bloc opératoire chirurgical." },
    { s: "Un otage est libéré avec une balle logée dans l'épaule, bras inerte, et un saignement actif profond.", r: "Contrôle de l'hémorragie (compression directe ou méchage/garrot si possible), antalgiques puissants (morphiniques), préparation de la chirurgie d'extraction de balle." },
    { s: "Un patient présente de graves difficultés respiratoires, un sifflement, un visage cyanosé (bleui), et les méthodes simples échouent.", r: "Réalisation d'une intubation d'urgence ou d'une cricothyroïdotomie d'urgence par le Paramédic pour contourner l'obstruction haute." },
    { s: "Un patient présente un traumatisme crânien grave avec des pupilles de tailles différentes (anisocorie).", r: "Signe de compression cérébrale grave. Hyperventiler le patient, maintenir une oxygénation maximale, perfusion de solutés osmotiques et transfert chirurgical immédiat." },
    { s: "Un individu est retrouvé en hypothermie profonde, inconscient, avec un pouls presque imperceptible.", r: "Réchauffement progressif externe, manipulation très délicate pour éviter de déclencher un arrêt cardiaque, perfusion de liquides tièdes, transfert en salle de choc." },
    { s: "Un patient a une fracture ouverte de la jambe avec l'os visible et une hémorragie artérielle en jet.", r: "Pose immédiate d'un garrot haut sur la cuisse, sédation du patient par le paramédic, immobilisation de la jambe et préparation à la chirurgie orthopédique." },
    { s: "Un individu présente des brûlures graves du 2e et 3e degré sur tout le torse et le visage après une explosion de gaz.", r: "Refroidissement prudent, administration d'antalgiques majeurs, pose d'une voie veineuse pour compenser la perte hydrique massive, protection des plaies avec des champs stériles." },
    { s: "Un patient en post-opératoire présente brutalement une tachycardie extrême et une chute de tension inexpliquée.", r: "Suspecter une hémorragie interne cachée ou une embolie, alerter le chirurgien, doubler les voies veineuses et perfuser des macromolécules." },
    { s: "Un motard éjecté à 150 km/h : poly-fractures aux deux jambes, ventre rigide (hémorragie interne), tension effondrée, coma.", r: "1. Sécuriser les fonctions vitales (O2/Intubation). 2. Poser des doubles voies veineuses pour remplissage massif. 3. Transporter en urgence absolue au bloc de chirurgie viscérale et orthopédique combinée." },
    { s: "Un agent subit un choc thoracique violent : pneumothorax étouffant (poumon affaissé, veines du cou gonflées, asphyxie totale).", r: "Geste salvateur immédiat : réaliser une exsufflation à l'aiguille (ou thoracentèse) dans le 2e espace intercostal pour libérer la pression d'air avant tout déplacement." },
    { s: "Un patient arrive avec une barre de fer plantée dans le thorax près du cœur, conscient mais en détresse respiratoire.", r: "Ne **jamais** retirer la barre de fer en pre-hospitalier (elle fait office de bouchon hémostatique). Fixer la barre pour éviter qu'elle ne bouge, oxygéner, et transférer directement au bloc de chirurgie cardiothoracique." },
    { s: "Un individu inanimé dans une ruelle, hypothermie avancée, arrêt cardiaque imminent, multiples lacérations artérielles aux bras.", r: "Poser des garrots multiples sur les bras, démarrer la RCP immédiatement tout en initiant un protocole de réchauffement actif et rapide en salle de déchoquage." },
    { s: "Un patient fait un infarctus massif (douleur thoracique + bras gauche) qui bascule soudainement en fibrillation ventriculaire.", r: "Massage cardiaque immédiat + Choc électrique externe (DAE/Défibrillateur manuel) + administration d'amiodarone et d'adrénaline, puis transfert direct en salle de coronarographie / bloc." },
    { s: "Un patient présente un état de choc septique généralisé suite à une infection non traitée, tension à 6/3, confusion profonde.", r: "Antibiothérapie d'urgence intraveineuse massive, remplissage vasculaire agressif par solutés, administration d'amines vaso-actives (adrénaline/noradrénaline) pour remonter la tension." },
    { s: "Un individu subit une section complète de la main par un outil industriel. La main est récupérée à côté.", r: "Poser un garrot sur le bras, conditionner la main sectionnée dans un sac étanche propre lui-même placé dans de la glace (pas de contact direct avec la glace), et transfert chirurgical ultra-rapide pour réimplantation." },
    { s: "Un patient absorbe un produit chimique hautement toxique par ingestion, il convulse et présente des brûlures des voies digestives.", r: "Ne pas faire vomir (risque de brûler à nouveau les tissus), intuber pour protéger les voies aériennes, lavage gastrique sécurisé en milieu spécialisé, antidotes adaptés." },
    { s: "Un individu est victime d'un accident de plongée (remontée trop rapide) : embolie gazeuse massive, douleurs articulaires foudroyantes et perte de connaissance.", r: "Oxygénothérapie normobare à 100% immédiate, mise en position allongée stricte, hydratation IV et transfert d'urgence vers un caisson hyperbare." },
    { s: "Un patient présente une rupture d'anévrisme cérébral brutale : céphalée en \"coup de tonnerre\", coma foudroyant, mydriase bilatérale (pupilles fixes et dilatées).", r: "Urgence neurochirurgicale absolue. Ventilation mécanique agressive pour réduire la pression intracrânienne, imagerie rapide (Scan/IRM) si l'état le permet, et passage immédiat en neurochirurgie pour clipping/embolisation." }
];

const activeSessions = new Map();
const allowedRoleIds = ['1531392863336923246', '1531693399051079700'];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('questionnaire')
        .setDescription('Envoie le panneau du module de recrutement EMS'),

    async execute(interaction) {
        await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

        const botName = interaction.client.user.username;
        const botAvatar = interaction.client.user.displayAvatarURL();
        const currentDate = new Date().toLocaleDateString('fr-FR');

        const hasPermission = allowedRoleIds.some(roleId => interaction.member.roles.cache.has(roleId));

        if (!hasPermission) {
            const errorEmbed = new EmbedBuilder()
                .setDescription('## ⛔ __Permission refusée__\n\nVous n\'avez pas la **permission** d\'utiliser cette commande car il vous **manque le rôle requis**.')
                .setColor(0xFF0000)
                .setFooter({ text: `${botName} — ${currentDate}`, iconURL: botAvatar });

            return await interaction.editReply({ embeds: [errorEmbed] });
        }

        const embed = new EmbedBuilder()
            .setTitle('🗒️ [EMS] - Session de Recrutement')
            .setDescription(
                'Bienvenue dans le **module de recrutement** du **Emergency Medical Services (EMS)**.\n\n' +
                'Une **nouvelle session d\'évaluation** est sur le point d\'être **initiée**. En tant que recruteur, veuillez suivre **attentivement** les réponses du candidat pour **analyser ses compétences** et **décider de son intégration** au sein de notre **équipe médicale**.\n\n' +
                '### 📋 **__Déroulement de l\'entretien__ :**\n\n' +
                '* 👤 **Questions personnelles :** Présentation, motivations et disponibilités du candidat.\n' +
                '* 🧠 **Culture générale :** **3 questions** sur le milieu médical et hospitalier.\n' +
                '* 🚨 **Mises en situation :** **5 cas pratiques** progressifs (du plus simple au plus critique).'
            )
            .setColor(0x0074FF)
            .setFooter({ text: `${botName} — ${currentDate}`, iconURL: botAvatar });

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('start_questionnaire')
                    .setLabel('Commencer le questionnaire')
                    .setStyle(ButtonStyle.Success)
                    .setEmoji('🩺'),
            );

        await interaction.channel.send({ embeds: [embed], components: [row] });

        const successEmbed = new EmbedBuilder()
            .setDescription(`## ✅ __Succès de l'envoi__\n\nLe **panneau de questionnaire** a été **envoyé avec succès** dans ce salon !`)
            .setColor(0x00FF00)
            .setFooter({ text: `${botName} — ${currentDate}`, iconURL: botAvatar });

        await interaction.editReply({ embeds: [successEmbed] });
    },

    async handleInteraction(interaction) {
        if (!interaction.isButton()) return;

        const botName = interaction.client.user.username;
        const botAvatar = interaction.client.user.displayAvatarURL();
        const currentDate = new Date().toLocaleDateString('fr-FR');
        const messageId = interaction.message.id;

        const hasPermission = allowedRoleIds.some(roleId => interaction.member.roles.cache.has(roleId));

        if (!hasPermission) {
            const errorEmbed = new EmbedBuilder()
                .setDescription('## ⛔ __Permission refusée__\n\nVous n\'avez pas la **permission** de cliquer sur ce bouton car il vous **manque le rôle requis**.')
                .setColor(0xFF0000)
                .setFooter({ text: `${botName} — ${currentDate}`, iconURL: botAvatar });

            return await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }

        if (interaction.customId === 'start_questionnaire') {
            await interaction.deferUpdate();

            activeSessions.set(messageId, { score: 0, history: [], casierJudiciaire: false });

            const questionEmbed = new EmbedBuilder()
                .setTitle('⏰ [EMS] - Entretien de Recrutement (Question 1/7)')
                .setDescription(
                    '**Disponibilités Globales**\n\n' +
                    'Veuillez demander au candidat ses **disponibilités globales** (jours et plages horaires de connexion habituels) afin de vérifier si son emploi du temps correspond aux besoins en couverture médicale des EMS.'
                )
                .setColor(0xFFD700)
                .setFooter({ text: `${botName} — ${currentDate}`, iconURL: botAvatar });

            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder().setCustomId('q1_valid').setLabel('Réponse Validée').setStyle(ButtonStyle.Success).setEmoji('✅'),
                    new ButtonBuilder().setCustomId('q1_refus').setLabel('Réponse refusée').setStyle(ButtonStyle.Danger).setEmoji('⛔')
                );

            await interaction.editReply({ embeds: [questionEmbed], components: [row] });
        } 
        else if (interaction.customId === 'q1_valid' || interaction.customId === 'q1_refus') {
            await interaction.deferUpdate();
            let session = activeSessions.get(messageId) || { score: 0, history: [], casierJudiciaire: false };
            session.history.push({ q: "Disponibilités Globales", status: interaction.customId === 'q1_valid' ? 'Validé' : 'Refusé' });
            activeSessions.set(messageId, session);

            const question2Embed = new EmbedBuilder()
                .setTitle('⏰ [EMS] - Entretien de Recrutement (Question 2/7)')
                .setDescription(
                    '**Expérience Professionnelle**\n\n' +
                    'Veuillez demander au candidat s\'il possède une **expérience préalable** dans le milieu médical ou s\'il s\'agit de sa **première immersion** au sein des services de santé.'
                )
                .setColor(0xFFD700)
                .setFooter({ text: `${botName} — ${currentDate}`, iconURL: botAvatar });

            const row2 = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder().setCustomId('q2_valid').setLabel('Réponse Validée').setStyle(ButtonStyle.Success).setEmoji('✅'),
                    new ButtonBuilder().setCustomId('q2_refus').setLabel('Réponse refusée').setStyle(ButtonStyle.Danger).setEmoji('⛔')
                );

            await interaction.editReply({ embeds: [question2Embed], components: [row2] });
        }
        else if (interaction.customId === 'q2_valid' || interaction.customId === 'q2_refus') {
            await interaction.deferUpdate();
            let session = activeSessions.get(messageId) || { score: 0, history: [], casierJudiciaire: false };
            session.history.push({ q: "Expérience Professionnelle", status: interaction.customId === 'q2_valid' ? 'Validé' : 'Refusé' });
            activeSessions.set(messageId, session);

            const question3Embed = new EmbedBuilder()
                .setTitle('⏰ [EMS] - Entretien de Recrutement (Question 3/7)')
                .setDescription(
                    '**Antécédents Légaux (Casier)**\n\n' +
                    'Veuillez demander au candidat s\'il a un **casier judiciaire** en cours ou par le passé.\n*(⚠️ **Validé** = Pas de casier | **Refusé** = Casier / Éliminatoire)*'
                )
                .setColor(0xFFD700)
                .setFooter({ text: `${botName} — ${currentDate}`, iconURL: botAvatar });

            const row3 = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder().setCustomId('q3_valid').setLabel('Réponse Validée').setStyle(ButtonStyle.Success).setEmoji('✅'),
                    new ButtonBuilder().setCustomId('q3_refus').setLabel('Réponse refusée').setStyle(ButtonStyle.Danger).setEmoji('⛔')
                );

            await interaction.editReply({ embeds: [question3Embed], components: [row3] });
        }
        else if (interaction.customId === 'q3_valid' || interaction.customId === 'q3_refus') {
            await interaction.deferUpdate();
            let session = activeSessions.get(messageId) || { score: 0, history: [], casierJudiciaire: false };
            
            if (interaction.customId === 'q3_refus') {
                session.casierJudiciaire = true;
                session.history.push({ q: "Antécédents Légaux (Casier)", status: 'Présence d\'un casier (Éliminatoire)' });
            } else {
                session.casierJudiciaire = false;
                session.history.push({ q: "Antécédents Légaux (Casier)", status: 'Pas de casier (Validé)' });
            }
            activeSessions.set(messageId, session);

            const question4Embed = new EmbedBuilder()
                .setTitle('⏰ [EMS] - Entretien de Recrutement (Question 4/7)')
                .setDescription(
                    '**Gestion des Conflits**\n\n' +
                    'Veuillez demander au candidat comment il réagit face à un **citoyen ou un collègue agressif, insultant ou non-coopératif** en intervention.'
                )
                .setColor(0xFFD700)
                .setFooter({ text: `${botName} — ${currentDate}`, iconURL: botAvatar });

            const row4 = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder().setCustomId('q4_valid').setLabel('Réponse Validée').setStyle(ButtonStyle.Success).setEmoji('✅'),
                    new ButtonBuilder().setCustomId('q4_refus').setLabel('Réponse refusée').setStyle(ButtonStyle.Danger).setEmoji('⛔')
                );

            await interaction.editReply({ embeds: [question4Embed], components: [row4] });
        }
        else if (interaction.customId === 'q4_valid' || interaction.customId === 'q4_refus') {
            await interaction.deferUpdate();
            let session = activeSessions.get(messageId) || { score: 0, history: [], casierJudiciaire: false };
            session.history.push({ q: "Gestion des Conflits", status: interaction.customId === 'q4_valid' ? 'Validé' : 'Refusé' });
            activeSessions.set(messageId, session);

            const question5Embed = new EmbedBuilder()
                .setTitle('⏰ [EMS] - Entretien de Recrutement (Question 5/7)')
                .setDescription(
                    '**Motivations**\n\n' +
                    'Veuillez demander au candidat pourquoi il souhaite **rejoindre les EMS** plutôt qu\'une autre structure (NYPD, mécanique, etc.).'
                )
                .setColor(0xFFD700)
                .setFooter({ text: `${botName} — ${currentDate}`, iconURL: botAvatar });

            const row5 = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder().setCustomId('q5_valid').setLabel('Réponse Validée').setStyle(ButtonStyle.Success).setEmoji('✅'),
                    new ButtonBuilder().setCustomId('q5_refus').setLabel('Réponse refusée').setStyle(ButtonStyle.Danger).setEmoji('⛔')
                );

            await interaction.editReply({ embeds: [question5Embed], components: [row5] });
        }
        else if (interaction.customId === 'q5_valid' || interaction.customId === 'q5_refus') {
            await interaction.deferUpdate();
            let session = activeSessions.get(messageId) || { score: 0, history: [], casierJudiciaire: false };
            session.history.push({ q: "Motivations", status: interaction.customId === 'q5_valid' ? 'Validé' : 'Refusé' });
            activeSessions.set(messageId, session);

            const question6Embed = new EmbedBuilder()
                .setTitle('⏰ [EMS] - Entretien de Recrutement (Question 6/7)')
                .setDescription(
                    '**Gestion des Conflits**\n\n' +
                    'Veuillez demander au candidat comment il réagit face à un **citoyen ou un collègue agressif, insultant ou non-coopératif** en intervention.'
                )
                .setColor(0xFFD700)
                .setFooter({ text: `${botName} — ${currentDate}`, iconURL: botAvatar });

            const row6 = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder().setCustomId('q6_valid').setLabel('Réponse Validée').setStyle(ButtonStyle.Success).setEmoji('✅'),
                    new ButtonBuilder().setCustomId('q6_refus').setLabel('Réponse refusée').setStyle(ButtonStyle.Danger).setEmoji('⛔')
                );

            await interaction.editReply({ embeds: [question6Embed], components: [row6] });
        }
        else if (interaction.customId === 'q6_valid' || interaction.customId === 'q6_refus') {
            await interaction.deferUpdate();
            let session = activeSessions.get(messageId) || { score: 0, history: [], casierJudiciaire: false };
            session.history.push({ q: "Gestion des Conflits (2)", status: interaction.customId === 'q6_valid' ? 'Validé' : 'Refusé' });
            activeSessions.set(messageId, session);

            const question7Embed = new EmbedBuilder()
                .setTitle('⏰ [EMS] - Entretien de Recrutement (Question 7/7)')
                .setDescription(
                    '**Secret Médical**\n\n' +
                    'Veuillez demander au candidat s\'il est capable de respecter l\'**anonymat et le secret médical** concernant les patients qu\'il prend en charge.'
                )
                .setColor(0xFFD700)
                .setFooter({ text: `${botName} — ${currentDate}`, iconURL: botAvatar });

            const row7 = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder().setCustomId('q7_valid').setLabel('Réponse Validée').setStyle(ButtonStyle.Success).setEmoji('✅'),
                    new ButtonBuilder().setCustomId('q7_refus').setLabel('Réponse refusée').setStyle(ButtonStyle.Danger).setEmoji('⛔')
                );

            await interaction.editReply({ embeds: [question7Embed], components: [row7] });
        }
        else if (interaction.customId === 'q7_valid' || interaction.customId === 'q7_refus') {
            await interaction.deferUpdate();
            let session = activeSessions.get(messageId) || { score: 0, history: [], casierJudiciaire: false };
            session.history.push({ q: "Secret Médical", status: interaction.customId === 'q7_valid' ? 'Validé' : 'Refusé' });
            activeSessions.set(messageId, session);

            const transitionEmbed = new EmbedBuilder()
                .setTitle('🧠 [EMS] - Entretien de Recrutement (Transition)')
                .setDescription(
                    '**Fin des Questions Personnelles**\n\n' +
                    'Annoncez au candidat que la partie sur son profil personnel est terminée, et que vous passez désormais aux **3 questions de culture générale / médicale**.'
                )
                .setColor(0x0074FF)
                .setFooter({ text: `${botName} — ${currentDate}`, iconURL: botAvatar });

            const rowTransition = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('to_culture_generale')
                        .setLabel('Passez au questionnaire')
                        .setStyle(ButtonStyle.Primary)
                        .setEmoji('➡️')
                );

            await interaction.editReply({ embeds: [transitionEmbed], components: [rowTransition] });
        }
        else if (interaction.customId === 'to_culture_generale') {
            await interaction.deferUpdate();

            const shuffled = [...cultureQuestions].sort(() => 0.5 - Math.random());
            const selected = shuffled.slice(0, 3);
            
            let session = activeSessions.get(messageId) || { score: 0, history: [], casierJudiciaire: false };
            session.cgQuestions = selected;
            session.cgIndex = 0;
            activeSessions.set(messageId, session);

            const currentQ = selected[0];

            const cgEmbed = new EmbedBuilder()
                .setTitle('🧠 [EMS] - Entretien de Recrutement (Culture Générale - Question 1/3)')
                .setDescription(
                    `**Question :**\n${currentQ.q}\n\n` +
                    `* **Réponse attendue :** ${currentQ.r}`
                )
                .setColor(0xFFD700)
                .setFooter({ text: `${botName} — ${currentDate}`, iconURL: botAvatar });

            const rowCG = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder().setCustomId('cg_next').setLabel('Réponse Validée / Suivant').setStyle(ButtonStyle.Success).setEmoji('✅'),
                    new ButtonBuilder().setCustomId('cg_refus').setLabel('Réponse refusée').setStyle(ButtonStyle.Danger).setEmoji('⛔')
                );

            await interaction.editReply({ embeds: [cgEmbed], components: [rowCG] });
        }
        else if (interaction.customId === 'cg_next' || interaction.customId === 'cg_refus') {
            await interaction.deferUpdate();

            let session = activeSessions.get(messageId);
            if (!session) {
                session = { score: 0, history: [], casierJudiciaire: false };
                activeSessions.set(messageId, session);
            }

            if (!session.cgQuestions) {
                const shuffled = [...cultureQuestions].sort(() => 0.5 - Math.random());
                session.cgQuestions = shuffled.slice(0, 3);
                session.cgIndex = 0;
            }

            const currentQ = session.cgQuestions[session.cgIndex];
            const isCorrect = interaction.customId === 'cg_next';

            if (isCorrect) {
                session.score += 0.5;
            }
            session.history.push({ q: `[Culture G] ${currentQ.q}`, status: isCorrect ? 'Bon (+0.5 pt)' : 'Faux (0 pt)' });

            session.cgIndex++;

            if (session.cgIndex < 3) {
                const nextQ = session.cgQuestions[session.cgIndex];
                const num = session.cgIndex + 1;

                const cgEmbed = new EmbedBuilder()
                    .setTitle(`🧠 [EMS] - Entretien de Recrutement (Culture Générale - Question ${num}/3)`)
                    .setDescription(
                        `**Question :**\n${nextQ.q}\n\n` +
                        `* **Réponse attendue :** ${nextQ.r}`
                    )
                    .setColor(0xFFD700)
                    .setFooter({ text: `${botName} — ${currentDate}`, iconURL: botAvatar });

                const rowCG = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder().setCustomId('cg_next').setLabel('Réponse Validée / Suivant').setStyle(ButtonStyle.Success).setEmoji('✅'),
                        new ButtonBuilder().setCustomId('cg_refus').setLabel('Réponse refusée').setStyle(ButtonStyle.Danger).setEmoji('⛔')
                    );

                await interaction.editReply({ embeds: [cgEmbed], components: [rowCG] });
            } else {
                const transitionSitEmbed = new EmbedBuilder()
                    .setTitle('🩺 [EMS] - Entretien de Recrutement (Transition)')
                    .setDescription(
                        '**Fin de la Culture Générale**\n\n' +
                        'Annoncez au candidat que la partie sur la culture générale est terminée, et que vous passez désormais aux **5 mises en situation**.'
                    )
                    .setColor(0x0074FF)
                    .setFooter({ text: `${botName} — ${currentDate}`, iconURL: botAvatar });

                const rowTransitionSit = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('to_mises_en_situation')
                            .setLabel('Passez aux mises en situation')
                            .setStyle(ButtonStyle.Primary)
                            .setEmoji('➡️')
                    );

                await interaction.editReply({ embeds: [transitionSitEmbed], components: [rowTransitionSit] });
            }
        }
        else if (interaction.customId === 'to_mises_en_situation') {
            await interaction.deferUpdate();

            const shuffled = [...situationsList].sort(() => 0.5 - Math.random());
            const selected = shuffled.slice(0, 5);

            let session = activeSessions.get(messageId) || { score: 0, history: [], casierJudiciaire: false };
            session.sitQuestions = selected;
            session.sitIndex = 0;
            activeSessions.set(messageId, session);

            const currentS = selected[0];

            const sitEmbed = new EmbedBuilder()
                .setTitle('🩺 [EMS] - Entretien de Recrutement (Mise en Situation 1/5)')
                .setDescription(
                    `**[Situation]**\n${currentS.s}\n\n` +
                    `* **Réponse attendue :** ${currentS.r}`
                )
                .setColor(0xFFD700)
                .setFooter({ text: `${botName} — ${currentDate}`, iconURL: botAvatar });

            const rowSit = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder().setCustomId('sit_next').setLabel('Réponse Validée / Suivant').setStyle(ButtonStyle.Success).setEmoji('✅'),
                    new ButtonBuilder().setCustomId('sit_refus').setLabel('Réponse refusée').setStyle(ButtonStyle.Danger).setEmoji('⛔')
                );

            await interaction.editReply({ embeds: [sitEmbed], components: [rowSit] });
        }
        else if (interaction.customId === 'sit_next' || interaction.customId === 'sit_refus') {
            await interaction.deferUpdate();

            let session = activeSessions.get(messageId);
            if (!session) {
                session = { score: 0, history: [], casierJudiciaire: false };
                activeSessions.set(messageId, session);
            }

            if (!session.sitQuestions) {
                const shuffled = [...situationsList].sort(() => 0.5 - Math.random());
                session.sitQuestions = shuffled.slice(0, 5);
                session.sitIndex = 0;
            }

            const currentS = session.sitQuestions[session.sitIndex];
            const isCorrect = interaction.customId === 'sit_next';

            if (isCorrect) {
                session.score += 1;
            }
            session.history.push({ q: `[Situation] ${currentS.s}`, status: isCorrect ? 'Bon (+1 pt)' : 'Faux (0 pt)' });

            session.sitIndex++;

            if (session.sitIndex < 5) {
                const nextS = session.sitQuestions[session.sitIndex];
                const num = session.sitIndex + 1;

                const sitEmbed = new EmbedBuilder()
                    .setTitle(`🩺 [EMS] - Entretien de Recrutement (Mise en Situation ${num}/5)`)
                    .setDescription(
                        `**[Situation]**\n${nextS.s}\n\n` +
                        `* **Réponse attendue :** ${nextS.r}`
                    )
                    .setColor(0xFFD700)
                    .setFooter({ text: `${botName} — ${currentDate}`, iconURL: botAvatar });

                const rowSit = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder().setCustomId('sit_next').setLabel('Réponse Validée / Suivant').setStyle(ButtonStyle.Success).setEmoji('✅'),
                        new ButtonBuilder().setCustomId('sit_refus').setLabel('Réponse refusée').setStyle(ButtonStyle.Danger).setEmoji('⛔')
                    );

                await interaction.editReply({ embeds: [sitEmbed], components: [rowSit] });
            } else {
                const endEmbed = new EmbedBuilder()
                    .setTitle('🎉 [EMS] - Entretien de Recrutement (Terminé)')
                    .setDescription('L\'entretien de recrutement est **entièrement terminé** ! Vous pouvez maintenant débriefer avec le candidat et prendre votre décision finale.')
                    .setColor(0x00FF00)
                    .setFooter({ text: `${botName} — ${currentDate}`, iconURL: botAvatar });

                const rowEnd = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('show_results')
                            .setLabel('Voir les résultats')
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji('📊')
                    );

                await interaction.editReply({ embeds: [endEmbed], components: [rowEnd] });
            }
        }
        else if (interaction.customId === 'show_results') {
            await interaction.deferUpdate();

            const session = activeSessions.get(messageId) || { score: 0, history: [], casierJudiciaire: false };
            const totalScore = session.score;
            let isAccepted = totalScore >= 3.5;
            let refusalReason = "";

            if (session.casierJudiciaire) {
                isAccepted = false;
                refusalReason = " (Refusé pour faute éliminatoire : Casier judiciaire présent)";
            } else if (!isAccepted) {
                refusalReason = " (Refusé : Score inférieur à 3,5 points)";
            } else {
                refusalReason = " (Validé : Score supérieur ou égal à 3,5 points)";
            }

            const resultEmbedColor = isAccepted ? 0x00FF00 : 0xFF0000;
            const resultTitle = isAccepted ? "✅ [EMS] - Résultat : CANDIDAT VALIDÉ" : "⛔ [EMS] - Résultat : CANDIDAT REFUSÉ";

            let roleSuggestionText = "";
            if (isAccepted) {
                if (totalScore >= 3.5 && totalScore <= 5) {
                    roleSuggestionText = `🎯 **Proposition de rôle :** <@&1531393840366354693>\n\n`;
                } else if (totalScore >= 5.5 && totalScore <= 6.5) {
                    roleSuggestionText = `🎯 **Proposition de rôle :** <@&1531393671247692010>\n\n`;
                }
            }

            let historyDescription = `${roleSuggestionText}**Score Total :** ${totalScore} / 6.5${refusalReason}\n\n### 📝 **Récapitulatif des réponses :**\n\n`;
            session.history.forEach((item, index) => {
                historyDescription += `**${index + 1}. ${item.q}**\n➡️ *${item.status}*\n\n`;
            });

            const resultEmbed = new EmbedBuilder()
                .setTitle(resultTitle)
                .setDescription(historyDescription)
                .setColor(resultEmbedColor)
                .setFooter({ text: `${botName} — ${currentDate}`, iconURL: botAvatar });

            await interaction.editReply({ embeds: [resultEmbed], components: [] });
            
            activeSessions.delete(messageId);
        }
    }
};