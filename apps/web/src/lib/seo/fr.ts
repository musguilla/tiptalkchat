import type { SeoPage, SeoFaq } from '../seo-pages';

// Contenu SEO traduit par slug. Les slugs absents retombent sur la source
// espagnole de seo-pages.ts.

// ===== Extraits de FAQ réutilisables ====================================
const FAQ_REGISTRO: SeoFaq = {
  q: 'Dois-je m’inscrire pour utiliser tiptalk.chat ?',
  a: 'Non. Tu peux créer un salon avec un simple pseudo et un nom, et l’autre personne entre depuis le lien sans ouvrir de compte. L’inscription n’est nécessaire que si tu veux recevoir des pourboires et les retirer sur ton compte.',
};

const FAQ_PRIVACIDAD: SeoFaq = {
  q: 'Qu’advient-il de mes messages quand le salon se ferme ?',
  a: 'Quand tu fermes le salon (ou au bout de 24 heures), nous effaçons tous les messages, photos et vidéos qui ont été envoyés. Rien ne reste stocké sur nos serveurs au-delà du registre des transactions de pourboires, obligatoire pour des raisons fiscales.',
};

const FAQ_PRECIO: SeoFaq = {
  q: 'Combien coûte la création d’un salon ?',
  a: 'Créer un salon est gratuit et le restera toujours. La seule chose payante, ce sont les pourboires, car il s’agit d’argent réel transféré d’une personne à une autre. Si tu veux seulement chatter et appeler, tu ne paies rien.',
};

const FAQ_MOVIL: SeoFaq = {
  q: 'Est-ce que ça marche depuis le mobile ?',
  a: 'Oui, sans installer aucune application. Le salon s’ouvre dans le navigateur du mobile (Chrome, Safari, Firefox) comme n’importe quel site web. Les appels utilisent le micro et la caméra du téléphone.',
};

const FAQ_PROPINAS: SeoFaq = {
  q: 'Comment fonctionnent les pourboires ?',
  a: 'Les pourboires s’appellent des Tipsys. 1 € = 8 Tipsys à l’achat. Quand quelqu’un t’envoie des Tipsys, ils s’accumulent dans ton porte-monnaie et tu les convertis en euros quand tu veux les retirer (10 Tipsys = 1 € à la conversion en euros).',
};

const FAQ_NAVEGADOR: SeoFaq = {
  q: 'Sur quels navigateurs ça fonctionne ?',
  a: 'Ça fonctionne sur Chrome, Safari, Firefox, Edge et Brave à jour. Pour les appels vidéo, le navigateur demandera l’autorisation d’utiliser la caméra et le micro la première fois.',
};

export const fr: Record<string, Partial<SeoPage>> = {
  'chat-online': {
    label: 'Chat en ligne',
    h1: 'Chat en ligne en direct',
    metaTitle: 'Chat en ligne - Salons de chat privés - Tiptalk',
    metaDescription:
      'Chat en ligne en direct en français. Crée un salon privé et commence à parler avec qui tu veux en quelques secondes. Sans rien installer.',
    intro:
      'Un **chat en ligne** simple, privé et sans téléchargement. Tu ouvres le salon, tu partages le lien et la conversation commence.',
    paragraphs: [
      'Sur tiptalk.chat, tu peux ouvrir un **chat en ligne** en quelques secondes. Aucun téléchargement, aucun numéro de téléphone, aucune attente. Tu écris simplement le nom du salon, tu appuies sur le bouton de création et le lien est prêt à partager avec qui tu veux.',
      'Ça marche depuis le navigateur du mobile ou de l’ordinateur, peu importe. La conversation reste entre toi et la personne d’en face : pas de groupes massifs ni d’inconnus qui débarquent par surprise. Ce qui se passe dans ton **chat en ligne** reste entre vous.',
      'Si tu as envie de passer du texte à autre chose, tu lances un appel vocal ou un appel vidéo d’un seul bouton. La qualité de l’appel s’adapte à ta connexion : si tu manques de réseau, seule la voix reste et la résolution baisse pour éviter les coupures.',
      'Et si on te raconte quelque chose qui en vaut la peine, tu peux laisser des pourboires en direct. L’animation apparaît à l’écran instantanément pour que l’autre personne voie l’attention sans que tu aies à dire quoi que ce soit.',
      'Contrairement à un groupe WhatsApp ou à un serveur Discord, ce que tu envoies n’est pas conservé pour toujours. En fermant le salon (ou passées 24 heures), tout s’efface : messages, photos et vidéos. L’idée, c’est que le **chat en ligne** soit comme une conversation de vive voix : vivant tant qu’il dure, et rien de plus.',
      'C’est pensé pour les gens qui ont besoin d’un endroit rapide pour parler à quelqu’un sans passer par les réseaux sociaux. Un cours particulier, une consultation ponctuelle, un moment de discussion avec une personne rencontrée ailleurs ou un appel avec la famille qui vit loin.',
      'Il n’y a aucune limite au nombre de salons que tu peux créer. Si l’un se remplit de contexte et que tu veux repartir de zéro, tu en ouvres un autre en trente secondes et tu partages le nouveau lien.',
    ],
    faqs: [
      {
        q: 'Puis-je utiliser tiptalk.chat comme chat en ligne pour mon activité ?',
        a: 'Oui. Beaucoup de gens s’en servent pour des consultations avec des clients, des cours particuliers ou des séances de coaching. Le salon est privé, l’encaissement passe par les pourboires ou par un tarif fixe que tu annonces à l’avance, et à la fin il ne reste aucun historique.',
      },
      {
        q: 'Combien de personnes peuvent entrer dans un chat en ligne ?',
        a: 'Par conception, c’est du un-à-un. Le salon accueille la personne qui l’a créé et celle qui a le lien, ce qui donne une conversation privée à deux. S’il t’en faut plus, tu peux ouvrir plusieurs salons en même temps.',
      },
      FAQ_REGISTRO,
      FAQ_PRIVACIDAD,
      FAQ_MOVIL,
    ],
  },
  'chat-propinas': {
    label: 'Chat pourboires',
    h1: 'Chat avec pourboires',
    metaTitle: 'Chat pourboires - Gagner de l’argent au chat - Tiptalk',
    metaDescription:
      'Chat privé avec pourboires intégrés. Reçois les pourboires de ton audience à chaque conversation. Crée ton salon gratuitement et commence maintenant.',
    intro:
      'Sur tiptalk.chat, les **pourboires** sont dans le chat. Un bouton, un montant, et ça apparaît à l’écran instantanément.',
    paragraphs: [
      'Tout l’intérêt de tiptalk.chat, c’est que n’importe quelle conversation peut se transformer en **chat pourboires**. Si on te fait rire, si on t’aide, ou si tu veux simplement reconnaître le temps de l’autre personne, il y a un bouton. Sans changer d’appli, sans ouvrir un virement, sans passer par un autre onglet.',
      'Ça fonctionne avec les Tipsys, notre monnaie virtuelle. 1 € = 8 Tipsys à l’achat et 10 Tipsys = 1 € lors de la conversion à l’encaissement. Celui qui reçoit des **pourboires** les accumule dans son porte-monnaie et peut les convertir en euros une fois atteint le minimum de retrait.',
      'C’est direct, sans passerelles maladroites ni sauts vers une autre appli. Tu appuies sur un bouton, tu choisis le montant et une animation apparaît dans le chat pour que l’autre personne la voie aussitôt. Pas de confirmations a posteriori ni d’e-mails du type « tu as reçu un virement ».',
      'Il y a des pourboires prédéfinis (0,25 €, 0,50 €, 1 €, 2 €, 5 €) et l’option d’un montant libre. Si tu veux joindre une petite note au pourboire, elle part à côté : un merci, une blague, ce que tu veux.',
      'Quand tu reçois beaucoup de **pourboires** dans une même conversation, ils apparaissent tous dans le porte-monnaie comme des mouvements séparés. Ça te donne un historique clair : tu vois quand chacun est arrivé et de quel salon il vient.',
      'Pour commencer à recevoir, il te suffit de t’inscrire (en moins d’une minute), de connecter un compte d’encaissement et d’ouvrir un salon. Ce qui vient ensuite, c’est de chatter : la plateforme gère le reste.',
      'Le système marche aussi bien pour les créateurs à grande audience que pour les professionnels qui donnent une consultation ponctuelle. Si ton travail se mesure en conversations, avoir les **pourboires** dans le chat réduit la friction au minimum.',
    ],
    faqs: [
      {
        q: 'Qui paie les commissions du chat de pourboires ?',
        a: 'La commission est prise en charge par celui qui reçoit le pourboire (30 %). Celui qui donne paie le prix affiché à l’écran sans frais supplémentaires — ce qu’il offre correspond aux euros remis.',
      },
      {
        q: 'Quel est le minimum pour retirer les pourboires sur mon compte ?',
        a: 'Le minimum de retrait est de 300 Tipsys, soit 30 € bruts avant commission. Tu peux demander l’encaissement autant de fois que tu veux une fois ce seuil dépassé.',
      },
      FAQ_PROPINAS,
      FAQ_REGISTRO,
      FAQ_PRIVACIDAD,
    ],
  },
  'chat-movil': {
    label: 'Chat mobile',
    h1: 'Chat pour le mobile',
    metaTitle: 'Chat mobile - Chat privé - Tiptalk',
    metaDescription:
      'Chat privé optimisé pour le mobile. Texte, voix et vidéo depuis le navigateur. Sans téléchargement. Partage le lien et chatte maintenant.',
    intro:
      'tiptalk.chat fonctionne comme un **chat mobile** sans applis : le salon s’ouvre dans Safari ou Chrome et tu es déjà dedans.',
    paragraphs: [
      'tiptalk.chat est pensé pour le mobile. Le salon s’ouvre depuis Safari, Chrome ou le navigateur que tu utilises, exactement comme quand tu ouvres n’importe quel site. Aucune appli à télécharger, aucune mise à jour, aucune autorisation bizarre : juste un onglet de plus.',
      'Tu peux envoyer des messages, des photos, des vidéos courtes et lancer des appels avec la caméra avant ou le micro. Le tout au même endroit. Si tu décides de faire un appel vidéo, le navigateur demande l’autorisation d’utiliser la caméra la première fois, puis elle reste accordée pour ce salon.',
      'Aucune appli à installer ni notifications étranges. Si tu fermes l’onglet, la conversation reste là tant que le salon est ouvert. Tu reviens depuis le lien et tu reprends où tu t’étais arrêté.',
      'L’interface du **chat mobile** s’adapte à l’écran : les messages occupent la largeur utile, le clavier s’ajuste tout seul et les boutons d’appel restent à portée du pouce, en haut à droite.',
      'Pendant un appel vidéo, le chat reste actif en dessous. Tu peux voir les messages qui arrivent sans avoir à raccrocher, et la personne d’en face voit ce que tu écris pendant que vous parlez. Pratique pour passer un lien, une adresse ou un chiffre sans perdre le fil.',
      'Les appels en **chat mobile** fonctionnent en données mobiles ou en WiFi, et s’adaptent à la qualité du réseau. Si tu as une 4G faible, la résolution de la vidéo baisse automatiquement pour que la voix ne se coupe pas. Et si tu perds la connexion, l’appel reprend seul au retour.',
      'Ça marche aussi bien depuis un iPhone que depuis un Android. La seule condition, c’est d’avoir le navigateur à jour : rien d’exceptionnel, tous les téléphones de ces dernières années le font.',
    ],
    faqs: [
      {
        q: 'Faut-il installer une appli pour utiliser le chat sur mobile ?',
        a: 'Non. Toute l’expérience fonctionne depuis le navigateur. Il n’y a pas de version native parce que ce n’est pas nécessaire : les appels vidéo, les pourboires et les photos marchent bien depuis le web.',
      },
      {
        q: 'Un chat mobile avec vidéo consomme-t-il beaucoup de données ?',
        a: 'Un appel vidéo standard consomme entre 5 et 10 Mo par minute. Si tu es juste en données, tu peux couper la caméra et ne garder que la voix, qui descend à moins de 1 Mo par minute.',
      },
      FAQ_NAVEGADOR,
      FAQ_REGISTRO,
      FAQ_PRIVACIDAD,
    ],
  },
  'chatroulette': {
    label: 'ChatRoulette',
    h1: 'Alternative à ChatRoulette',
    metaTitle: 'ChatRoulette - Chat privé - Tiptalk',
    metaDescription:
      'Salon de chat privé un à un. C’est toi qui choisis avec qui tu parles — sans surprises. Alternative moderne à ChatRoulette en français.',
    intro:
      'Si tu arrives en cherchant **ChatRoulette**, tiptalk.chat en est la version maîtrisée : c’est toi qui décides qui entre, sans inconnus au hasard.',
    paragraphs: [
      'Si tu arrives en cherchant quelque chose comme **ChatRoulette**, ce que fait tiptalk.chat est similaire mais différent : c’est toi qui décides avec qui tu parles. Tu ouvres le salon et tu partages le lien avec la ou les personnes que tu veux faire entrer.',
      'Pas de roulette ni d’inconnus au hasard. C’est un salon privé un à un, contrôlé par toi. Si quelqu’un te met mal à l’aise, tu fermes et tu en ouvres un autre. La différence clé avec un **ChatRoulette** classique, c’est qu’ici tu choisis, pas le hasard.',
      'Ça évite les problèmes typiques des roulettes de chat : des gens qui se connectent sans caméra, du contenu non désiré, des conversations qui durent trois secondes. Ici le salon est le tien et seul y entre qui tu décides.',
      'Si ton but est de rencontrer de nouvelles personnes, il te suffit de partager le lien sur un forum, un réseau social ou là où tu veux. Ceux que ça intéresse te trouveront. Tu gardes le contrôle sur qui entre et quand.',
      'Ça marche sur n’importe quel appareil doté d’un navigateur, et tu as la vidéo, la voix, le texte et les pourboires au même endroit. C’est comme un **ChatRoulette** mais pensé pour 2026 : sans téléchargement, sans Flash, sans avoir à s’inscrire à quoi que ce soit.',
      'Pour les créateurs qui viennent de plateformes de cam, tiptalk.chat offre ce que celles-ci n’avaient pas : des pourboires en direct dans le chat. C’est toi qui décides quand tu ouvres et fermes, sans contrats ni abonnement fixe.',
      'Si ton salon a du trafic, tu convertis en euros les Tipsys reçus quand tu veux. La gestion est bien plus propre que celle de n’importe quelle roulette classique, où le modèle de monétisation était confus, voire inexistant.',
    ],
    faqs: [
      {
        q: 'tiptalk.chat, c’est comme ChatRoulette ?',
        a: 'Ça partage l’idée du chat un à un avec vidéo, mais pas la roulette. Ici, c’est toi qui partages le lien de ton salon avec qui tu veux, au lieu que le système t’associe à un inconnu au hasard.',
      },
      {
        q: 'Puis-je ouvrir un salon public comme un ChatRoulette ?',
        a: 'Tu peux partager le lien où tu veux (forums, réseaux, un profil) et toute personne ayant ce lien entrera dans ton salon. Tu continues de contrôler l’accès puisque tu peux le fermer à tout moment ou y mettre un code PIN.',
      },
      FAQ_REGISTRO,
      FAQ_PRIVACIDAD,
      FAQ_MOVIL,
    ],
  },
  'chat-amigos': {
    label: 'Chat entre amis',
    h1: 'Chat pour parler avec des amis',
    metaTitle: 'Chat entre amis - Salons de chat privés - Tiptalk',
    metaDescription:
      'Chat privé pour parler avec des amis. Texte, voix et vidéo depuis le navigateur. Sans groupes énormes ni notifications, juste toi et qui tu veux.',
    intro:
      'Un **chat entre amis** sans ajouter de bruit à WhatsApp. Salon privé, voix, vidéo et rien qui reste enregistré.',
    paragraphs: [
      'Parfois, tu ne veux pas mettre une conversation dans WhatsApp, ni qu’elle y reste pour toujours. tiptalk.chat te donne un salon privé qui n’existe que tant que tu veux le garder ouvert. Pensé pour un **chat entre amis** ponctuel sans polluer le reste de tes discussions.',
      'Tu peux y faire entrer un ami, partager photos et vidéos, appeler en voix ou faire un appel vidéo. Quand vous avez fini, tu fermes le salon et tout ce qui a été envoyé dedans s’efface. Aucun historique ne reste accroché à ton téléphone ni au sien.',
      'Ça sert à caler des plans, à passer un long appel avec quelqu’un qui vit ailleurs ou simplement à avoir un endroit sans bruit pour discuter. Comme il n’y a pas de groupes massifs, tu ne reçois pas d’alertes toutes les deux minutes qui te sortent du sujet.',
      'Si tu retrouves une amie qui vit dans un autre pays et que le décalage horaire ne vous laisse qu’une courte fenêtre pour parler, ouvrir un **chat entre amis** sur tiptalk.chat règle le problème : elle entre depuis un lien, toi depuis un autre, et vous vous mettez à parler sans rien télécharger.',
      'Pour les longs appels, le système maintient la connexion même si l’un de vous deux passe du WiFi à la 4G en pleine conversation. La qualité baisse un instant puis se rétablit, sans avoir à rappeler.',
      'Comme aucun compte n’est nécessaire, tu peux inviter quelqu’un qui n’a pas envie d’installer une appli de plus. Il lui suffit du lien. Il met son nom, il entre et c’est bon.',
      'C’est particulièrement utile quand il existe déjà un troisième canal (un couple, un cousin, un boulot) où il y a beaucoup de bruit. Ouvrir un **chat entre amis** à part permet de ne pas mélanger les conversations.',
    ],
    faqs: [
      {
        q: 'Mes amis doivent-ils créer un compte pour entrer dans le chat ?',
        a: 'Non. Ils ont seulement besoin du lien que tu leur partages. En entrant, on leur demande un pseudo pour s’identifier dans le salon, et c’est tout.',
      },
      {
        q: 'Puis-je créer plusieurs salons à la fois pour différents groupes d’amis ?',
        a: 'Oui. Chaque salon est indépendant et ne vit que tant que tu le gardes ouvert. Tu peux en avoir un avec des amis d’enfance, un autre avec des copains de la salle de sport et un autre avec la famille, sans qu’ils se mélangent.',
      },
      FAQ_REGISTRO,
      FAQ_PRIVACIDAD,
      FAQ_MOVIL,
    ],
  },
  'chat-privado': {
    label: 'Chat privé',
    h1: 'Chat privé un à un',
    metaTitle: 'Chat privé - Chat privé - Tiptalk',
    metaDescription:
      'Chat privé un à un avec vidéo, voix et pourboires. Tu ouvres le salon, tu partages le lien et seul entre qui tu décides.',
    intro:
      'Un vrai **chat privé** : salon un à un, sans historique conservé, avec vidéo et pourboires au même endroit.',
    paragraphs: [
      'tiptalk.chat est au fond un **chat privé** comme on en a toujours connu, mais mieux monté. C’est toi qui décides qui entre : sans le lien, tu n’arrives pas au salon. Et même avec le lien, si le créateur le ferme, il cesse de fonctionner.',
      'Par défaut, rien de ce qui se passe dedans n’est conservé à la fermeture. Nous effaçons les messages et les fichiers à la fin de la conversation, et au bout de 24 heures le salon se ferme tout seul. C’est la différence avec n’importe quel réseau social : ici, ce que tu envoies n’entraîne rien et ne reste pas sur un serveur pour toujours.',
      'Si tu veux encore plus de confidentialité, tu peux mettre un **PIN** au salon pour que le lien seul ne suffise pas. Ainsi, même si quelqu’un copie et partage le lien, il ne pourra pas entrer sans le code.',
      'Le **chat privé** prend en charge le texte, les photos, les vidéos courtes, les appels vocaux et les appels vidéo. Le tout dans le même salon. Si tu passes du chat à la vidéo puis reviens, rien ne tombe : c’est toujours le même fil.',
      'Contrairement aux chats intégrés aux réseaux sociaux, ici il n’y a pas de pub, pas de recommandations, pas de « personnes que tu connais peut-être ». C’est juste le chat. L’entreprise ne monétise pas tes conversations — elle monétise les pourboires, et seulement si tu décides de les utiliser.',
      'Côté confidentialité technique : les connexions passent par TLS, les fichiers transitent par un stockage chiffré et les webhooks de paiement respectent les standards de Stripe Connect. Ce n’est ni magie ni promesses vagues : c’est la pile standard bien configurée.',
      'Quand tu fermes un salon, un processus s’exécute pour tout nettoyer : les médias en stockage, les messages en base de données et le salon lui-même. La seule chose qui survit, c’est le registre des pourboires, une écriture comptable obligatoire.',
    ],
    faqs: [
      {
        q: 'tiptalk.chat est-il vraiment un chat privé ?',
        a: 'Oui. Le salon n’est accessible qu’à qui a le lien (et le PIN si tu l’as activé). Le contenu s’efface à la fermeture. Nous n’affichons les salons dans aucun annuaire public.',
      },
      {
        q: 'Le chat privé est-il chiffré de bout en bout ?',
        a: 'Les connexions utilisent TLS de bout en bout navigateur → serveur, mais les messages passent par notre backend pour être distribués aux destinataires. Ce n’est pas du E2EE pur comme Signal, mais le contenu s’efface à la fermeture du salon.',
      },
      FAQ_REGISTRO,
      FAQ_PRIVACIDAD,
      FAQ_NAVEGADOR,
    ],
  },
  'chat-token': {
    label: 'Chat token',
    h1: 'Chat avec tokens — Tipsys',
    metaTitle: 'Chat token - Gagner de l’argent en chattant - Tiptalk',
    metaDescription:
      'Salon de chat avec système de tokens (Tipsys). Reçois des pourboires en direct de ton audience. Convertis tes tokens en euros quand tu veux.',
    intro:
      'tiptalk.chat fonctionne comme un **chat token** : dedans des Tipsys, dehors des euros. Tu achètes, tu envoies, tu retires.',
    paragraphs: [
      'Les **tokens** de tiptalk.chat s’appellent des Tipsys. La conversion est simple : 1 € équivaut à 8 Tipsys à l’achat. À l’encaissement, 10 Tipsys équivalent à 1 € (la différence est la commission qui fait vivre la plateforme).',
      'Quand quelqu’un t’envoie des Tipsys, ils s’accumulent dans ton porte-monnaie. Une fois le minimum atteint (300 Tipsys = 30 € bruts), tu les convertis en euros et tu les retires sur ton compte bancaire. L’encaissement passe par notre prestataire de paiement et arrive normalement en 1 à 2 jours ouvrés.',
      'Ce que tu vois dans le **chat token** est direct : chaque pourboire apparaît sous forme de mini-animation instantanément. Sans attente, sans clôtures de fin de mois, sans factures coincées dans une boîte de réception.',
      'Les **tokens** sont idéaux pour les créateurs car ils dissocient la décision « je vais soutenir cette personne » de la décision « je vais ressortir ma carte ». Ton audience achète un pack puis laisse des pourboires d’un clic, sans repasser par la passerelle de paiement.',
      'Il y a des packs de 40 (5 €), 80 (10 €), 160 (20 €) et 400 (50 €) Tipsys. Plus le pack est gros, plus il est facile pour ton audience de garder l’habitude sans recharger à chaque fois. Si quelqu’un veut un autre montant, c’est toi qui décides : le salon accepte les montants libres.',
      'Comme le **chat token** est propre à la plateforme, il n’y a aucun risque qu’un encaissement échoue à cause d’un souci avec une passerelle externe. Si tu as des Tipsys dans ton porte-monnaie, ils sont à toi.',
      'Côté fiscalité : les retraits se font sur ton compte et constituent des revenus personnels soumis à l’impôt sur le revenu en France (ou l’équivalent dans ton pays). Nous te fournissons un récapitulatif mensuel dans ton tableau de bord pour faciliter la déclaration.',
    ],
    faqs: [
      {
        q: 'Que sont les Tipsys, le token interne de tiptalk.chat ?',
        a: 'C’est notre monnaie virtuelle de pourboires. 1 € équivaut à 8 Tipsys à l’achat, 10 Tipsys équivalent à 1 € à l’encaissement. La différence est la commission de la plateforme (30 %).',
      },
      {
        q: 'Les Tipsys expirent-ils dans le porte-monnaie ?',
        a: 'Non, les Tipsys présents dans ton porte-monnaie sont conservés indéfiniment. Tu peux les envoyer en pourboires ou les retirer en euros une fois le minimum atteint.',
      },
      FAQ_PROPINAS,
      FAQ_PRECIO,
      FAQ_REGISTRO,
    ],
  },
  'chat-tips': {
    label: 'Chat tips',
    h1: 'Chat avec tips en direct',
    metaTitle: 'Chat tips - Gagner de l’argent au chat - Tiptalk',
    metaDescription:
      'Reçois des tips directement dans le chat. Voix, vidéo et pourboires dans le même salon. Sans passerelles externes, sans attente.',
    intro:
      'Les **tips** sur tiptalk.chat sont dans le chat. Bouton, montant, animation et c’est fait.',
    paragraphs: [
      'Un **tip** sur tiptalk.chat, c’est ce que la personne d’en face peut t’envoyer sans quitter le chat. Elle appuie sur un bouton, choisit le montant, et l’animation apparaît à l’instant. Tu le vois en direct et l’autre repart avec le sentiment de t’avoir remercié pour ce moment.',
      'C’est bien plus direct qu’un virement à part ou un PayPal ouvert dans un autre onglet. Le **chat tips** intègre le pourboire comme un message de plus, avec son animation visuelle et son entrée dans le porte-monnaie.',
      'Ça sert aussi bien aux créateurs qu’aux professionnels qui facturent une courte consultation ou aux amis qui veulent t’offrir quelque chose à distance. L’économie est la même : des Tipsys qui s’accumulent et se convertissent en euros.',
      'Pour le créateur, recevoir des **tips** dans le chat a un avantage sur le modèle « payer à la fin » : le pourboire est donné à chaud, juste après le moment qui donne envie de dire merci. C’est psychologiquement plus facile que d’ouvrir une autre appli pour envoyer 2 € à froid.',
      'L’animation du pourboire est discrète — elle n’interrompt pas et ne cache pas le chat. Elle apparaît juste deux secondes comme un emoji qui vole, et reste consignée dans l’historique comme un message du système.',
      'Pour les cas où tu veux remercier pour quelque chose de précis — une réponse utile, une blague — tu peux laisser un **tip** sur le message concerné. Ainsi tu sais à quoi se rapportait le pourboire quand tu regardes ton historique plus tard.',
      'Il n’y a pas de minimum élevé : le **tip** le plus petit est de 25 centimes (2 Tipsys). Le plus grand est libre — la personne choisit le montant. Si ton salon tourne bien, les tickets moyens se situent en général entre 50 centimes et 2 €.',
    ],
    faqs: [
      {
        q: 'Dois-je payer pour envoyer un tip dans un chat ?',
        a: 'Pour envoyer des tips, tu achètes d’abord des Tipsys (1 € = 8 Tipsys) et tu les envoies d’un clic pendant la conversation. Il n’y a aucun coût supplémentaire par tip individuel ; le coût, c’est l’achat de Tipsys.',
      },
      {
        q: 'Puis-je envoyer des tips à plusieurs personnes à la fois ?',
        a: 'Ton porte-monnaie est unique et les Tipsys que tu as servent pour n’importe quel salon. Si tu ouvres plusieurs salons, tu peux envoyer des pourboires dans chacun en utilisant le même solde.',
      },
      FAQ_PROPINAS,
      FAQ_PRECIO,
      FAQ_PRIVACIDAD,
    ],
  },
  'chatear-online': {
    label: 'Chatter en ligne',
    h1: 'Chatter en ligne en français',
    metaTitle: 'Chatter en ligne - Salons de chat privés - Tiptalk',
    metaDescription:
      'Chatter en ligne en français. Salon privé avec texte, voix et vidéo depuis le navigateur. Partage le lien et commence maintenant.',
    intro:
      'Pour **chatter en ligne** en français sans rien télécharger : tu ouvres un salon, tu partages le lien, vous parlez.',
    paragraphs: [
      '**Chatter en ligne** sur tiptalk.chat, c’est ouvrir un salon avec un nom, partager le lien et voilà. On ne te demande pas de compte, pas de téléphone, pas de vérification par SMS. Tu vas droit au chat.',
      'Le salon n’est qu’à toi et à qui tu décides d’inviter. Si tu veux passer du texte à la vidéo ou à la voix, c’est déjà au même endroit : deux boutons en haut à gauche. Tu n’as pas à ouvrir Skype, ni Google Meet, ni Zoom.',
      'Au bout de 24 heures, il se ferme tout seul et tout ce que vous avez envoyé dedans disparaît. Si tu veux plus de temps, tu en ouvres simplement un autre. C’est pratique pour les conversations que tu ne veux pas voir s’accumuler dans ton historique général.',
      'Pour **chatter en ligne** avec quelqu’un à l’autre bout du monde, il te faut seulement une bonne connexion internet. La latence reste basse parce que nous choisissons les serveurs d’appel selon l’endroit où vous êtes tous les deux.',
      'Contrairement à d’autres sites pour **chatter en ligne**, ici les pourboires font naturellement partie du flux. Si tu as apprécié le moment avec quelqu’un, tu le dis d’un bouton. Si on t’aide, tu le reconnais sans ouvrir une autre appli.',
      'L’interface est en français, les messages du système sont en français, les emojis et stickers se gèrent en français. Pas de traductions maladroites ni de boutons à moitié en anglais. C’est pensé pour les francophones.',
      'Si tu ne comptes entrer chatter qu’une seule fois, tu n’as même pas besoin de laisser ton vrai nom. Tu mets un pseudo quelconque et tu es dedans.',
    ],
    faqs: [
      {
        q: 'Combien de personnes peuvent chatter en ligne à la fois dans un salon ?',
        a: 'Le salon est pensé pour du un-à-un (deux personnes). Si tu as besoin de chatter en ligne avec plus de monde, mieux vaut ouvrir plusieurs salons ou utiliser un autre type d’outil.',
      },
      {
        q: 'Est-ce que ça marche pour chatter en ligne entre pays différents ?',
        a: 'Oui. Les appels sont routés par des serveurs en Europe, aux États-Unis et en Amérique du Sud, donc la latence reste basse quelle que soit la destination. Messages et pourboires voyagent instantanément.',
      },
      FAQ_REGISTRO,
      FAQ_MOVIL,
      FAQ_NAVEGADOR,
    ],
  },
  'chat-en-espanol': {
    label: 'Chat en espagnol',
    h1: 'Chat en espagnol',
    metaTitle: 'Chat en espagnol - Salons de chat privés - Tiptalk',
    metaDescription:
      'Chat en espagnol sans inscription, sans installation. Salon privé avec vidéo, voix et pourboires. Pour les hispanophones où qu’ils soient.',
    intro:
      '**Chat en espagnol** pour les hispanophones — l’interface, les messages et les emojis. Tout est pensé pour eux.',
    paragraphs: [
      'tiptalk.chat fonctionne entièrement en espagnol. L’interface, les notifications, le formulaire de création de salon. Tout est pensé pour qui parle espagnol, quel que soit le pays. Ce n’est pas une traduction à moitié faite : c’est écrit en espagnol d’origine.',
      'Comme le salon se partage par lien, peu importe que l’autre personne soit dans un autre fuseau horaire. Vous vous connectez tous les deux, vous parlez et vous fermez. La différence avec d’autres chats, c’est qu’ici tu n’as pas à te battre avec des menus traduits par une IA ou des instructions restées en anglais.',
      'Ça sert aussi bien à discuter en famille, à un cours particulier à distance, à parler avec quelqu’un rencontré sur un autre réseau, ou à donner des consultations avec pourboires. Le **chat en espagnol** s’adapte à n’importe quel usage car les outils sont les mêmes : texte, voix, vidéo, pourboires.',
      'Pour les créateurs hispanophones, ouvrir son propre **chat en espagnol** règle un problème courant : beaucoup de grandes plateformes sont américaines et leur système de paiement n’accepte pas facilement les comptes espagnols ou latino-américains. Ici, les encaissements se font sur des comptes européens et américains sans piège.',
      'La monnaie virtuelle (Tipsys) s’affiche en euros car c’est naturel en Espagne. Si tu vis en Amérique latine, tu peux convertir mentalement : 1 € = 8 Tipsys environ. Les retraits peuvent se faire vers des comptes de plusieurs pays.',
      'Les messages du système à l’intérieur du salon sont aussi en espagnol : « Carlos a rejoint le salon », « Salon fermé par l’hôte », « Tu as reçu un pourboire de 2 € ». De petits détails qui rendent l’expérience cohérente.',
      'Il n’y a aucune restriction par pays pour ouvrir un salon. Tu peux être à Madrid, à Buenos Aires, à Mexico ou à Caracas. Le service fonctionne pareil et les serveurs sont choisis pour minimiser la latence depuis l’endroit où tu es.',
    ],
    faqs: [
      {
        q: 'Le chat en espagnol fonctionne-t-il depuis l’Amérique latine ?',
        a: 'Oui, sans restrictions. Les serveurs d’appel sont répartis entre l’Europe, les États-Unis et l’Amérique du Sud, donc la qualité reste bonne quel que soit le pays.',
      },
      {
        q: 'Puis-je recevoir des pourboires sur mon chat en espagnol si je vis au Mexique ou en Argentine ?',
        a: 'Oui, tant que tu as un compte bancaire acceptant les virements internationaux. Le retrait passe par Stripe Connect, qui opère dans la plupart des pays hispanophones.',
      },
      FAQ_REGISTRO,
      FAQ_PRECIO,
      FAQ_PRIVACIDAD,
    ],
  },
  'chat-espana': {
    label: 'Chat Espagne',
    h1: 'Chat pour l’Espagne',
    metaTitle: 'Chat Espagne - Chat privé - Tiptalk',
    metaDescription:
      'Chat privé en espagnol pour l’Espagne. Vidéo et voix HD depuis le navigateur. Crée ton salon gratuitement et partage le lien.',
    intro:
      'Un **chat Espagne** simple : sans téléchargement, en espagnol, avec des serveurs en Europe pour que ce soit rapide.',
    paragraphs: [
      'Si tu es en Espagne et que tu veux un salon de **chat Espagne** sans télécharger d’appli, tiptalk.chat te l’ouvre en quelques secondes. Ça marche sur n’importe quel mobile, n’importe quel ordinateur, avec n’importe quel navigateur moderne.',
      'Pas besoin de s’inscrire ni de laisser son numéro. Tu mets un pseudo, tu mets le nom du salon et tu as déjà le lien à partager. Les gens qui entrent depuis le lien peuvent aussi arriver en tant qu’invités — sans les obliger à s’inscrire.',
      'Les appels transitent par des serveurs en Europe, donc la latence est basse entre l’Espagne et la plus grande partie du continent. Un appel Madrid-Barcelone passe par là, tout près, pas par la Californie comme avec d’autres services.',
      'Pour les créateurs en **chat Espagne**, la plateforme accepte les comptes bancaires espagnols et européens sans supplément. Le retrait des pourboires arrive comme un virement normal sur ton compte, quelle que soit ta banque.',
      'Les Tipsys (la monnaie virtuelle) sont libellés en euros, la monnaie qui a du sens pour les utilisateurs espagnols. Pas de conversions bizarres : si tu reçois 50 € en Tipsys, tu retires 50 € (moins la commission).',
      'En matière de conformité, tiptalk.chat opère sous la législation de l’UE — RGPD pour les données personnelles, TVA le cas échéant, réglementation des services numériques. Ce n’est pas un service obscur en marge : c’est une entreprise espagnole avec ses papiers en règle.',
      'Pour un usage particulier en **chat Espagne** — un appel avec un ami, un cours, une conversation avec quelqu’un rencontré sur un autre réseau — ça fonctionne sans plus. Pas besoin de compte, pas besoin de rien.',
    ],
    faqs: [
      {
        q: 'Puis-je recevoir des pourboires sur mon compte bancaire espagnol ?',
        a: 'Oui. Les retraits passent par Stripe Connect, qui accepte les comptes espagnols (IBAN) sans problème. Le virement arrive en SEPA en 1 à 2 jours ouvrés.',
      },
      {
        q: 'Faut-il payer la TVA sur les pourboires reçus ?',
        a: 'Les pourboires sont des revenus personnels et, à ce titre, imposables à l’impôt sur le revenu. La TVA dépend de ton statut d’indépendant ou non. Pour un usage occasionnel sans facturation, aucune TVA n’est en jeu.',
      },
      FAQ_REGISTRO,
      FAQ_PRECIO,
      FAQ_PRIVACIDAD,
    ],
  },
  'chat-hablahispana': {
    label: 'Chat hispanophone',
    h1: 'Chat pour la communauté hispanophone',
    metaTitle: 'Chat hispanophone - Salons de chat privés - Tiptalk',
    metaDescription:
      'Salon de chat pour la communauté hispanophone. Espagne et Amérique latine au même endroit, sans inscription, avec vidéo et pourboires.',
    intro:
      '**Chat hispanophone** sans barrières : Espagne, Mexique, Argentine, Colombie, Chili, tout dans le même salon.',
    paragraphs: [
      'C’est pour la communauté **hispanophone** en général — Espagne, Mexique, Argentine, Colombie, Chili et tout ce qu’il y a entre les deux. Peu importe d’où tu viens : le salon est le même pour tout le monde.',
      'tiptalk.chat charge vite depuis n’importe quel pays hispanophone. Les serveurs vidéo choisissent le plus proche et la voix reste claire. Une conversation Mexique-Espagne passe par des serveurs transatlantiques optimisés, pas par un point unique au milieu qui ajoute de la latence.',
      'Si tu organises quelque chose entre des gens de plusieurs pays, tu partages simplement le lien et tout le monde arrive au même endroit sans rien installer. C’est l’avantage d’être sur le web : peu importe le téléphone de chacun.',
      'Le **chat hispanophone** est particulièrement utile pour les créateurs à l’audience dispersée. Si tu as des abonnés dans plusieurs pays hispanophones, ouvrir un salon leur donne un point de rencontre commun sans avoir à se battre avec des plateformes qui ne marchent que dans un seul.',
      'Les pourboires en euros sont faciles à comprendre depuis l’Espagne, mais les utilisateurs d’Amérique latine les voient et les convertissent mentalement dans leur monnaie locale. La conversion en peso/dollar/bolívar/sol dépend de la banque émettrice au moment du paiement.',
      'Côté ton, la plateforme utilise un espagnol neutre : le « tú » comme pronom, des formes verbales comprises aussi bien en Espagne qu’en Amérique latine, sans expressions trop régionales. L’idée, c’est que ce soit confortable pour tout hispanophone.',
      'Pour une conversation entre deux personnes de pays différents, le **chat hispanophone** fonctionne comme n’importe quel autre salon : texte, voix, vidéo et pourboires. La distance géographique ne change rien à ce que tu peux faire à l’intérieur.',
    ],
    faqs: [
      {
        q: 'Puis-je ouvrir un chat hispanophone avec des gens de différents pays ?',
        a: 'Oui. Le salon accueille qui a le lien, peu importe d’où il se connecte. Les appels sont routés pour minimiser la latence même si les participants sont sur des continents différents.',
      },
      {
        q: 'La monnaie des pourboires fonctionne-t-elle en Amérique latine ?',
        a: 'Les pourboires se gèrent en Tipsys, équivalents à des euros (1 € = 8 Tipsys). Qui achète des Tipsys depuis l’Amérique latine paie l’équivalent dans sa monnaie locale selon le taux du moment.',
      },
      FAQ_REGISTRO,
      FAQ_PRIVACIDAD,
      FAQ_NAVEGADOR,
    ],
  },
  'chat-gratis': {
    label: 'Chat gratuit',
    h1: 'Chat gratuit',
    metaTitle: 'Chat gratuit - Chat privé - Tiptalk',
    metaDescription:
      'Chat gratuit sans inscription. Crée un salon privé avec texte, voix et vidéo en moins d’une minute. Sans engagement, sans coûts cachés.',
    intro:
      'Un vrai **chat gratuit** : sans carte, sans période d’essai, sans surprises sur la facture.',
    paragraphs: [
      'Créer et utiliser un salon sur tiptalk.chat est **gratuit**. Sans carte, sans essai qui se transforme en abonnement, sans aucun coût caché. C’est le plus important : l’outil de base ne coûte pas d’argent, ni maintenant ni plus tard.',
      'La seule chose payante, ce sont les pourboires — et c’est optionnel. Si tu veux juste chatter avec quelqu’un, lui envoyer des photos et parler en vidéo, il n’y a jamais rien à payer. Ni à la semaine, ni au mois, ni à l’année.',
      'Si à un moment tu veux recevoir des pourboires, tu connectes un compte et tu commences à les encaisser. Jusque-là, tout est **gratuit**. Et même quand tu commences à recevoir des pourboires, le salon reste gratuit : le coût, c’est seulement la commission sur ce que tu encaisses.',
      'Contrairement à beaucoup de sites de chat gratuit couverts d’astérisques, ici il n’y a pas de limite de minutes, ni de « gratuit jusqu’à 5 messages », ni de « premier mois gratuit puis 9,99 ». C’est gratuit au sens honnête du mot.',
      'Pour les créateurs qui débutent, c’est important : tu peux tester le modèle sans risque. Tu ouvres ton salon, tu mets ton lien en bio, et tu vois si ça marche. Sinon, tu n’as rien perdu. Si ça marche, tu ne paies de commission que lorsqu’il y a des pourboires.',
      'Nous n’affichons pas de pub dans le chat et ne vendons pas de données. Le modèle économique, c’est la commission sur les pourboires. Ça signifie que si personne n’encaisse, nous non plus — les intérêts sont alignés.',
      'Le **chat gratuit** sert à tout : une session entre amis, un cours particulier, une conversation avec un client, un appel avec la famille qui vit loin. L’outil est le même ; ce qui change, c’est l’usage que tu en fais.',
    ],
    faqs: [
      {
        q: 'Jusqu’à quand le chat est-il gratuit ?',
        a: 'C’est gratuit pour toujours. Il n’y a ni période d’essai ni offre premium cachée. L’usage de base (chatter, appeler, vidéo) est gratuit indéfiniment.',
      },
      {
        q: 'Y a-t-il un coût caché si j’ouvre mon salon ?',
        a: 'Non. Créer et maintenir des salons est sans coût. Il n’y a qu’une commission (30 %) sur les pourboires que tu reçois, appliquée à l’encaissement, pas à l’ouverture du salon.',
      },
      FAQ_PRECIO,
      FAQ_REGISTRO,
      FAQ_PRIVACIDAD,
    ],
  },
  'ganar-dinero-chat': {
    label: 'Gagner de l’argent au chat',
    h1: 'Gagner de l’argent avec un chat',
    metaTitle: 'Gagner de l’argent au chat - Gagner de l’argent au chat - Tiptalk',
    metaDescription:
      'Comment gagner de l’argent avec un chat privé. Reçois des pourboires en temps réel de ton audience. Salon gratuit sur tiptalk.chat.',
    intro:
      'Pour **gagner de l’argent avec un chat**, il faut d’abord avoir quelque chose à offrir. Ensuite, un outil sans friction pour encaisser. C’est tiptalk.chat.',
    paragraphs: [
      'Si ce que tu sais bien faire, c’est parler — écouter, conseiller, encourager, raconter — un chat privé peut être une voie simple pour **gagner de l’argent**. tiptalk.chat le monte pour toi : le salon, le système de pourboires et la conversion en euros.',
      'Tu ouvres ton salon, tu partages le lien à qui te suit (Instagram, Twitter, TikTok, ce que tu utilises) et chaque personne qui entre peut te laisser des pourboires. Tu n’as pas à respecter d’horaire ni à rester connecté toute la journée.',
      'Tu ouvres le salon quand tu peux, tu t’occupes de qui entre et tu encaisses ce qui s’est accumulé. Ça donne une énorme flexibilité : si tu n’as qu’une heure par jour, cette heure peut être productive sans être attaché à un planning fixe.',
      'Pour **gagner de l’argent en chattant** de façon durable, il y a trois clés : une audience qui te connaît, un horaire plus ou moins prévisible (même informel) et un canal pour promouvoir ton salon quand tu vas être dedans.',
      'La commission de la plateforme est de 30 % sur les pourboires. Ça veut dire que si tu reçois 100 € en une semaine, tu retires 70 €. Ça paraît élevé comparé à un emploi classique, mais comparé aux grandes applis de créateurs (qui prennent 50-60 % dans bien des cas), c’est compétitif.',
      'Des profils très différents gagnent de l’argent sur tiptalk.chat : des thérapeutes qui font de courtes consultations, des coachs sportifs qui donnent des conseils, des profs de langues en sessions rapides, des gens qui savent simplement écouter et que l’on paie pour parler avec eux.',
      'Le **gagner de l’argent au chat** ne se fait pas du jour au lendemain. Mais comme créer le salon ne coûte rien et qu’il n’y a aucun risque financier, tu peux l’essayer en parallèle de ce que tu fais déjà. Si ça marche, tu montes en puissance. Sinon, tu ne perds rien.',
    ],
    faqs: [
      {
        q: 'Peut-on vraiment gagner de l’argent avec un chat ?',
        a: 'Oui, si tu as quelque chose à offrir (savoir, empathie, divertissement) et une audience. Ce n’est pas de l’argent facile ni rapide, mais c’est un vrai canal pour qui a déjà des abonnés sur d’autres réseaux.',
      },
      {
        q: 'Combien gagne-t-on en moyenne avec un chat de pourboires ?',
        a: 'Ça dépend totalement de la taille de l’audience et de la régularité. Certains tirent 20-50 € par semaine de petits pourboires, et d’autres, avec de grosses audiences, tirent des centaines par jour. Il n’y a aucune garantie.',
      },
      FAQ_PROPINAS,
      FAQ_PRECIO,
      FAQ_REGISTRO,
    ],
  },
  'gana-dinero-chateando': {
    label: 'Gagne de l’argent en chattant',
    h1: 'Gagne de l’argent en chattant',
    metaTitle: 'Gagne de l’argent en chattant - Gagner de l’argent en chattant - Tiptalk',
    metaDescription:
      'Gagne de l’argent en chattant avec ton audience. Pourboires en direct, sans passerelles. Crée ton salon sur tiptalk.chat et commence aujourd’hui.',
    intro:
      '**Gagne de l’argent en chattant** sans monter une entreprise, sans gérer les paiements un par un. Salon prêt, pourboires intégrés, retraits réguliers.',
    paragraphs: [
      'Pour **gagner de l’argent en chattant**, tu n’as pas besoin de monter une entreprise ni de gérer les paiements un par un. tiptalk.chat te donne le salon, le système de pourboires et la conversion en euros pour que tu encaisses.',
      'L’économie est simple : ton audience achète des Tipsys (1 € = 8 Tipsys), on te les envoie dans le chat et tu les retires une fois le minimum atteint (300 Tipsys = 30 €). Pas d’étapes intermédiaires ni d’encaissements en attente qui se bloquent.',
      'Si tu as déjà des abonnés, ce que tu fais, c’est leur offrir un canal direct pour te soutenir sans passer par des abonnements compliqués. C’est un palier intermédiaire entre le « follow gratuit » et le « Patreon récurrent ».',
      'Pour les petites ou moyennes audiences, ça marche parce que le coût d’entrée pour l’abonné est bas : 25 centimes pour un petit pourboire, sans engagement mensuel. Ça abaisse la barrière psychologique qu’ont d’autres modèles.',
      '**Gagne de l’argent en chattant** aux horaires que tu choisis. Le salon s’ouvre quand tu veux et se ferme quand tu as fini. Aucun engagement de « disponibilité 24/7 » ni horaires fixes affichés.',
      'Certains combinent tiptalk.chat avec d’autres sources de revenus. Par exemple : un créateur qui a un OnlyFans pour du contenu enregistré, et qui ouvre tiptalk.chat pour des sessions en direct où l’abonné paie pour te parler en personne. Ce sont des marchés différents mais compatibles.',
      'Nous ne vendons pas de « deviens riche avec un chat ». C’est un outil pour convertir du temps de conversation en revenus quand tu as une audience prête à te payer pour ça. Le succès dépend de toi, pas de la plateforme.',
    ],
    faqs: [
      {
        q: 'Faut-il avoir des abonnés pour gagner de l’argent en chattant ?',
        a: 'L’idéal est d’avoir un canal où promouvoir ton salon — Instagram, Twitter, TikTok, une newsletter. Sans une audience minimale, il est difficile que des gens entrent dans ton salon. L’outil ne génère pas de trafic à lui seul.',
      },
      {
        q: 'Quand suis-je payé pour les pourboires que je reçois ?',
        a: 'Les pourboires entrent dans ton porte-monnaie à l’instant. Pour les retirer sur ton compte bancaire, tu dois atteindre le minimum (300 Tipsys / 30 €) et demander l’encaissement. Il arrive en 1 à 2 jours ouvrés.',
      },
      FAQ_PROPINAS,
      FAQ_PRECIO,
      FAQ_REGISTRO,
    ],
  },
  'chat-espanol-gratis': {
    label: 'Chat espagnol gratuit',
    h1: 'Chat en espagnol gratuit',
    metaTitle: 'Chat espagnol gratuit - Salons de chat privés - Tiptalk',
    metaDescription:
      'Chat en espagnol, totalement gratuit. Sans inscription, sans installation, avec vidéo et voix. Crée ton salon privé sur tiptalk.chat.',
    intro:
      'Un **chat espagnol gratuit** pour de vrai : ni e-mail, ni carte, ni « première semaine gratuite puis tu paies ».',
    paragraphs: [
      'Voici ce que nous promettons : **chat en espagnol gratuit**, sans rien payer, sans donner ton e-mail. Tu mets un pseudo et tu es dedans.',
      'L’interface est directe : une zone pour écrire, un bouton pour envoyer photo ou vidéo, deux pour lancer un appel voix ou vidéo. Elle ne te noie pas sous les menus, et aucun assistant ne te pose de questions pour mieux te vendre quelque chose.',
      'Si ensuite tu veux un compte pour que ton salon soit associé à toi, tu t’inscris en une minute. Sinon, tu restes en invité aussi longtemps que tu veux. Le **chat espagnol gratuit** fonctionne exactement pareil avec ou sans compte pour l’usage de base.',
      'Contrairement à d’autres sites de « chat espagnol gratuit » où tu finis sur un forum couvert de pop-ups publicitaires, ici il n’y a pas de pub. L’interface est propre parce que le modèle économique, c’est la commission sur les pourboires, pas la publicité.',
      'Les appels en **chat espagnol gratuit** sont illimités. Tu peux parler une heure, deux heures, autant que ta connexion tient. Il n’y a pas de crédits qui se consomment ni de minutes comptées.',
      'La seule chose qui se passe au bout de 24 heures, c’est que le salon se ferme tout seul et que tout s’efface. C’est par confidentialité — pas à cause d’une restriction « version gratuite ». Si tu veux continuer à parler, tu ouvres un autre salon du même nom, tu partages le nouveau lien et voilà.',
      'Pour un usage occasionnel ou intensif, c’est pareil. Tu ne passes jamais à un plan premium : l’outil est celui que tu vois dès le premier instant.',
    ],
    faqs: [
      {
        q: 'Le chat espagnol gratuit a-t-il de la publicité ?',
        a: 'Non. L’interface n’affiche pas de publicité dans les salons. L’activité se soutient grâce à la commission sur les pourboires envoyés.',
      },
      {
        q: 'Quelle est la limite du plan gratuit ?',
        a: 'Il n’y a ni plan gratuit ni plan payant, il n’y a qu’un seul plan. Les salons sont gratuits et se ferment au bout de 24 heures ou quand le créateur le souhaite, pas à cause d’une limitation payante.',
      },
      FAQ_PRECIO,
      FAQ_REGISTRO,
      FAQ_PRIVACIDAD,
    ],
  },
  'chat-espanol-free': {
    label: 'Chat espagnol free',
    h1: 'Chat espagnol free',
    metaTitle: 'Chat espagnol free - Chat privé - Tiptalk',
    metaDescription:
      'Free Spanish chat — sans coût, sans inscription. Salon privé avec voix et vidéo depuis le navigateur. Pensé pour les hispanophones.',
    intro:
      '**Chat espagnol free** — gratuit, en espagnol, avec vidéo et pourboires au même endroit.',
    paragraphs: [
      'Pour qui cherche un **chat en espagnol « free »** — c’est-à-dire totalement gratuit et sans barrières — tiptalk.chat est sans doute le chemin le plus court. Tu l’ouvres, tu l’utilises, on ne te demande rien.',
      'Il n’y a ni période d’essai ni offre premium cachée. La partie chatter et appeler est **free** pour toujours. Nous n’allons pas sortir dans six mois un « plan pro » qui limite ce que tu peux faire aujourd’hui.',
      'La seule chose qui coûte de l’argent, ce sont les pourboires, car par définition c’est de l’argent. Mais c’est optionnel et réservé à qui veut en envoyer. La conversation principale reste **free**.',
      'Côté fonctionnalités, le **chat espagnol free** de tiptalk.chat inclut tout ce que tu attends : messages illimités, photos, vidéos courtes, appels vocaux, appels vidéo, option de pourboires. Il n’y a pas de version réduite pour les utilisateurs gratuits.',
      'Ça contraste avec d’autres plateformes de chat qui ont peu à peu rogné ce qu’on peut faire « gratuitement » pour pousser vers des offres payantes. Ici, non : ce qui marche aujourd’hui continuera de marcher, et on ajoute des choses sans retirer les bases.',
      'Si tu compares tiptalk.chat aux applis de messagerie classiques (WhatsApp, Telegram), la différence clé, c’est qu’ici le salon est éphémère et n’exige pas d’échange de numéros. **Free** non seulement de coût, mais de friction.',
      'Une note culturelle : le terme « free », on l’emploie ici parce que beaucoup cherchent le chat espagnol sans le mot « gratis », et on veut être trouvé quand même. L’expérience est la même quel que soit le mot que tu utilises.',
    ],
    faqs: [
      {
        q: 'Free Spanish chat, ça veut dire que c’est totalement gratuit ?',
        a: 'Oui. Créer un salon, chatter, appeler et envoyer des photos, tout est free. Seuls les pourboires, qui sont des transferts d’argent réel, ont un coût pour qui les envoie.',
      },
      {
        q: 'Y aura-t-il une offre payante à l’avenir ?',
        a: 'Nous n’avons pas prévu d’ajouter un palier payant. Le modèle économique, c’est la commission sur les pourboires, et ça suffit à maintenir l’outil sans avoir à facturer les utilisateurs de base.',
      },
      FAQ_PRECIO,
      FAQ_REGISTRO,
      FAQ_NAVEGADOR,
    ],
  },
  'chat-espanol-sin-registro': {
    label: 'Chat espagnol sans inscription',
    h1: 'Chat en espagnol sans inscription',
    metaTitle: 'Chat espagnol sans inscription - Salons de chat privés - Tiptalk',
    metaDescription:
      'Chat en espagnol sans inscription. Crée un salon, partage le lien et chatte. On ne demande ni compte ni téléphone.',
    intro:
      '**Chat espagnol sans inscription** : tu mets un pseudo, tu ouvres le salon, tu partages le lien. Rien de plus.',
    paragraphs: [
      'Une des choses que vous demandiez, c’était de ne pas avoir à s’inscrire pour quoi que ce soit. C’est fait : n’importe qui peut ouvrir un salon avec un simple pseudo. tiptalk.chat est sans doute le **chat espagnol sans inscription** le plus direct que tu trouveras.',
      'La seule chose enregistrée, c’est ce pseudo — pas d’e-mail, pas de téléphone, pas de vrai nom. Et il disparaît avec le salon à sa fermeture. Il n’y a pas de base de données avec tes informations qui attend de fuiter un jour.',
      'Si plus tard tu veux recevoir des pourboires, là oui tu dois enregistrer un compte. Mais pour chatter et appeler, un nom suffit. C’est important : le **chat espagnol sans inscription** est réel pour le flux principal, pas un leurre qui te mène à une inscription forcée.',
      'La raison pour laquelle beaucoup de plateformes obligent à s’inscrire, c’est pour construire un profil de l’utilisateur et le monétiser (vente de données, pubs ciblées, etc.). tiptalk.chat n’a pas besoin de ça, car il prend une commission sur les pourboires — il n’a pas besoin de savoir qui tu es pour gagner sa vie.',
      'Si tu ne vas utiliser le **chat espagnol sans inscription** qu’une seule fois — un appel avec quelqu’un, une conversation rapide — ça n’a pas de sens de donner tes données. L’idée, c’est d’entrer, parler et sortir, comme quand tu entres dans une librairie : pas besoin de se présenter.',
      'Quand tu entres en invité dans un salon que quelqu’un t’a partagé, on ne te demande pas non plus de t’inscrire. Juste le pseudo. C’est important pour qui organise le salon : il peut inviter des gens sans les obliger à s’inscrire, ce qui réduit la friction au minimum.',
      'Pour les cas où tu préfères quand même avoir un compte — par exemple recevoir des pourboires ou que ton nom apparaisse de façon cohérente — l’inscription est optionnelle. Mais jamais obligatoire pour l’usage de base du **chat espagnol sans inscription**.',
    ],
    faqs: [
      {
        q: 'Est-il vraiment possible d’utiliser le chat sans s’inscrire ?',
        a: 'Oui, sans piège. Tu peux ouvrir un salon avec un simple pseudo et un nom de salon. Qui entre depuis ton lien n’a pas non plus besoin de s’inscrire : il met son pseudo et entre en invité.',
      },
      {
        q: 'Qu’est-ce que je perds si j’utilise le chat sans inscription ?',
        a: 'Sans inscription, tu ne peux pas recevoir de pourboires (cela nécessite de connecter un compte d’encaissement) et nous ne pouvons pas associer les salons à toi d’une session à l’autre. Pour tout le reste (chatter, appeler, envoyer des photos), tu ne perds rien.',
      },
      FAQ_PRIVACIDAD,
      FAQ_PRECIO,
      FAQ_MOVIL,
    ],
  },
  'chat-argentina': {
    label: 'Chat Argentine',
    h1: 'Chat pour l’Argentine',
    metaTitle: 'Chat Argentine - Gagner de l’argent au chat - Tiptalk',
    metaDescription:
      'Salon de chat privé pour l’Argentine. Texte, voix, vidéo et pourboires depuis le navigateur. Sans inscription. Crée ton salon sur tiptalk.chat.',
    intro:
      '**Chat Argentine** sans téléchargement, avec pourboires intégrés. Le salon s’ouvre depuis le navigateur, quel que soit l’appareil.',
    paragraphs: [
      'Si tu es en Argentine ou que tu veux un salon de **chat Argentine** avec des gens de là-bas, tiptalk.chat fonctionne aussi bien. Le salon se crée depuis le navigateur sur n’importe quel appareil : ordinateur portable, tablette ou mobile.',
      'Comme chaque salon se partage par lien, il vaut aussi bien pour discuter avec quelqu’un de la même ville qu’avec quelqu’un à l’autre bout du monde. La latence reste basse car nous choisissons le serveur d’appel le plus proche de celui qui se connecte — important pour une région comme l’Amérique du Sud.',
      'Pour qui est à Buenos Aires ou dans d’autres villes de l’Argentine, l’expérience de chat est la même que depuis n’importe où ailleurs dans le pays. Pas besoin d’une connexion particulièrement bonne : le système baisse la qualité de la vidéo si le réseau faiblit, en gardant la voix claire.',
      'Si tu reçois des pourboires dans un **chat Argentine**, les Tipsys s’accumulent dans ton porte-monnaie et tu les retires sur ton compte quand tu veux. Ça vaut pour les créateurs, les professionnels et quiconque veut se faire payer son temps de conversation. Le retrait arrive sur des comptes internationaux qui acceptent les virements en euros.',
      'Pour un usage particulier — un appel avec la famille qui vit en Argentine, un cours avec quelqu’un rencontré en ligne, une longue discussion — le **chat Argentine** est ce qu’il y a de plus commode : il n’oblige pas l’autre personne à installer quoi que ce soit. Juste le lien.',
      'Les conversations dans le **chat Argentine** ne sont pas stockées au-delà de 24 heures. Quand tu fermes le salon (ou quand il expire automatiquement), tout ce qui a été envoyé dedans s’efface. Ça inclut les photos, les vidéos, les messages et les fichiers.',
      'Comme le service est web et non une appli, il n’y a pas de versions à mettre à jour ni de problèmes de compatibilité. Si ton navigateur fonctionne, le **chat Argentine** fonctionne. Et tous les navigateurs modernes (Chrome, Safari, Firefox, Edge) sont compatibles.',
    ],
    faqs: [
      {
        q: 'Le chat Argentine fonctionne-t-il bien avec les connexions mobiles ?',
        a: 'Oui. Le système adapte la qualité de la vidéo au réseau disponible. Avec une 4G normale en Argentine, un appel vidéo reste stable. Si la connexion est faible, la voix continue de fonctionner même si la vidéo baisse.',
      },
      {
        q: 'Puis-je recevoir des pourboires sur mon chat si je vis en Argentine ?',
        a: 'Oui, tant que tu as un compte bancaire acceptant les virements internationaux ou un compte dans un pays pris en charge par Stripe Connect. La plupart des pays hispanophones sont couverts.',
      },
      FAQ_REGISTRO,
      FAQ_PRECIO,
      FAQ_PRIVACIDAD,
    ],
  },
  'chat-brasil': {
    label: 'Chat Brésil',
    h1: 'Chat pour le Brésil',
    metaTitle: 'Chat Brésil - Salons de chat privés - Tiptalk',
    metaDescription:
      'Salon de chat privé pour le Brésil. Texte, voix, vidéo et pourboires depuis le navigateur. Sans inscription. Crée ton salon sur tiptalk.chat.',
    intro:
      '**Chat Brésil** sans téléchargement, avec pourboires intégrés. Le salon s’ouvre depuis le navigateur, quel que soit l’appareil.',
    paragraphs: [
      'Si tu es au Brésil ou que tu veux un salon de **chat Brésil** avec des gens de là-bas, tiptalk.chat fonctionne aussi bien. Le salon se crée depuis le navigateur sur n’importe quel appareil : ordinateur portable, tablette ou mobile.',
      'Comme chaque salon se partage par lien, il vaut aussi bien pour discuter avec quelqu’un de la même ville qu’avec quelqu’un à l’autre bout du monde. La latence reste basse car nous choisissons le serveur d’appel le plus proche de celui qui se connecte — important pour une région comme l’Amérique du Sud.',
      'Pour qui se trouve dans différentes villes du Brésil, l’expérience est uniforme. Pas besoin d’une connexion particulièrement bonne : le système baisse la qualité de la vidéo si le réseau faiblit, en gardant la voix claire.',
      'Si tu reçois des pourboires dans un **chat Brésil**, les Tipsys s’accumulent dans ton porte-monnaie et tu les retires sur ton compte quand tu veux. Ça vaut pour les créateurs, les professionnels et quiconque veut se faire payer son temps de conversation. Le retrait arrive sur des comptes internationaux qui acceptent les virements en euros.',
      'Pour un usage particulier — un appel avec la famille qui vit au Brésil, un cours avec quelqu’un rencontré en ligne, une longue discussion — le **chat Brésil** est ce qu’il y a de plus commode : il n’oblige pas l’autre personne à installer quoi que ce soit. Juste le lien.',
      'Les conversations dans le **chat Brésil** ne sont pas stockées au-delà de 24 heures. Quand tu fermes le salon (ou quand il expire automatiquement), tout ce qui a été envoyé dedans s’efface. Ça inclut les photos, les vidéos, les messages et les fichiers.',
      'Comme le service est web et non une appli, il n’y a pas de versions à mettre à jour ni de problèmes de compatibilité. Si ton navigateur fonctionne, le **chat Brésil** fonctionne. Et tous les navigateurs modernes (Chrome, Safari, Firefox, Edge) sont compatibles.',
    ],
    faqs: [
      {
        q: 'Le chat Brésil fonctionne-t-il bien avec les connexions mobiles ?',
        a: 'Oui. Le système adapte la qualité de la vidéo au réseau disponible. Avec une 4G normale au Brésil, un appel vidéo reste stable. Si la connexion est faible, la voix continue de fonctionner même si la vidéo baisse.',
      },
      {
        q: 'Puis-je recevoir des pourboires sur mon chat si je vis au Brésil ?',
        a: 'Oui, tant que tu as un compte bancaire acceptant les virements internationaux ou un compte dans un pays pris en charge par Stripe Connect. La plupart des pays hispanophones sont couverts.',
      },
      FAQ_REGISTRO,
      FAQ_PRECIO,
      FAQ_PRIVACIDAD,
    ],
  },
  'chat-bogota': {
    label: 'Chat Bogotá',
    h1: 'Chat pour Bogotá',
    metaTitle: 'Chat Bogotá - Chat privé - Tiptalk',
    metaDescription:
      'Salon de chat privé pour Bogotá. Texte, voix, vidéo et pourboires depuis le navigateur. Sans inscription. Crée ton salon sur tiptalk.chat.',
    intro:
      '**Chat Bogotá** sans téléchargement, avec pourboires intégrés. Le salon s’ouvre depuis le navigateur, quel que soit l’appareil.',
    paragraphs: [
      'Si tu es à Bogotá ou que tu veux un salon de **chat Bogotá** avec des gens de là-bas, tiptalk.chat fonctionne aussi bien. Le salon se crée depuis le navigateur sur n’importe quel appareil : ordinateur portable, tablette ou mobile.',
      'Comme chaque salon se partage par lien, il vaut aussi bien pour discuter avec quelqu’un de la même ville qu’avec quelqu’un à l’autre bout du monde. La latence reste basse car nous choisissons le serveur d’appel le plus proche de celui qui se connecte — important pour une région comme l’Amérique du Sud.',
      'Pour qui se trouve dans différents quartiers de Bogotá, l’expérience est uniforme. Pas besoin d’une connexion particulièrement bonne : le système baisse la qualité de la vidéo si le réseau faiblit, en gardant la voix claire.',
      'Si tu reçois des pourboires dans un **chat Bogotá**, les Tipsys s’accumulent dans ton porte-monnaie et tu les retires sur ton compte quand tu veux. Ça vaut pour les créateurs, les professionnels et quiconque veut se faire payer son temps de conversation. Le retrait arrive sur des comptes internationaux qui acceptent les virements en euros.',
      'Pour un usage particulier — un appel avec la famille qui vit à Bogotá, un cours avec quelqu’un rencontré en ligne, une longue discussion — le **chat Bogotá** est ce qu’il y a de plus commode : il n’oblige pas l’autre personne à installer quoi que ce soit. Juste le lien.',
      'Les conversations dans le **chat Bogotá** ne sont pas stockées au-delà de 24 heures. Quand tu fermes le salon (ou quand il expire automatiquement), tout ce qui a été envoyé dedans s’efface. Ça inclut les photos, les vidéos, les messages et les fichiers.',
      'Comme le service est web et non une appli, il n’y a pas de versions à mettre à jour ni de problèmes de compatibilité. Si ton navigateur fonctionne, le **chat Bogotá** fonctionne. Et tous les navigateurs modernes (Chrome, Safari, Firefox, Edge) sont compatibles.',
    ],
    faqs: [
      {
        q: 'Le chat Bogotá fonctionne-t-il bien avec les connexions mobiles ?',
        a: 'Oui. Le système adapte la qualité de la vidéo au réseau disponible. Avec une 4G normale à Bogotá, un appel vidéo reste stable. Si la connexion est faible, la voix continue de fonctionner même si la vidéo baisse.',
      },
      {
        q: 'Puis-je recevoir des pourboires sur mon chat si je vis à Bogotá ?',
        a: 'Oui, tant que tu as un compte bancaire acceptant les virements internationaux ou un compte dans un pays pris en charge par Stripe Connect. La plupart des pays hispanophones sont couverts.',
      },
      FAQ_REGISTRO,
      FAQ_PRECIO,
      FAQ_PRIVACIDAD,
    ],
  },
  'chat-bolivia': {
    label: 'Chat Bolivie',
    h1: 'Chat pour la Bolivie',
    metaTitle: 'Chat Bolivie - Gagner de l’argent en chattant - Tiptalk',
    metaDescription:
      'Salon de chat privé pour la Bolivie. Texte, voix, vidéo et pourboires depuis le navigateur. Sans inscription. Crée ton salon sur tiptalk.chat.',
    intro:
      '**Chat Bolivie** sans téléchargement, avec pourboires intégrés. Le salon s’ouvre depuis le navigateur, quel que soit l’appareil.',
    paragraphs: [
      'Si tu es en Bolivie ou que tu veux un salon de **chat Bolivie** avec des gens de là-bas, tiptalk.chat fonctionne aussi bien. Le salon se crée depuis le navigateur sur n’importe quel appareil : ordinateur portable, tablette ou mobile.',
      'Comme chaque salon se partage par lien, il vaut aussi bien pour discuter avec quelqu’un de la même ville qu’avec quelqu’un à l’autre bout du monde. La latence reste basse car nous choisissons le serveur d’appel le plus proche de celui qui se connecte — important pour une région comme l’Amérique du Sud.',
      'Pour qui est à La Paz ou dans d’autres villes de la Bolivie, l’expérience de chat est la même que depuis n’importe où ailleurs dans le pays. Pas besoin d’une connexion particulièrement bonne : le système baisse la qualité de la vidéo si le réseau faiblit, en gardant la voix claire.',
      'Si tu reçois des pourboires dans un **chat Bolivie**, les Tipsys s’accumulent dans ton porte-monnaie et tu les retires sur ton compte quand tu veux. Ça vaut pour les créateurs, les professionnels et quiconque veut se faire payer son temps de conversation. Le retrait arrive sur des comptes internationaux qui acceptent les virements en euros.',
      'Pour un usage particulier — un appel avec la famille qui vit en Bolivie, un cours avec quelqu’un rencontré en ligne, une longue discussion — le **chat Bolivie** est ce qu’il y a de plus commode : il n’oblige pas l’autre personne à installer quoi que ce soit. Juste le lien.',
      'Les conversations dans le **chat Bolivie** ne sont pas stockées au-delà de 24 heures. Quand tu fermes le salon (ou quand il expire automatiquement), tout ce qui a été envoyé dedans s’efface. Ça inclut les photos, les vidéos, les messages et les fichiers.',
      'Comme le service est web et non une appli, il n’y a pas de versions à mettre à jour ni de problèmes de compatibilité. Si ton navigateur fonctionne, le **chat Bolivie** fonctionne. Et tous les navigateurs modernes (Chrome, Safari, Firefox, Edge) sont compatibles.',
    ],
    faqs: [
      {
        q: 'Le chat Bolivie fonctionne-t-il bien avec les connexions mobiles ?',
        a: 'Oui. Le système adapte la qualité de la vidéo au réseau disponible. Avec une 4G normale en Bolivie, un appel vidéo reste stable. Si la connexion est faible, la voix continue de fonctionner même si la vidéo baisse.',
      },
      {
        q: 'Puis-je recevoir des pourboires sur mon chat si je vis en Bolivie ?',
        a: 'Oui, tant que tu as un compte bancaire acceptant les virements internationaux ou un compte dans un pays pris en charge par Stripe Connect. La plupart des pays hispanophones sont couverts.',
      },
      FAQ_REGISTRO,
      FAQ_PRECIO,
      FAQ_PRIVACIDAD,
    ],
  },
  'chat-buenos-aires': {
    label: 'Chat Buenos Aires',
    h1: 'Chat pour Buenos Aires',
    metaTitle: 'Chat Buenos Aires - Gagner de l’argent au chat - Tiptalk',
    metaDescription:
      'Salon de chat privé pour Buenos Aires. Texte, voix, vidéo et pourboires depuis le navigateur. Sans inscription. Crée ton salon sur tiptalk.chat.',
    intro:
      '**Chat Buenos Aires** sans téléchargement, avec pourboires intégrés. Le salon s’ouvre depuis le navigateur, quel que soit l’appareil.',
    paragraphs: [
      'Si tu es à Buenos Aires ou que tu veux un salon de **chat Buenos Aires** avec des gens de là-bas, tiptalk.chat fonctionne aussi bien. Le salon se crée depuis le navigateur sur n’importe quel appareil : ordinateur portable, tablette ou mobile.',
      'Comme chaque salon se partage par lien, il vaut aussi bien pour discuter avec quelqu’un de la même ville qu’avec quelqu’un à l’autre bout du monde. La latence reste basse car nous choisissons le serveur d’appel le plus proche de celui qui se connecte — important pour une région comme l’Amérique du Sud.',
      'Pour qui se trouve dans différents quartiers de Buenos Aires, l’expérience est uniforme. Pas besoin d’une connexion particulièrement bonne : le système baisse la qualité de la vidéo si le réseau faiblit, en gardant la voix claire.',
      'Si tu reçois des pourboires dans un **chat Buenos Aires**, les Tipsys s’accumulent dans ton porte-monnaie et tu les retires sur ton compte quand tu veux. Ça vaut pour les créateurs, les professionnels et quiconque veut se faire payer son temps de conversation. Le retrait arrive sur des comptes internationaux qui acceptent les virements en euros.',
      'Pour un usage particulier — un appel avec la famille qui vit à Buenos Aires, un cours avec quelqu’un rencontré en ligne, une longue discussion — le **chat Buenos Aires** est ce qu’il y a de plus commode : il n’oblige pas l’autre personne à installer quoi que ce soit. Juste le lien.',
      'Les conversations dans le **chat Buenos Aires** ne sont pas stockées au-delà de 24 heures. Quand tu fermes le salon (ou quand il expire automatiquement), tout ce qui a été envoyé dedans s’efface. Ça inclut les photos, les vidéos, les messages et les fichiers.',
      'Comme le service est web et non une appli, il n’y a pas de versions à mettre à jour ni de problèmes de compatibilité. Si ton navigateur fonctionne, le **chat Buenos Aires** fonctionne. Et tous les navigateurs modernes (Chrome, Safari, Firefox, Edge) sont compatibles.',
    ],
    faqs: [
      {
        q: 'Le chat Buenos Aires fonctionne-t-il bien avec les connexions mobiles ?',
        a: 'Oui. Le système adapte la qualité de la vidéo au réseau disponible. Avec une 4G normale à Buenos Aires, un appel vidéo reste stable. Si la connexion est faible, la voix continue de fonctionner même si la vidéo baisse.',
      },
      {
        q: 'Puis-je recevoir des pourboires sur mon chat si je vis à Buenos Aires ?',
        a: 'Oui, tant que tu as un compte bancaire acceptant les virements internationaux ou un compte dans un pays pris en charge par Stripe Connect. La plupart des pays hispanophones sont couverts.',
      },
      FAQ_REGISTRO,
      FAQ_PRECIO,
      FAQ_PRIVACIDAD,
    ],
  },
  'chat-chile': {
    label: 'Chat Chili',
    h1: 'Chat pour le Chili',
    metaTitle: 'Chat Chili - Salons de chat privés - Tiptalk',
    metaDescription:
      'Salon de chat privé pour le Chili. Texte, voix, vidéo et pourboires depuis le navigateur. Sans inscription. Crée ton salon sur tiptalk.chat.',
    intro:
      '**Chat Chili** sans téléchargement, avec pourboires intégrés. Le salon s’ouvre depuis le navigateur, quel que soit l’appareil.',
    paragraphs: [
      'Si tu es au Chili ou que tu veux un salon de **chat Chili** avec des gens de là-bas, tiptalk.chat fonctionne aussi bien. Le salon se crée depuis le navigateur sur n’importe quel appareil : ordinateur portable, tablette ou mobile.',
      'Comme chaque salon se partage par lien, il vaut aussi bien pour discuter avec quelqu’un de la même ville qu’avec quelqu’un à l’autre bout du monde. La latence reste basse car nous choisissons le serveur d’appel le plus proche de celui qui se connecte — important pour une région comme l’Amérique du Sud.',
      'Pour qui est à Santiago ou dans d’autres villes du Chili, l’expérience de chat est la même que depuis n’importe où ailleurs dans le pays. Pas besoin d’une connexion particulièrement bonne : le système baisse la qualité de la vidéo si le réseau faiblit, en gardant la voix claire.',
      'Si tu reçois des pourboires dans un **chat Chili**, les Tipsys s’accumulent dans ton porte-monnaie et tu les retires sur ton compte quand tu veux. Ça vaut pour les créateurs, les professionnels et quiconque veut se faire payer son temps de conversation. Le retrait arrive sur des comptes internationaux qui acceptent les virements en euros.',
      'Pour un usage particulier — un appel avec la famille qui vit au Chili, un cours avec quelqu’un rencontré en ligne, une longue discussion — le **chat Chili** est ce qu’il y a de plus commode : il n’oblige pas l’autre personne à installer quoi que ce soit. Juste le lien.',
      'Les conversations dans le **chat Chili** ne sont pas stockées au-delà de 24 heures. Quand tu fermes le salon (ou quand il expire automatiquement), tout ce qui a été envoyé dedans s’efface. Ça inclut les photos, les vidéos, les messages et les fichiers.',
      'Comme le service est web et non une appli, il n’y a pas de versions à mettre à jour ni de problèmes de compatibilité. Si ton navigateur fonctionne, le **chat Chili** fonctionne. Et tous les navigateurs modernes (Chrome, Safari, Firefox, Edge) sont compatibles.',
    ],
    faqs: [
      {
        q: 'Le chat Chili fonctionne-t-il bien avec les connexions mobiles ?',
        a: 'Oui. Le système adapte la qualité de la vidéo au réseau disponible. Avec une 4G normale au Chili, un appel vidéo reste stable. Si la connexion est faible, la voix continue de fonctionner même si la vidéo baisse.',
      },
      {
        q: 'Puis-je recevoir des pourboires sur mon chat si je vis au Chili ?',
        a: 'Oui, tant que tu as un compte bancaire acceptant les virements internationaux ou un compte dans un pays pris en charge par Stripe Connect. La plupart des pays hispanophones sont couverts.',
      },
      FAQ_REGISTRO,
      FAQ_PRECIO,
      FAQ_PRIVACIDAD,
    ],
  },
  'chat-colombia': {
    label: 'Chat Colombie',
    h1: 'Chat pour la Colombie',
    metaTitle: 'Chat Colombie - Chat privé - Tiptalk',
    metaDescription:
      'Salon de chat privé pour la Colombie. Texte, voix, vidéo et pourboires depuis le navigateur. Sans inscription. Crée ton salon sur tiptalk.chat.',
    intro:
      '**Chat Colombie** sans téléchargement, avec pourboires intégrés. Le salon s’ouvre depuis le navigateur, quel que soit l’appareil.',
    paragraphs: [
      'Si tu es en Colombie ou que tu veux un salon de **chat Colombie** avec des gens de là-bas, tiptalk.chat fonctionne aussi bien. Le salon se crée depuis le navigateur sur n’importe quel appareil : ordinateur portable, tablette ou mobile.',
      'Comme chaque salon se partage par lien, il vaut aussi bien pour discuter avec quelqu’un de la même ville qu’avec quelqu’un à l’autre bout du monde. La latence reste basse car nous choisissons le serveur d’appel le plus proche de celui qui se connecte — important pour une région comme l’Amérique du Sud.',
      'Pour qui est à Bogotá ou dans d’autres villes de la Colombie, l’expérience de chat est la même que depuis n’importe où ailleurs dans le pays. Pas besoin d’une connexion particulièrement bonne : le système baisse la qualité de la vidéo si le réseau faiblit, en gardant la voix claire.',
      'Si tu reçois des pourboires dans un **chat Colombie**, les Tipsys s’accumulent dans ton porte-monnaie et tu les retires sur ton compte quand tu veux. Ça vaut pour les créateurs, les professionnels et quiconque veut se faire payer son temps de conversation. Le retrait arrive sur des comptes internationaux qui acceptent les virements en euros.',
      'Pour un usage particulier — un appel avec la famille qui vit en Colombie, un cours avec quelqu’un rencontré en ligne, une longue discussion — le **chat Colombie** est ce qu’il y a de plus commode : il n’oblige pas l’autre personne à installer quoi que ce soit. Juste le lien.',
      'Les conversations dans le **chat Colombie** ne sont pas stockées au-delà de 24 heures. Quand tu fermes le salon (ou quand il expire automatiquement), tout ce qui a été envoyé dedans s’efface. Ça inclut les photos, les vidéos, les messages et les fichiers.',
      'Comme le service est web et non une appli, il n’y a pas de versions à mettre à jour ni de problèmes de compatibilité. Si ton navigateur fonctionne, le **chat Colombie** fonctionne. Et tous les navigateurs modernes (Chrome, Safari, Firefox, Edge) sont compatibles.',
    ],
    faqs: [
      {
        q: 'Le chat Colombie fonctionne-t-il bien avec les connexions mobiles ?',
        a: 'Oui. Le système adapte la qualité de la vidéo au réseau disponible. Avec une 4G normale en Colombie, un appel vidéo reste stable. Si la connexion est faible, la voix continue de fonctionner même si la vidéo baisse.',
      },
      {
        q: 'Puis-je recevoir des pourboires sur mon chat si je vis en Colombie ?',
        a: 'Oui, tant que tu as un compte bancaire acceptant les virements internationaux ou un compte dans un pays pris en charge par Stripe Connect. La plupart des pays hispanophones sont couverts.',
      },
      FAQ_REGISTRO,
      FAQ_PRECIO,
      FAQ_PRIVACIDAD,
    ],
  },
  'chat-costa-rica': {
    label: 'Chat Costa Rica',
    h1: 'Chat pour le Costa Rica',
    metaTitle: 'Chat Costa Rica - Gagner de l’argent en chattant - Tiptalk',
    metaDescription:
      'Salon de chat privé pour le Costa Rica. Texte, voix, vidéo et pourboires depuis le navigateur. Sans inscription. Crée ton salon sur tiptalk.chat.',
    intro:
      '**Chat Costa Rica** sans téléchargement, avec pourboires intégrés. Le salon s’ouvre depuis le navigateur, quel que soit l’appareil.',
    paragraphs: [
      'Si tu es au Costa Rica ou que tu veux un salon de **chat Costa Rica** avec des gens de là-bas, tiptalk.chat fonctionne aussi bien. Le salon se crée depuis le navigateur sur n’importe quel appareil : ordinateur portable, tablette ou mobile.',
      'Comme chaque salon se partage par lien, il vaut aussi bien pour discuter avec quelqu’un de la même ville qu’avec quelqu’un à l’autre bout du monde. La latence reste basse car nous choisissons le serveur d’appel le plus proche de celui qui se connecte — important pour une région comme l’Amérique centrale.',
      'Pour qui se trouve dans différentes villes du Costa Rica, l’expérience est uniforme. Pas besoin d’une connexion particulièrement bonne : le système baisse la qualité de la vidéo si le réseau faiblit, en gardant la voix claire.',
      'Si tu reçois des pourboires dans un **chat Costa Rica**, les Tipsys s’accumulent dans ton porte-monnaie et tu les retires sur ton compte quand tu veux. Ça vaut pour les créateurs, les professionnels et quiconque veut se faire payer son temps de conversation. Le retrait arrive sur des comptes internationaux qui acceptent les virements en euros.',
      'Pour un usage particulier — un appel avec la famille qui vit au Costa Rica, un cours avec quelqu’un rencontré en ligne, une longue discussion — le **chat Costa Rica** est ce qu’il y a de plus commode : il n’oblige pas l’autre personne à installer quoi que ce soit. Juste le lien.',
      'Les conversations dans le **chat Costa Rica** ne sont pas stockées au-delà de 24 heures. Quand tu fermes le salon (ou quand il expire automatiquement), tout ce qui a été envoyé dedans s’efface. Ça inclut les photos, les vidéos, les messages et les fichiers.',
      'Comme le service est web et non une appli, il n’y a pas de versions à mettre à jour ni de problèmes de compatibilité. Si ton navigateur fonctionne, le **chat Costa Rica** fonctionne. Et tous les navigateurs modernes (Chrome, Safari, Firefox, Edge) sont compatibles.',
    ],
    faqs: [
      {
        q: 'Le chat Costa Rica fonctionne-t-il bien avec les connexions mobiles ?',
        a: 'Oui. Le système adapte la qualité de la vidéo au réseau disponible. Avec une 4G normale au Costa Rica, un appel vidéo reste stable. Si la connexion est faible, la voix continue de fonctionner même si la vidéo baisse.',
      },
      {
        q: 'Puis-je recevoir des pourboires sur mon chat si je vis au Costa Rica ?',
        a: 'Oui, tant que tu as un compte bancaire acceptant les virements internationaux ou un compte dans un pays pris en charge par Stripe Connect. La plupart des pays hispanophones sont couverts.',
      },
      FAQ_REGISTRO,
      FAQ_PRECIO,
      FAQ_PRIVACIDAD,
    ],
  },
  'chat-cuba': {
    label: 'Chat Cuba',
    h1: 'Chat pour Cuba',
    metaTitle: 'Chat Cuba - Gagner de l’argent au chat - Tiptalk',
    metaDescription:
      'Salon de chat privé pour Cuba. Texte, voix, vidéo et pourboires depuis le navigateur. Sans inscription. Crée ton salon sur tiptalk.chat.',
    intro:
      '**Chat Cuba** sans téléchargement, avec pourboires intégrés. Le salon s’ouvre depuis le navigateur, quel que soit l’appareil.',
    paragraphs: [
      'Si tu es à Cuba ou que tu veux un salon de **chat Cuba** avec des gens de là-bas, tiptalk.chat fonctionne aussi bien. Le salon se crée depuis le navigateur sur n’importe quel appareil : ordinateur portable, tablette ou mobile.',
      'Comme chaque salon se partage par lien, il vaut aussi bien pour discuter avec quelqu’un de la même ville qu’avec quelqu’un à l’autre bout du monde. La latence reste basse car nous choisissons le serveur d’appel le plus proche de celui qui se connecte — important pour une région comme les Caraïbes.',
      'Pour qui est à La Havane ou dans d’autres villes de Cuba, l’expérience de chat est la même que depuis n’importe où ailleurs dans le pays. Pas besoin d’une connexion particulièrement bonne : le système baisse la qualité de la vidéo si le réseau faiblit, en gardant la voix claire.',
      'Si tu reçois des pourboires dans un **chat Cuba**, les Tipsys s’accumulent dans ton porte-monnaie et tu les retires sur ton compte quand tu veux. Ça vaut pour les créateurs, les professionnels et quiconque veut se faire payer son temps de conversation. Le retrait arrive sur des comptes internationaux qui acceptent les virements en euros.',
      'Pour un usage particulier — un appel avec la famille qui vit à Cuba, un cours avec quelqu’un rencontré en ligne, une longue discussion — le **chat Cuba** est ce qu’il y a de plus commode : il n’oblige pas l’autre personne à installer quoi que ce soit. Juste le lien.',
      'Les conversations dans le **chat Cuba** ne sont pas stockées au-delà de 24 heures. Quand tu fermes le salon (ou quand il expire automatiquement), tout ce qui a été envoyé dedans s’efface. Ça inclut les photos, les vidéos, les messages et les fichiers.',
      'Comme le service est web et non une appli, il n’y a pas de versions à mettre à jour ni de problèmes de compatibilité. Si ton navigateur fonctionne, le **chat Cuba** fonctionne. Et tous les navigateurs modernes (Chrome, Safari, Firefox, Edge) sont compatibles.',
    ],
    faqs: [
      {
        q: 'Le chat Cuba fonctionne-t-il bien avec les connexions mobiles ?',
        a: 'Oui. Le système adapte la qualité de la vidéo au réseau disponible. Avec une 4G normale à Cuba, un appel vidéo reste stable. Si la connexion est faible, la voix continue de fonctionner même si la vidéo baisse.',
      },
      {
        q: 'Puis-je recevoir des pourboires sur mon chat si je vis à Cuba ?',
        a: 'Oui, tant que tu as un compte bancaire acceptant les virements internationaux ou un compte dans un pays pris en charge par Stripe Connect. La plupart des pays hispanophones sont couverts.',
      },
      FAQ_REGISTRO,
      FAQ_PRECIO,
      FAQ_PRIVACIDAD,
    ],
  },
  'chat-ecuador': {
    label: 'Chat Équateur',
    h1: 'Chat pour l’Équateur',
    metaTitle: 'Chat Équateur - Salons de chat privés - Tiptalk',
    metaDescription:
      'Salon de chat privé pour l’Équateur. Texte, voix, vidéo et pourboires depuis le navigateur. Sans inscription. Crée ton salon sur tiptalk.chat.',
    intro:
      '**Chat Équateur** sans téléchargement, avec pourboires intégrés. Le salon s’ouvre depuis le navigateur, quel que soit l’appareil.',
    paragraphs: [
      'Si tu es en Équateur ou que tu veux un salon de **chat Équateur** avec des gens de là-bas, tiptalk.chat fonctionne aussi bien. Le salon se crée depuis le navigateur sur n’importe quel appareil : ordinateur portable, tablette ou mobile.',
      'Comme chaque salon se partage par lien, il vaut aussi bien pour discuter avec quelqu’un de la même ville qu’avec quelqu’un à l’autre bout du monde. La latence reste basse car nous choisissons le serveur d’appel le plus proche de celui qui se connecte — important pour une région comme l’Amérique du Sud.',
      'Pour qui est à Quito ou dans d’autres villes de l’Équateur, l’expérience de chat est la même que depuis n’importe où ailleurs dans le pays. Pas besoin d’une connexion particulièrement bonne : le système baisse la qualité de la vidéo si le réseau faiblit, en gardant la voix claire.',
      'Si tu reçois des pourboires dans un **chat Équateur**, les Tipsys s’accumulent dans ton porte-monnaie et tu les retires sur ton compte quand tu veux. Ça vaut pour les créateurs, les professionnels et quiconque veut se faire payer son temps de conversation. Le retrait arrive sur des comptes internationaux qui acceptent les virements en euros.',
      'Pour un usage particulier — un appel avec la famille qui vit en Équateur, un cours avec quelqu’un rencontré en ligne, une longue discussion — le **chat Équateur** est ce qu’il y a de plus commode : il n’oblige pas l’autre personne à installer quoi que ce soit. Juste le lien.',
      'Les conversations dans le **chat Équateur** ne sont pas stockées au-delà de 24 heures. Quand tu fermes le salon (ou quand il expire automatiquement), tout ce qui a été envoyé dedans s’efface. Ça inclut les photos, les vidéos, les messages et les fichiers.',
      'Comme le service est web et non une appli, il n’y a pas de versions à mettre à jour ni de problèmes de compatibilité. Si ton navigateur fonctionne, le **chat Équateur** fonctionne. Et tous les navigateurs modernes (Chrome, Safari, Firefox, Edge) sont compatibles.',
    ],
    faqs: [
      {
        q: 'Le chat Équateur fonctionne-t-il bien avec les connexions mobiles ?',
        a: 'Oui. Le système adapte la qualité de la vidéo au réseau disponible. Avec une 4G normale en Équateur, un appel vidéo reste stable. Si la connexion est faible, la voix continue de fonctionner même si la vidéo baisse.',
      },
      {
        q: 'Puis-je recevoir des pourboires sur mon chat si je vis en Équateur ?',
        a: 'Oui, tant que tu as un compte bancaire acceptant les virements internationaux ou un compte dans un pays pris en charge par Stripe Connect. La plupart des pays hispanophones sont couverts.',
      },
      FAQ_REGISTRO,
      FAQ_PRECIO,
      FAQ_PRIVACIDAD,
    ],
  },
  'chat-el-salvador': {
    label: 'Chat Salvador',
    h1: 'Chat pour le Salvador',
    metaTitle: 'Chat Salvador - Chat privé - Tiptalk',
    metaDescription:
      'Salon de chat privé pour le Salvador. Texte, voix, vidéo et pourboires depuis le navigateur. Sans inscription. Crée ton salon sur tiptalk.chat.',
    intro:
      '**Chat Salvador** sans téléchargement, avec pourboires intégrés. Le salon s’ouvre depuis le navigateur, quel que soit l’appareil.',
    paragraphs: [
      'Si tu es au Salvador ou que tu veux un salon de **chat Salvador** avec des gens de là-bas, tiptalk.chat fonctionne aussi bien. Le salon se crée depuis le navigateur sur n’importe quel appareil : ordinateur portable, tablette ou mobile.',
      'Comme chaque salon se partage par lien, il vaut aussi bien pour discuter avec quelqu’un de la même ville qu’avec quelqu’un à l’autre bout du monde. La latence reste basse car nous choisissons le serveur d’appel le plus proche de celui qui se connecte — important pour une région comme l’Amérique centrale.',
      'Pour qui se trouve dans différentes villes du Salvador, l’expérience est uniforme. Pas besoin d’une connexion particulièrement bonne : le système baisse la qualité de la vidéo si le réseau faiblit, en gardant la voix claire.',
      'Si tu reçois des pourboires dans un **chat Salvador**, les Tipsys s’accumulent dans ton porte-monnaie et tu les retires sur ton compte quand tu veux. Ça vaut pour les créateurs, les professionnels et quiconque veut se faire payer son temps de conversation. Le retrait arrive sur des comptes internationaux qui acceptent les virements en euros.',
      'Pour un usage particulier — un appel avec la famille qui vit au Salvador, un cours avec quelqu’un rencontré en ligne, une longue discussion — le **chat Salvador** est ce qu’il y a de plus commode : il n’oblige pas l’autre personne à installer quoi que ce soit. Juste le lien.',
      'Les conversations dans le **chat Salvador** ne sont pas stockées au-delà de 24 heures. Quand tu fermes le salon (ou quand il expire automatiquement), tout ce qui a été envoyé dedans s’efface. Ça inclut les photos, les vidéos, les messages et les fichiers.',
      'Comme le service est web et non une appli, il n’y a pas de versions à mettre à jour ni de problèmes de compatibilité. Si ton navigateur fonctionne, le **chat Salvador** fonctionne. Et tous les navigateurs modernes (Chrome, Safari, Firefox, Edge) sont compatibles.',
    ],
    faqs: [
      {
        q: 'Le chat Salvador fonctionne-t-il bien avec les connexions mobiles ?',
        a: 'Oui. Le système adapte la qualité de la vidéo au réseau disponible. Avec une 4G normale au Salvador, un appel vidéo reste stable. Si la connexion est faible, la voix continue de fonctionner même si la vidéo baisse.',
      },
      {
        q: 'Puis-je recevoir des pourboires sur mon chat si je vis au Salvador ?',
        a: 'Oui, tant que tu as un compte bancaire acceptant les virements internationaux ou un compte dans un pays pris en charge par Stripe Connect. La plupart des pays hispanophones sont couverts.',
      },
      FAQ_REGISTRO,
      FAQ_PRECIO,
      FAQ_PRIVACIDAD,
    ],
  },
  'chat-espana-pais': {
    label: 'Chat Espagne (pays)',
    h1: 'Chat pour l’Espagne',
    metaTitle: 'Chat Espagne (pays) - Gagner de l’argent en chattant - Tiptalk',
    metaDescription:
      'Salon de chat privé pour l’Espagne. Texte, voix, vidéo et pourboires depuis le navigateur. Sans inscription. Crée ton salon sur tiptalk.chat.',
    intro:
      '**Chat Espagne** sans téléchargement, avec pourboires intégrés. Le salon s’ouvre depuis le navigateur, quel que soit l’appareil.',
    paragraphs: [
      'Si tu es en Espagne ou que tu veux un salon de **chat Espagne** avec des gens de là-bas, tiptalk.chat fonctionne aussi bien. Le salon se crée depuis le navigateur sur n’importe quel appareil : ordinateur portable, tablette ou mobile.',
      'Comme chaque salon se partage par lien, il vaut aussi bien pour discuter avec quelqu’un de la même ville qu’avec quelqu’un à l’autre bout du monde. La latence reste basse car nous choisissons le serveur d’appel le plus proche de celui qui se connecte — important pour une région comme l’Europe.',
      'Pour qui est à Madrid ou dans d’autres villes de l’Espagne, l’expérience de chat est la même que depuis n’importe où ailleurs dans le pays. Pas besoin d’une connexion particulièrement bonne : le système baisse la qualité de la vidéo si le réseau faiblit, en gardant la voix claire.',
      'Si tu reçois des pourboires dans un **chat Espagne**, les Tipsys s’accumulent dans ton porte-monnaie et tu les retires sur ton compte quand tu veux. Ça vaut pour les créateurs, les professionnels et quiconque veut se faire payer son temps de conversation. Le retrait arrive sur des comptes internationaux qui acceptent les virements en euros.',
      'Pour un usage particulier — un appel avec la famille qui vit en Espagne, un cours avec quelqu’un rencontré en ligne, une longue discussion — le **chat Espagne** est ce qu’il y a de plus commode : il n’oblige pas l’autre personne à installer quoi que ce soit. Juste le lien.',
      'Les conversations dans le **chat Espagne** ne sont pas stockées au-delà de 24 heures. Quand tu fermes le salon (ou quand il expire automatiquement), tout ce qui a été envoyé dedans s’efface. Ça inclut les photos, les vidéos, les messages et les fichiers.',
      'Comme le service est web et non une appli, il n’y a pas de versions à mettre à jour ni de problèmes de compatibilité. Si ton navigateur fonctionne, le **chat Espagne** fonctionne. Et tous les navigateurs modernes (Chrome, Safari, Firefox, Edge) sont compatibles.',
    ],
    faqs: [
      {
        q: 'Le chat Espagne fonctionne-t-il bien avec les connexions mobiles ?',
        a: 'Oui. Le système adapte la qualité de la vidéo au réseau disponible. Avec une 4G normale en Espagne, un appel vidéo reste stable. Si la connexion est faible, la voix continue de fonctionner même si la vidéo baisse.',
      },
      {
        q: 'Puis-je recevoir des pourboires sur mon chat si je vis en Espagne ?',
        a: 'Oui, tant que tu as un compte bancaire acceptant les virements internationaux ou un compte dans un pays pris en charge par Stripe Connect. La plupart des pays hispanophones sont couverts.',
      },
      FAQ_REGISTRO,
      FAQ_PRECIO,
      FAQ_PRIVACIDAD,
    ],
  },
  'chat-guatemala': {
    label: 'Chat Guatemala',
    h1: 'Chat pour le Guatemala',
    metaTitle: 'Chat Guatemala - Gagner de l’argent au chat - Tiptalk',
    metaDescription:
      'Salon de chat privé pour le Guatemala. Texte, voix, vidéo et pourboires depuis le navigateur. Sans inscription. Crée ton salon sur tiptalk.chat.',
    intro:
      '**Chat Guatemala** sans téléchargement, avec pourboires intégrés. Le salon s’ouvre depuis le navigateur, quel que soit l’appareil.',
    paragraphs: [
      'Si tu es au Guatemala ou que tu veux un salon de **chat Guatemala** avec des gens de là-bas, tiptalk.chat fonctionne aussi bien. Le salon se crée depuis le navigateur sur n’importe quel appareil : ordinateur portable, tablette ou mobile.',
      'Comme chaque salon se partage par lien, il vaut aussi bien pour discuter avec quelqu’un de la même ville qu’avec quelqu’un à l’autre bout du monde. La latence reste basse car nous choisissons le serveur d’appel le plus proche de celui qui se connecte — important pour une région comme l’Amérique centrale.',
      'Pour qui se trouve dans différentes villes du Guatemala, l’expérience est uniforme. Pas besoin d’une connexion particulièrement bonne : le système baisse la qualité de la vidéo si le réseau faiblit, en gardant la voix claire.',
      'Si tu reçois des pourboires dans un **chat Guatemala**, les Tipsys s’accumulent dans ton porte-monnaie et tu les retires sur ton compte quand tu veux. Ça vaut pour les créateurs, les professionnels et quiconque veut se faire payer son temps de conversation. Le retrait arrive sur des comptes internationaux qui acceptent les virements en euros.',
      'Pour un usage particulier — un appel avec la famille qui vit au Guatemala, un cours avec quelqu’un rencontré en ligne, une longue discussion — le **chat Guatemala** est ce qu’il y a de plus commode : il n’oblige pas l’autre personne à installer quoi que ce soit. Juste le lien.',
      'Les conversations dans le **chat Guatemala** ne sont pas stockées au-delà de 24 heures. Quand tu fermes le salon (ou quand il expire automatiquement), tout ce qui a été envoyé dedans s’efface. Ça inclut les photos, les vidéos, les messages et les fichiers.',
      'Comme le service est web et non une appli, il n’y a pas de versions à mettre à jour ni de problèmes de compatibilité. Si ton navigateur fonctionne, le **chat Guatemala** fonctionne. Et tous les navigateurs modernes (Chrome, Safari, Firefox, Edge) sont compatibles.',
    ],
    faqs: [
      {
        q: 'Le chat Guatemala fonctionne-t-il bien avec les connexions mobiles ?',
        a: 'Oui. Le système adapte la qualité de la vidéo au réseau disponible. Avec une 4G normale au Guatemala, un appel vidéo reste stable. Si la connexion est faible, la voix continue de fonctionner même si la vidéo baisse.',
      },
      {
        q: 'Puis-je recevoir des pourboires sur mon chat si je vis au Guatemala ?',
        a: 'Oui, tant que tu as un compte bancaire acceptant les virements internationaux ou un compte dans un pays pris en charge par Stripe Connect. La plupart des pays hispanophones sont couverts.',
      },
      FAQ_REGISTRO,
      FAQ_PRECIO,
      FAQ_PRIVACIDAD,
    ],
  },
  'chat-honduras': {
    label: 'Chat Honduras',
    h1: 'Chat pour le Honduras',
    metaTitle: 'Chat Honduras - Salons de chat privés - Tiptalk',
    metaDescription:
      'Salon de chat privé pour le Honduras. Texte, voix, vidéo et pourboires depuis le navigateur. Sans inscription. Crée ton salon sur tiptalk.chat.',
    intro:
      '**Chat Honduras** sans téléchargement, avec pourboires intégrés. Le salon s’ouvre depuis le navigateur, quel que soit l’appareil.',
    paragraphs: [
      'Si tu es au Honduras ou que tu veux un salon de **chat Honduras** avec des gens de là-bas, tiptalk.chat fonctionne aussi bien. Le salon se crée depuis le navigateur sur n’importe quel appareil : ordinateur portable, tablette ou mobile.',
      'Comme chaque salon se partage par lien, il vaut aussi bien pour discuter avec quelqu’un de la même ville qu’avec quelqu’un à l’autre bout du monde. La latence reste basse car nous choisissons le serveur d’appel le plus proche de celui qui se connecte — important pour une région comme l’Amérique centrale.',
      'Pour qui se trouve dans différentes villes du Honduras, l’expérience est uniforme. Pas besoin d’une connexion particulièrement bonne : le système baisse la qualité de la vidéo si le réseau faiblit, en gardant la voix claire.',
      'Si tu reçois des pourboires dans un **chat Honduras**, les Tipsys s’accumulent dans ton porte-monnaie et tu les retires sur ton compte quand tu veux. Ça vaut pour les créateurs, les professionnels et quiconque veut se faire payer son temps de conversation. Le retrait arrive sur des comptes internationaux qui acceptent les virements en euros.',
      'Pour un usage particulier — un appel avec la famille qui vit au Honduras, un cours avec quelqu’un rencontré en ligne, une longue discussion — le **chat Honduras** est ce qu’il y a de plus commode : il n’oblige pas l’autre personne à installer quoi que ce soit. Juste le lien.',
      'Les conversations dans le **chat Honduras** ne sont pas stockées au-delà de 24 heures. Quand tu fermes le salon (ou quand il expire automatiquement), tout ce qui a été envoyé dedans s’efface. Ça inclut les photos, les vidéos, les messages et les fichiers.',
      'Comme le service est web et non une appli, il n’y a pas de versions à mettre à jour ni de problèmes de compatibilité. Si ton navigateur fonctionne, le **chat Honduras** fonctionne. Et tous les navigateurs modernes (Chrome, Safari, Firefox, Edge) sont compatibles.',
    ],
    faqs: [
      {
        q: 'Le chat Honduras fonctionne-t-il bien avec les connexions mobiles ?',
        a: 'Oui. Le système adapte la qualité de la vidéo au réseau disponible. Avec une 4G normale au Honduras, un appel vidéo reste stable. Si la connexion est faible, la voix continue de fonctionner même si la vidéo baisse.',
      },
      {
        q: 'Puis-je recevoir des pourboires sur mon chat si je vis au Honduras ?',
        a: 'Oui, tant que tu as un compte bancaire acceptant les virements internationaux ou un compte dans un pays pris en charge par Stripe Connect. La plupart des pays hispanophones sont couverts.',
      },
      FAQ_REGISTRO,
      FAQ_PRECIO,
      FAQ_PRIVACIDAD,
    ],
  },
  'chat-mexico': {
    label: 'Chat Mexique',
    h1: 'Chat pour le Mexique',
    metaTitle: 'Chat Mexique - Chat privé - Tiptalk',
    metaDescription:
      'Salon de chat privé pour le Mexique. Texte, voix, vidéo et pourboires depuis le navigateur. Sans inscription. Crée ton salon sur tiptalk.chat.',
    intro:
      '**Chat Mexique** sans téléchargement, avec pourboires intégrés. Le salon s’ouvre depuis le navigateur, quel que soit l’appareil.',
    paragraphs: [
      'Si tu es au Mexique ou que tu veux un salon de **chat Mexique** avec des gens de là-bas, tiptalk.chat fonctionne aussi bien. Le salon se crée depuis le navigateur sur n’importe quel appareil : ordinateur portable, tablette ou mobile.',
      'Comme chaque salon se partage par lien, il vaut aussi bien pour discuter avec quelqu’un de la même ville qu’avec quelqu’un à l’autre bout du monde. La latence reste basse car nous choisissons le serveur d’appel le plus proche de celui qui se connecte — important pour une région comme l’Amérique du Nord.',
      'Pour qui est à Mexico ou dans d’autres villes du Mexique, l’expérience de chat est la même que depuis n’importe où ailleurs dans le pays. Pas besoin d’une connexion particulièrement bonne : le système baisse la qualité de la vidéo si le réseau faiblit, en gardant la voix claire.',
      'Si tu reçois des pourboires dans un **chat Mexique**, les Tipsys s’accumulent dans ton porte-monnaie et tu les retires sur ton compte quand tu veux. Ça vaut pour les créateurs, les professionnels et quiconque veut se faire payer son temps de conversation. Le retrait arrive sur des comptes internationaux qui acceptent les virements en euros.',
      'Pour un usage particulier — un appel avec la famille qui vit au Mexique, un cours avec quelqu’un rencontré en ligne, une longue discussion — le **chat Mexique** est ce qu’il y a de plus commode : il n’oblige pas l’autre personne à installer quoi que ce soit. Juste le lien.',
      'Les conversations dans le **chat Mexique** ne sont pas stockées au-delà de 24 heures. Quand tu fermes le salon (ou quand il expire automatiquement), tout ce qui a été envoyé dedans s’efface. Ça inclut les photos, les vidéos, les messages et les fichiers.',
      'Comme le service est web et non une appli, il n’y a pas de versions à mettre à jour ni de problèmes de compatibilité. Si ton navigateur fonctionne, le **chat Mexique** fonctionne. Et tous les navigateurs modernes (Chrome, Safari, Firefox, Edge) sont compatibles.',
    ],
    faqs: [
      {
        q: 'Le chat Mexique fonctionne-t-il bien avec les connexions mobiles ?',
        a: 'Oui. Le système adapte la qualité de la vidéo au réseau disponible. Avec une 4G normale au Mexique, un appel vidéo reste stable. Si la connexion est faible, la voix continue de fonctionner même si la vidéo baisse.',
      },
      {
        q: 'Puis-je recevoir des pourboires sur mon chat si je vis au Mexique ?',
        a: 'Oui, tant que tu as un compte bancaire acceptant les virements internationaux ou un compte dans un pays pris en charge par Stripe Connect. La plupart des pays hispanophones sont couverts.',
      },
      FAQ_REGISTRO,
      FAQ_PRECIO,
      FAQ_PRIVACIDAD,
    ],
  },
  'chat-nicaragua': {
    label: 'Chat Nicaragua',
    h1: 'Chat pour le Nicaragua',
    metaTitle: 'Chat Nicaragua - Gagner de l’argent en chattant - Tiptalk',
    metaDescription:
      'Salon de chat privé pour le Nicaragua. Texte, voix, vidéo et pourboires depuis le navigateur. Sans inscription. Crée ton salon sur tiptalk.chat.',
    intro:
      '**Chat Nicaragua** sans téléchargement, avec pourboires intégrés. Le salon s’ouvre depuis le navigateur, quel que soit l’appareil.',
    paragraphs: [
      'Si tu es au Nicaragua ou que tu veux un salon de **chat Nicaragua** avec des gens de là-bas, tiptalk.chat fonctionne aussi bien. Le salon se crée depuis le navigateur sur n’importe quel appareil : ordinateur portable, tablette ou mobile.',
      'Comme chaque salon se partage par lien, il vaut aussi bien pour discuter avec quelqu’un de la même ville qu’avec quelqu’un à l’autre bout du monde. La latence reste basse car nous choisissons le serveur d’appel le plus proche de celui qui se connecte — important pour une région comme l’Amérique centrale.',
      'Pour qui se trouve dans différentes villes du Nicaragua, l’expérience est uniforme. Pas besoin d’une connexion particulièrement bonne : le système baisse la qualité de la vidéo si le réseau faiblit, en gardant la voix claire.',
      'Si tu reçois des pourboires dans un **chat Nicaragua**, les Tipsys s’accumulent dans ton porte-monnaie et tu les retires sur ton compte quand tu veux. Ça vaut pour les créateurs, les professionnels et quiconque veut se faire payer son temps de conversation. Le retrait arrive sur des comptes internationaux qui acceptent les virements en euros.',
      'Pour un usage particulier — un appel avec la famille qui vit au Nicaragua, un cours avec quelqu’un rencontré en ligne, une longue discussion — le **chat Nicaragua** est ce qu’il y a de plus commode : il n’oblige pas l’autre personne à installer quoi que ce soit. Juste le lien.',
      'Les conversations dans le **chat Nicaragua** ne sont pas stockées au-delà de 24 heures. Quand tu fermes le salon (ou quand il expire automatiquement), tout ce qui a été envoyé dedans s’efface. Ça inclut les photos, les vidéos, les messages et les fichiers.',
      'Comme le service est web et non une appli, il n’y a pas de versions à mettre à jour ni de problèmes de compatibilité. Si ton navigateur fonctionne, le **chat Nicaragua** fonctionne. Et tous les navigateurs modernes (Chrome, Safari, Firefox, Edge) sont compatibles.',
    ],
    faqs: [
      {
        q: 'Le chat Nicaragua fonctionne-t-il bien avec les connexions mobiles ?',
        a: 'Oui. Le système adapte la qualité de la vidéo au réseau disponible. Avec une 4G normale au Nicaragua, un appel vidéo reste stable. Si la connexion est faible, la voix continue de fonctionner même si la vidéo baisse.',
      },
      {
        q: 'Puis-je recevoir des pourboires sur mon chat si je vis au Nicaragua ?',
        a: 'Oui, tant que tu as un compte bancaire acceptant les virements internationaux ou un compte dans un pays pris en charge par Stripe Connect. La plupart des pays hispanophones sont couverts.',
      },
      FAQ_REGISTRO,
      FAQ_PRECIO,
      FAQ_PRIVACIDAD,
    ],
  },
  'chat-republica-dominicana': {
    label: 'Chat République dominicaine',
    h1: 'Chat pour la République dominicaine',
    metaTitle: 'Chat République dominicaine - Gagner de l’argent au chat - Tiptalk',
    metaDescription:
      'Salon de chat privé pour la République dominicaine. Texte, voix, vidéo et pourboires depuis le navigateur. Sans inscription. Crée ton salon sur tiptalk.chat.',
    intro:
      '**Chat République dominicaine** sans téléchargement, avec pourboires intégrés. Le salon s’ouvre depuis le navigateur, quel que soit l’appareil.',
    paragraphs: [
      'Si tu es en République dominicaine ou que tu veux un salon de **chat République dominicaine** avec des gens de là-bas, tiptalk.chat fonctionne aussi bien. Le salon se crée depuis le navigateur sur n’importe quel appareil : ordinateur portable, tablette ou mobile.',
      'Comme chaque salon se partage par lien, il vaut aussi bien pour discuter avec quelqu’un de la même ville qu’avec quelqu’un à l’autre bout du monde. La latence reste basse car nous choisissons le serveur d’appel le plus proche de celui qui se connecte — important pour une région comme les Caraïbes.',
      'Pour qui se trouve dans différentes villes de la République dominicaine, l’expérience est uniforme. Pas besoin d’une connexion particulièrement bonne : le système baisse la qualité de la vidéo si le réseau faiblit, en gardant la voix claire.',
      'Si tu reçois des pourboires dans un **chat République dominicaine**, les Tipsys s’accumulent dans ton porte-monnaie et tu les retires sur ton compte quand tu veux. Ça vaut pour les créateurs, les professionnels et quiconque veut se faire payer son temps de conversation. Le retrait arrive sur des comptes internationaux qui acceptent les virements en euros.',
      'Pour un usage particulier — un appel avec la famille qui vit en République dominicaine, un cours avec quelqu’un rencontré en ligne, une longue discussion — le **chat République dominicaine** est ce qu’il y a de plus commode : il n’oblige pas l’autre personne à installer quoi que ce soit. Juste le lien.',
      'Les conversations dans le **chat République dominicaine** ne sont pas stockées au-delà de 24 heures. Quand tu fermes le salon (ou quand il expire automatiquement), tout ce qui a été envoyé dedans s’efface. Ça inclut les photos, les vidéos, les messages et les fichiers.',
      'Comme le service est web et non une appli, il n’y a pas de versions à mettre à jour ni de problèmes de compatibilité. Si ton navigateur fonctionne, le **chat République dominicaine** fonctionne. Et tous les navigateurs modernes (Chrome, Safari, Firefox, Edge) sont compatibles.',
    ],
    faqs: [
      {
        q: 'Le chat République dominicaine fonctionne-t-il bien avec les connexions mobiles ?',
        a: 'Oui. Le système adapte la qualité de la vidéo au réseau disponible. Avec une 4G normale en République dominicaine, un appel vidéo reste stable. Si la connexion est faible, la voix continue de fonctionner même si la vidéo baisse.',
      },
      {
        q: 'Puis-je recevoir des pourboires sur mon chat si je vis en République dominicaine ?',
        a: 'Oui, tant que tu as un compte bancaire acceptant les virements internationaux ou un compte dans un pays pris en charge par Stripe Connect. La plupart des pays hispanophones sont couverts.',
      },
      FAQ_REGISTRO,
      FAQ_PRECIO,
      FAQ_PRIVACIDAD,
    ],
  },
  'chat-peru': {
    label: 'Chat Pérou',
    h1: 'Chat pour le Pérou',
    metaTitle: 'Chat Pérou - Salons de chat privés - Tiptalk',
    metaDescription:
      'Salon de chat privé pour le Pérou. Texte, voix, vidéo et pourboires depuis le navigateur. Sans inscription. Crée ton salon sur tiptalk.chat.',
    intro:
      '**Chat Pérou** sans téléchargement, avec pourboires intégrés. Le salon s’ouvre depuis le navigateur, quel que soit l’appareil.',
    paragraphs: [
      'Si tu es au Pérou ou que tu veux un salon de **chat Pérou** avec des gens de là-bas, tiptalk.chat fonctionne aussi bien. Le salon se crée depuis le navigateur sur n’importe quel appareil : ordinateur portable, tablette ou mobile.',
      'Comme chaque salon se partage par lien, il vaut aussi bien pour discuter avec quelqu’un de la même ville qu’avec quelqu’un à l’autre bout du monde. La latence reste basse car nous choisissons le serveur d’appel le plus proche de celui qui se connecte — important pour une région comme l’Amérique du Sud.',
      'Pour qui est à Lima ou dans d’autres villes du Pérou, l’expérience de chat est la même que depuis n’importe où ailleurs dans le pays. Pas besoin d’une connexion particulièrement bonne : le système baisse la qualité de la vidéo si le réseau faiblit, en gardant la voix claire.',
      'Si tu reçois des pourboires dans un **chat Pérou**, les Tipsys s’accumulent dans ton porte-monnaie et tu les retires sur ton compte quand tu veux. Ça vaut pour les créateurs, les professionnels et quiconque veut se faire payer son temps de conversation. Le retrait arrive sur des comptes internationaux qui acceptent les virements en euros.',
      'Pour un usage particulier — un appel avec la famille qui vit au Pérou, un cours avec quelqu’un rencontré en ligne, une longue discussion — le **chat Pérou** est ce qu’il y a de plus commode : il n’oblige pas l’autre personne à installer quoi que ce soit. Juste le lien.',
      'Les conversations dans le **chat Pérou** ne sont pas stockées au-delà de 24 heures. Quand tu fermes le salon (ou quand il expire automatiquement), tout ce qui a été envoyé dedans s’efface. Ça inclut les photos, les vidéos, les messages et les fichiers.',
      'Comme le service est web et non une appli, il n’y a pas de versions à mettre à jour ni de problèmes de compatibilité. Si ton navigateur fonctionne, le **chat Pérou** fonctionne. Et tous les navigateurs modernes (Chrome, Safari, Firefox, Edge) sont compatibles.',
    ],
    faqs: [
      {
        q: 'Le chat Pérou fonctionne-t-il bien avec les connexions mobiles ?',
        a: 'Oui. Le système adapte la qualité de la vidéo au réseau disponible. Avec une 4G normale au Pérou, un appel vidéo reste stable. Si la connexion est faible, la voix continue de fonctionner même si la vidéo baisse.',
      },
      {
        q: 'Puis-je recevoir des pourboires sur mon chat si je vis au Pérou ?',
        a: 'Oui, tant que tu as un compte bancaire acceptant les virements internationaux ou un compte dans un pays pris en charge par Stripe Connect. La plupart des pays hispanophones sont couverts.',
      },
      FAQ_REGISTRO,
      FAQ_PRECIO,
      FAQ_PRIVACIDAD,
    ],
  },
  'chat-panama': {
    label: 'Chat Panama',
    h1: 'Chat pour le Panama',
    metaTitle: 'Chat Panama - Chat privé - Tiptalk',
    metaDescription:
      'Salon de chat privé pour le Panama. Texte, voix, vidéo et pourboires depuis le navigateur. Sans inscription. Crée ton salon sur tiptalk.chat.',
    intro:
      '**Chat Panama** sans téléchargement, avec pourboires intégrés. Le salon s’ouvre depuis le navigateur, quel que soit l’appareil.',
    paragraphs: [
      'Si tu es au Panama ou que tu veux un salon de **chat Panama** avec des gens de là-bas, tiptalk.chat fonctionne aussi bien. Le salon se crée depuis le navigateur sur n’importe quel appareil : ordinateur portable, tablette ou mobile.',
      'Comme chaque salon se partage par lien, il vaut aussi bien pour discuter avec quelqu’un de la même ville qu’avec quelqu’un à l’autre bout du monde. La latence reste basse car nous choisissons le serveur d’appel le plus proche de celui qui se connecte — important pour une région comme l’Amérique centrale.',
      'Pour qui se trouve dans différentes villes du Panama, l’expérience est uniforme. Pas besoin d’une connexion particulièrement bonne : le système baisse la qualité de la vidéo si le réseau faiblit, en gardant la voix claire.',
      'Si tu reçois des pourboires dans un **chat Panama**, les Tipsys s’accumulent dans ton porte-monnaie et tu les retires sur ton compte quand tu veux. Ça vaut pour les créateurs, les professionnels et quiconque veut se faire payer son temps de conversation. Le retrait arrive sur des comptes internationaux qui acceptent les virements en euros.',
      'Pour un usage particulier — un appel avec la famille qui vit au Panama, un cours avec quelqu’un rencontré en ligne, une longue discussion — le **chat Panama** est ce qu’il y a de plus commode : il n’oblige pas l’autre personne à installer quoi que ce soit. Juste le lien.',
      'Les conversations dans le **chat Panama** ne sont pas stockées au-delà de 24 heures. Quand tu fermes le salon (ou quand il expire automatiquement), tout ce qui a été envoyé dedans s’efface. Ça inclut les photos, les vidéos, les messages et les fichiers.',
      'Comme le service est web et non une appli, il n’y a pas de versions à mettre à jour ni de problèmes de compatibilité. Si ton navigateur fonctionne, le **chat Panama** fonctionne. Et tous les navigateurs modernes (Chrome, Safari, Firefox, Edge) sont compatibles.',
    ],
    faqs: [
      {
        q: 'Le chat Panama fonctionne-t-il bien avec les connexions mobiles ?',
        a: 'Oui. Le système adapte la qualité de la vidéo au réseau disponible. Avec une 4G normale au Panama, un appel vidéo reste stable. Si la connexion est faible, la voix continue de fonctionner même si la vidéo baisse.',
      },
      {
        q: 'Puis-je recevoir des pourboires sur mon chat si je vis au Panama ?',
        a: 'Oui, tant que tu as un compte bancaire acceptant les virements internationaux ou un compte dans un pays pris en charge par Stripe Connect. La plupart des pays hispanophones sont couverts.',
      },
      FAQ_REGISTRO,
      FAQ_PRECIO,
      FAQ_PRIVACIDAD,
    ],
  },
  'chat-paraguay': {
    label: 'Chat Paraguay',
    h1: 'Chat pour le Paraguay',
    metaTitle: 'Chat Paraguay - Gagner de l’argent en chattant - Tiptalk',
    metaDescription:
      'Salon de chat privé pour le Paraguay. Texte, voix, vidéo et pourboires depuis le navigateur. Sans inscription. Crée ton salon sur tiptalk.chat.',
    intro:
      '**Chat Paraguay** sans téléchargement, avec pourboires intégrés. Le salon s’ouvre depuis le navigateur, quel que soit l’appareil.',
    paragraphs: [
      'Si tu es au Paraguay ou que tu veux un salon de **chat Paraguay** avec des gens de là-bas, tiptalk.chat fonctionne aussi bien. Le salon se crée depuis le navigateur sur n’importe quel appareil : ordinateur portable, tablette ou mobile.',
      'Comme chaque salon se partage par lien, il vaut aussi bien pour discuter avec quelqu’un de la même ville qu’avec quelqu’un à l’autre bout du monde. La latence reste basse car nous choisissons le serveur d’appel le plus proche de celui qui se connecte — important pour une région comme l’Amérique du Sud.',
      'Pour qui est à Asunción ou dans d’autres villes du Paraguay, l’expérience de chat est la même que depuis n’importe où ailleurs dans le pays. Pas besoin d’une connexion particulièrement bonne : le système baisse la qualité de la vidéo si le réseau faiblit, en gardant la voix claire.',
      'Si tu reçois des pourboires dans un **chat Paraguay**, les Tipsys s’accumulent dans ton porte-monnaie et tu les retires sur ton compte quand tu veux. Ça vaut pour les créateurs, les professionnels et quiconque veut se faire payer son temps de conversation. Le retrait arrive sur des comptes internationaux qui acceptent les virements en euros.',
      'Pour un usage particulier — un appel avec la famille qui vit au Paraguay, un cours avec quelqu’un rencontré en ligne, une longue discussion — le **chat Paraguay** est ce qu’il y a de plus commode : il n’oblige pas l’autre personne à installer quoi que ce soit. Juste le lien.',
      'Les conversations dans le **chat Paraguay** ne sont pas stockées au-delà de 24 heures. Quand tu fermes le salon (ou quand il expire automatiquement), tout ce qui a été envoyé dedans s’efface. Ça inclut les photos, les vidéos, les messages et les fichiers.',
      'Comme le service est web et non une appli, il n’y a pas de versions à mettre à jour ni de problèmes de compatibilité. Si ton navigateur fonctionne, le **chat Paraguay** fonctionne. Et tous les navigateurs modernes (Chrome, Safari, Firefox, Edge) sont compatibles.',
    ],
    faqs: [
      {
        q: 'Le chat Paraguay fonctionne-t-il bien avec les connexions mobiles ?',
        a: 'Oui. Le système adapte la qualité de la vidéo au réseau disponible. Avec une 4G normale au Paraguay, un appel vidéo reste stable. Si la connexion est faible, la voix continue de fonctionner même si la vidéo baisse.',
      },
      {
        q: 'Puis-je recevoir des pourboires sur mon chat si je vis au Paraguay ?',
        a: 'Oui, tant que tu as un compte bancaire acceptant les virements internationaux ou un compte dans un pays pris en charge par Stripe Connect. La plupart des pays hispanophones sont couverts.',
      },
      FAQ_REGISTRO,
      FAQ_PRECIO,
      FAQ_PRIVACIDAD,
    ],
  },
  'chat-puerto-rico': {
    label: 'Chat Porto Rico',
    h1: 'Chat pour Porto Rico',
    metaTitle: 'Chat Porto Rico - Gagner de l’argent au chat - Tiptalk',
    metaDescription:
      'Salon de chat privé pour Porto Rico. Texte, voix, vidéo et pourboires depuis le navigateur. Sans inscription. Crée ton salon sur tiptalk.chat.',
    intro:
      '**Chat Porto Rico** sans téléchargement, avec pourboires intégrés. Le salon s’ouvre depuis le navigateur, quel que soit l’appareil.',
    paragraphs: [
      'Si tu es à Porto Rico ou que tu veux un salon de **chat Porto Rico** avec des gens de là-bas, tiptalk.chat fonctionne aussi bien. Le salon se crée depuis le navigateur sur n’importe quel appareil : ordinateur portable, tablette ou mobile.',
      'Comme chaque salon se partage par lien, il vaut aussi bien pour discuter avec quelqu’un de la même ville qu’avec quelqu’un à l’autre bout du monde. La latence reste basse car nous choisissons le serveur d’appel le plus proche de celui qui se connecte — important pour une région comme les Caraïbes.',
      'Pour qui se trouve dans différentes villes de Porto Rico, l’expérience est uniforme. Pas besoin d’une connexion particulièrement bonne : le système baisse la qualité de la vidéo si le réseau faiblit, en gardant la voix claire.',
      'Si tu reçois des pourboires dans un **chat Porto Rico**, les Tipsys s’accumulent dans ton porte-monnaie et tu les retires sur ton compte quand tu veux. Ça vaut pour les créateurs, les professionnels et quiconque veut se faire payer son temps de conversation. Le retrait arrive sur des comptes internationaux qui acceptent les virements en euros.',
      'Pour un usage particulier — un appel avec la famille qui vit à Porto Rico, un cours avec quelqu’un rencontré en ligne, une longue discussion — le **chat Porto Rico** est ce qu’il y a de plus commode : il n’oblige pas l’autre personne à installer quoi que ce soit. Juste le lien.',
      'Les conversations dans le **chat Porto Rico** ne sont pas stockées au-delà de 24 heures. Quand tu fermes le salon (ou quand il expire automatiquement), tout ce qui a été envoyé dedans s’efface. Ça inclut les photos, les vidéos, les messages et les fichiers.',
      'Comme le service est web et non une appli, il n’y a pas de versions à mettre à jour ni de problèmes de compatibilité. Si ton navigateur fonctionne, le **chat Porto Rico** fonctionne. Et tous les navigateurs modernes (Chrome, Safari, Firefox, Edge) sont compatibles.',
    ],
    faqs: [
      {
        q: 'Le chat Porto Rico fonctionne-t-il bien avec les connexions mobiles ?',
        a: 'Oui. Le système adapte la qualité de la vidéo au réseau disponible. Avec une 4G normale à Porto Rico, un appel vidéo reste stable. Si la connexion est faible, la voix continue de fonctionner même si la vidéo baisse.',
      },
      {
        q: 'Puis-je recevoir des pourboires sur mon chat si je vis à Porto Rico ?',
        a: 'Oui, tant que tu as un compte bancaire acceptant les virements internationaux ou un compte dans un pays pris en charge par Stripe Connect. La plupart des pays hispanophones sont couverts.',
      },
      FAQ_REGISTRO,
      FAQ_PRECIO,
      FAQ_PRIVACIDAD,
    ],
  },
  'chat-tijuana': {
    label: 'Chat Tijuana',
    h1: 'Chat pour Tijuana',
    metaTitle: 'Chat Tijuana - Salons de chat privés - Tiptalk',
    metaDescription:
      'Salon de chat privé pour Tijuana. Texte, voix, vidéo et pourboires depuis le navigateur. Sans inscription. Crée ton salon sur tiptalk.chat.',
    intro:
      '**Chat Tijuana** sans téléchargement, avec pourboires intégrés. Le salon s’ouvre depuis le navigateur, quel que soit l’appareil.',
    paragraphs: [
      'Si tu es à Tijuana ou que tu veux un salon de **chat Tijuana** avec des gens de là-bas, tiptalk.chat fonctionne aussi bien. Le salon se crée depuis le navigateur sur n’importe quel appareil : ordinateur portable, tablette ou mobile.',
      'Comme chaque salon se partage par lien, il vaut aussi bien pour discuter avec quelqu’un de la même ville qu’avec quelqu’un à l’autre bout du monde. La latence reste basse car nous choisissons le serveur d’appel le plus proche de celui qui se connecte — important pour une région comme l’Amérique du Nord.',
      'Pour qui se trouve dans différents quartiers de Tijuana, l’expérience est uniforme. Pas besoin d’une connexion particulièrement bonne : le système baisse la qualité de la vidéo si le réseau faiblit, en gardant la voix claire.',
      'Si tu reçois des pourboires dans un **chat Tijuana**, les Tipsys s’accumulent dans ton porte-monnaie et tu les retires sur ton compte quand tu veux. Ça vaut pour les créateurs, les professionnels et quiconque veut se faire payer son temps de conversation. Le retrait arrive sur des comptes internationaux qui acceptent les virements en euros.',
      'Pour un usage particulier — un appel avec la famille qui vit à Tijuana, un cours avec quelqu’un rencontré en ligne, une longue discussion — le **chat Tijuana** est ce qu’il y a de plus commode : il n’oblige pas l’autre personne à installer quoi que ce soit. Juste le lien.',
      'Les conversations dans le **chat Tijuana** ne sont pas stockées au-delà de 24 heures. Quand tu fermes le salon (ou quand il expire automatiquement), tout ce qui a été envoyé dedans s’efface. Ça inclut les photos, les vidéos, les messages et les fichiers.',
      'Comme le service est web et non une appli, il n’y a pas de versions à mettre à jour ni de problèmes de compatibilité. Si ton navigateur fonctionne, le **chat Tijuana** fonctionne. Et tous les navigateurs modernes (Chrome, Safari, Firefox, Edge) sont compatibles.',
    ],
    faqs: [
      {
        q: 'Le chat Tijuana fonctionne-t-il bien avec les connexions mobiles ?',
        a: 'Oui. Le système adapte la qualité de la vidéo au réseau disponible. Avec une 4G normale à Tijuana, un appel vidéo reste stable. Si la connexion est faible, la voix continue de fonctionner même si la vidéo baisse.',
      },
      {
        q: 'Puis-je recevoir des pourboires sur mon chat si je vis à Tijuana ?',
        a: 'Oui, tant que tu as un compte bancaire acceptant les virements internationaux ou un compte dans un pays pris en charge par Stripe Connect. La plupart des pays hispanophones sont couverts.',
      },
      FAQ_REGISTRO,
      FAQ_PRECIO,
      FAQ_PRIVACIDAD,
    ],
  },
  'chat-uruguay': {
    label: 'Chat Uruguay',
    h1: 'Chat pour l’Uruguay',
    metaTitle: 'Chat Uruguay - Chat privé - Tiptalk',
    metaDescription:
      'Salon de chat privé pour l’Uruguay. Texte, voix, vidéo et pourboires depuis le navigateur. Sans inscription. Crée ton salon sur tiptalk.chat.',
    intro:
      '**Chat Uruguay** sans téléchargement, avec pourboires intégrés. Le salon s’ouvre depuis le navigateur, quel que soit l’appareil.',
    paragraphs: [
      'Si tu es en Uruguay ou que tu veux un salon de **chat Uruguay** avec des gens de là-bas, tiptalk.chat fonctionne aussi bien. Le salon se crée depuis le navigateur sur n’importe quel appareil : ordinateur portable, tablette ou mobile.',
      'Comme chaque salon se partage par lien, il vaut aussi bien pour discuter avec quelqu’un de la même ville qu’avec quelqu’un à l’autre bout du monde. La latence reste basse car nous choisissons le serveur d’appel le plus proche de celui qui se connecte — important pour une région comme l’Amérique du Sud.',
      'Pour qui est à Montevideo ou dans d’autres villes de l’Uruguay, l’expérience de chat est la même que depuis n’importe où ailleurs dans le pays. Pas besoin d’une connexion particulièrement bonne : le système baisse la qualité de la vidéo si le réseau faiblit, en gardant la voix claire.',
      'Si tu reçois des pourboires dans un **chat Uruguay**, les Tipsys s’accumulent dans ton porte-monnaie et tu les retires sur ton compte quand tu veux. Ça vaut pour les créateurs, les professionnels et quiconque veut se faire payer son temps de conversation. Le retrait arrive sur des comptes internationaux qui acceptent les virements en euros.',
      'Pour un usage particulier — un appel avec la famille qui vit en Uruguay, un cours avec quelqu’un rencontré en ligne, une longue discussion — le **chat Uruguay** est ce qu’il y a de plus commode : il n’oblige pas l’autre personne à installer quoi que ce soit. Juste le lien.',
      'Les conversations dans le **chat Uruguay** ne sont pas stockées au-delà de 24 heures. Quand tu fermes le salon (ou quand il expire automatiquement), tout ce qui a été envoyé dedans s’efface. Ça inclut les photos, les vidéos, les messages et les fichiers.',
      'Comme le service est web et non une appli, il n’y a pas de versions à mettre à jour ni de problèmes de compatibilité. Si ton navigateur fonctionne, le **chat Uruguay** fonctionne. Et tous les navigateurs modernes (Chrome, Safari, Firefox, Edge) sont compatibles.',
    ],
    faqs: [
      {
        q: 'Le chat Uruguay fonctionne-t-il bien avec les connexions mobiles ?',
        a: 'Oui. Le système adapte la qualité de la vidéo au réseau disponible. Avec une 4G normale en Uruguay, un appel vidéo reste stable. Si la connexion est faible, la voix continue de fonctionner même si la vidéo baisse.',
      },
      {
        q: 'Puis-je recevoir des pourboires sur mon chat si je vis en Uruguay ?',
        a: 'Oui, tant que tu as un compte bancaire acceptant les virements internationaux ou un compte dans un pays pris en charge par Stripe Connect. La plupart des pays hispanophones sont couverts.',
      },
      FAQ_REGISTRO,
      FAQ_PRECIO,
      FAQ_PRIVACIDAD,
    ],
  },
  'chat-venezuela': {
    label: 'Chat Venezuela',
    h1: 'Chat pour le Venezuela',
    metaTitle: 'Chat Venezuela - Gagner de l’argent en chattant - Tiptalk',
    metaDescription:
      'Salon de chat privé pour le Venezuela. Texte, voix, vidéo et pourboires depuis le navigateur. Sans inscription. Crée ton salon sur tiptalk.chat.',
    intro:
      '**Chat Venezuela** sans téléchargement, avec pourboires intégrés. Le salon s’ouvre depuis le navigateur, quel que soit l’appareil.',
    paragraphs: [
      'Si tu es au Venezuela ou que tu veux un salon de **chat Venezuela** avec des gens de là-bas, tiptalk.chat fonctionne aussi bien. Le salon se crée depuis le navigateur sur n’importe quel appareil : ordinateur portable, tablette ou mobile.',
      'Comme chaque salon se partage par lien, il vaut aussi bien pour discuter avec quelqu’un de la même ville qu’avec quelqu’un à l’autre bout du monde. La latence reste basse car nous choisissons le serveur d’appel le plus proche de celui qui se connecte — important pour une région comme l’Amérique du Sud.',
      'Pour qui est à Caracas ou dans d’autres villes du Venezuela, l’expérience de chat est la même que depuis n’importe où ailleurs dans le pays. Pas besoin d’une connexion particulièrement bonne : le système baisse la qualité de la vidéo si le réseau faiblit, en gardant la voix claire.',
      'Si tu reçois des pourboires dans un **chat Venezuela**, les Tipsys s’accumulent dans ton porte-monnaie et tu les retires sur ton compte quand tu veux. Ça vaut pour les créateurs, les professionnels et quiconque veut se faire payer son temps de conversation. Le retrait arrive sur des comptes internationaux qui acceptent les virements en euros.',
      'Pour un usage particulier — un appel avec la famille qui vit au Venezuela, un cours avec quelqu’un rencontré en ligne, une longue discussion — le **chat Venezuela** est ce qu’il y a de plus commode : il n’oblige pas l’autre personne à installer quoi que ce soit. Juste le lien.',
      'Les conversations dans le **chat Venezuela** ne sont pas stockées au-delà de 24 heures. Quand tu fermes le salon (ou quand il expire automatiquement), tout ce qui a été envoyé dedans s’efface. Ça inclut les photos, les vidéos, les messages et les fichiers.',
      'Comme le service est web et non une appli, il n’y a pas de versions à mettre à jour ni de problèmes de compatibilité. Si ton navigateur fonctionne, le **chat Venezuela** fonctionne. Et tous les navigateurs modernes (Chrome, Safari, Firefox, Edge) sont compatibles.',
    ],
    faqs: [
      {
        q: 'Le chat Venezuela fonctionne-t-il bien avec les connexions mobiles ?',
        a: 'Oui. Le système adapte la qualité de la vidéo au réseau disponible. Avec une 4G normale au Venezuela, un appel vidéo reste stable. Si la connexion est faible, la voix continue de fonctionner même si la vidéo baisse.',
      },
      {
        q: 'Puis-je recevoir des pourboires sur mon chat si je vis au Venezuela ?',
        a: 'Oui, tant que tu as un compte bancaire acceptant les virements internationaux ou un compte dans un pays pris en charge par Stripe Connect. La plupart des pays hispanophones sont couverts.',
      },
      FAQ_REGISTRO,
      FAQ_PRECIO,
      FAQ_PRIVACIDAD,
    ],
  },
};
