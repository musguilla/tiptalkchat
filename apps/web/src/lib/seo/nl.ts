import type { SeoPage, SeoFaq } from '../seo-pages';

// Vertaalde SEO-inhoud per slug. Ontbrekende slugs vallen terug op de
// Spaanse bron in seo-pages.ts.

// ===== Herbruikbare FAQ-fragmenten =====================================
const FAQ_REGISTRO: SeoFaq = {
  q: 'Moet ik me registreren om tiptalk.chat te gebruiken?',
  a: 'Nee. Je maakt een ruimte aan met alleen een nickname en een naam, en de ander komt binnen via de link zonder een account te openen. Registreren is alleen nodig als je fooien wilt ontvangen en die naar je rekening wilt uitbetalen.',
};

const FAQ_PRIVACIDAD: SeoFaq = {
  q: 'Wat gebeurt er met mijn berichten als de ruimte sluit?',
  a: 'Zodra je de ruimte sluit (of er 24 uur voorbij zijn) verwijderen we alle berichten, foto’s en video’s die zijn geüpload. Er blijft niets bewaard op onze servers, behalve het transactieregister van de fooien, dat fiscaal verplicht is.',
};

const FAQ_PRECIO: SeoFaq = {
  q: 'Hoeveel kost het om een ruimte aan te maken?',
  a: 'Een ruimte aanmaken is gratis en dat blijft altijd zo. Het enige wat je betaalt zijn de fooien, want dat is echt geld dat van de ene persoon naar de andere gaat. Als je alleen wilt chatten en bellen, betaal je niets.',
};

const FAQ_MOVIL: SeoFaq = {
  q: 'Werkt het op mobiel?',
  a: 'Ja, zonder een app te installeren. De ruimte opent in de browser van je mobiel (Chrome, Safari, Firefox) net als elke andere website. De gesprekken gebruiken de microfoon en de camera van je telefoon.',
};

const FAQ_PROPINAS: SeoFaq = {
  q: 'Hoe werken de fooien?',
  a: 'De fooien heten Tipsys. 1 € is 8 Tipsys bij aankoop. Wanneer iemand je Tipsys stuurt, verzamelen die zich in je portemonnee en zet je ze om in euro’s wanneer je ze wilt uitbetalen (10 Tipsys = 1 € bij de omzetting naar euro).',
};

const FAQ_NAVEGADOR: SeoFaq = {
  q: 'In welke browsers werkt het?',
  a: 'Het werkt in de bijgewerkte versies van Chrome, Safari, Firefox, Edge en Brave. Voor videogesprekken vraagt de browser de eerste keer toestemming om de camera en de microfoon te gebruiken.',
};

export const nl: Record<string, Partial<SeoPage>> = {
  'chat-online': {
    label: 'Chat online',
    h1: 'Live online chatten',
    metaTitle: 'Chat online - Privé chatrooms - Tiptalk',
    metaDescription:
      'Live online chatten in het Nederlands. Maak een privéruimte aan en begin binnen enkele seconden te praten met wie je wilt. Zonder iets te installeren.',
    intro:
      'Een **chat online** die eenvoudig en privé is, zonder downloads. Jij opent de ruimte, deelt de link en het gesprek begint.',
    paragraphs: [
      'Op tiptalk.chat open je een **chat online** in enkele seconden. Geen downloads, geen telefoonnummer, geen wachttijden. Je typt gewoon de naam van de ruimte, klikt op de knop om aan te maken en je hebt meteen de link klaar om te delen met wie je maar wilt.',
      'Het werkt vanuit de browser van je mobiel of je computer, dat maakt niet uit. Het gesprek is alleen tussen jou en de persoon aan de andere kant: geen massale groepen en niemand die onverwacht binnenkomt. Wat er in jouw **chat online** gebeurt, blijft tussen jullie.',
      'Heb je zin om verder te gaan dan tekst, dan start je met één knop een spraak- of videogesprek. De kwaliteit van het gesprek past zich aan je verbinding aan: heb je weinig bereik, dan blijft de stem behouden en gaat de resolutie omlaag zodat het niet wegvalt.',
      'En als iemand je iets vertelt dat de moeite waard is, kun je live een fooi achterlaten. De animatie verschijnt meteen in beeld, zodat de ander het gebaar ziet zonder dat je iets hoeft te zeggen.',
      'Anders dan bij een WhatsApp-groep of een Discord-server wordt wat je stuurt niet voor altijd bewaard. Zodra je de ruimte sluit (of na 24 uur) wordt alles gewist: berichten, foto’s en video’s. Het idee is dat een **chat online** net als een gesprek per telefoon is: levend zolang het duurt, en verder niets.',
      'Het is bedoeld voor wie snel een plek nodig heeft om met iemand te praten zonder via sociale media te gaan. Een privéles, een losse consultatie, een praatje met iemand die je elders hebt leren kennen of een gesprek met familie die ver weg woont.',
      'Er is geen limiet aan het aantal ruimtes dat je kunt aanmaken. Loopt er eentje vol en wil je opnieuw beginnen, dan open je in dertig seconden een nieuwe en deel je de nieuwe link.',
    ],
    faqs: [
      {
        q: 'Kan ik tiptalk.chat als chat online voor mijn bedrijf gebruiken?',
        a: 'Ja. Veel mensen gebruiken het voor klantgesprekken, privélessen of coachingsessies. De ruimte is privé, betalen gaat via fooien of via een vast tarief dat je vooraf communiceert, en na afloop blijft er geen geschiedenis achter.',
      },
      {
        q: 'Hoeveel mensen kunnen er in een chat online?',
        a: 'Het is opzettelijk één-op-één. De ruimte laat de persoon toe die haar aanmaakte en wie de link heeft, wat een privégesprek met z’n tweeën oplevert. Heb je meer nodig, dan open je meerdere ruimtes tegelijk.',
      },
      FAQ_REGISTRO,
      FAQ_PRIVACIDAD,
      FAQ_MOVIL,
    ],
  },
  'chat-propinas': {
    label: 'Fooienchat',
    h1: 'Chat met fooien',
    metaTitle: 'Fooienchat - Geld verdienen met chat - Tiptalk',
    metaDescription:
      'Privéchat met geïntegreerde fooien. Ontvang tips van je publiek in elk gesprek. Maak gratis je ruimte aan en begin meteen.',
    intro:
      'Op tiptalk.chat zitten de **fooien** in de chat zelf. Eén knop, een bedrag, en het verschijnt meteen in beeld.',
    paragraphs: [
      'Het mooie van tiptalk.chat is dat elk gesprek kan veranderen in een **fooienchat**. Als iemand je aan het lachen maakt, je helpt, of je gewoon de tijd van de ander wilt erkennen, is er een knop. Zonder van app te wisselen, zonder een betaalapp te openen, zonder naar een ander tabblad te gaan.',
      'Het werkt met Tipsys, onze virtuele munt. 1 € is 8 Tipsys bij aankoop en 10 Tipsys zijn 1 € wanneer je ze bij het uitbetalen omzet. Wie **fooien** ontvangt, verzamelt die in de portemonnee en kan ze in euro’s omzetten zodra het uitbetalingsminimum is bereikt.',
      'Het is direct, zonder onhandige betaalpagina’s of sprongen naar een andere app. Je klikt op een knop, kiest het bedrag en er verschijnt een animatie in de chat zodat de ander het meteen ziet. Geen bevestigingen achteraf en geen mailtjes van “je hebt een betaling ontvangen”.',
      'Er zijn vaste fooien (0,25 €, 0,50 €, 1 €, 2 €, 5 €) en de mogelijkheid om een vrij bedrag in te vullen. Wil je een kort briefje bij de fooi doen, dan gaat dat ernaast mee: een bedankje, een grapje, wat je maar wilt.',
      'Wanneer je veel **fooien** in hetzelfde gesprek ontvangt, verschijnen ze allemaal als aparte transacties in je portemonnee. Zo krijg je een helder overzicht: je ziet wanneer elke fooi binnenkwam en uit welke ruimte die komt.',
      'Om te beginnen met ontvangen hoef je je alleen te registreren (in minder dan een minuut), een uitbetaalrekening te koppelen en een ruimte te openen. Daarna is het gewoon chatten: de rest regelt het platform.',
      'Het systeem werkt net zo goed voor creators met een groot publiek als voor professionals die een losse consultatie geven. Als je werk zich in gesprekken laat meten, verlaagt het hebben van **fooien** in de chat de drempel tot een minimum.',
    ],
    faqs: [
      {
        q: 'Wie betaalt de commissie van de fooienchat?',
        a: 'De commissie is voor wie de fooi ontvangt (30%). Wie de fooi geeft, betaalt de prijs die op het scherm staat zonder extra toeslagen — wat je aanbiedt, zijn de euro’s die worden overgemaakt.',
      },
      {
        q: 'Wat is het minimum om fooien naar mijn rekening uit te betalen?',
        a: 'Het uitbetalingsminimum is 300 Tipsys, gelijk aan 30 € bruto vóór commissie. Zodra je die drempel overschrijdt, kun je zo vaak uitbetalen als je wilt.',
      },
      FAQ_PROPINAS,
      FAQ_REGISTRO,
      FAQ_PRIVACIDAD,
    ],
  },
  'chat-movil': {
    label: 'Mobiele chat',
    h1: 'Chat voor je mobiel',
    metaTitle: 'Mobiele chat - Privéchat - Tiptalk',
    metaDescription:
      'Privéchat geoptimaliseerd voor mobiel. Tekst, spraak en video vanuit de browser. Zonder downloads. Deel de link en chat meteen.',
    intro:
      'tiptalk.chat werkt als een **mobiele chat** zonder apps: de ruimte opent in Safari of Chrome en je bent meteen binnen.',
    paragraphs: [
      'tiptalk.chat is gemaakt voor de mobiel. De ruimte open je vanuit Safari, Chrome of welke browser je ook gebruikt, net zoals je elke website opent. Geen app om te downloaden, geen updates, geen rare permissies: gewoon een extra tabblad.',
      'Je stuurt berichten, foto’s en korte video’s en start gesprekken met de camera aan de voorkant of de microfoon. Allemaal vanaf dezelfde plek. Kies je voor een videogesprek, dan vraagt de browser de eerste keer toestemming voor de camera en daarna blijft die voor die ruimte verleend.',
      'Er is geen app om te installeren en geen vreemde meldingen. Sluit je het tabblad, dan blijft het gesprek bestaan zolang de ruimte open is. Je komt terug via de link en gaat verder waar je gebleven was.',
      'De interface van de **mobiele chat** past zich aan het scherm aan: berichten benutten de volle breedte, het toetsenbord stelt zichzelf in en de belknoppen zitten binnen duimbereik rechtsboven.',
      'Tijdens een videogesprek blijft de chat eronder actief. Je ziet binnenkomende berichten zonder te hoeven ophangen, en de ander ziet wat je typt terwijl je praat. Handig om een link, een adres of een getal door te geven zonder de draad kwijt te raken.',
      'De gesprekken in de **mobiele chat** werken met mobiele data of wifi en passen zich aan de kwaliteit van het netwerk aan. Heb je een zwak 4G-signaal, dan gaat de videoresolutie automatisch omlaag zodat de stem niet wegvalt. En verlies je de verbinding, dan pakt het gesprek vanzelf de draad weer op zodra je terug bent.',
      'Het werkt net zo goed op een iPhone als op een Android. De enige voorwaarde is een bijgewerkte browser: niets bijzonders, alle telefoons van de afgelopen jaren voldoen daaraan.',
    ],
    faqs: [
      {
        q: 'Moet ik een app installeren om de chat op mobiel te gebruiken?',
        a: 'Nee. De hele ervaring werkt vanuit de browser. Er is geen native versie omdat die niet nodig is: videogesprekken, fooien en foto’s werken prima vanaf het web.',
      },
      {
        q: 'Verbruikt een mobiele chat met video veel data?',
        a: 'Een standaard videogesprek verbruikt tussen de 5 en 10 MB per minuut. Zit je krap in je data, dan zet je de camera uit en houd je alleen de stem, die zakt naar minder dan 1 MB per minuut.',
      },
      FAQ_NAVEGADOR,
      FAQ_REGISTRO,
      FAQ_PRIVACIDAD,
    ],
  },
  'chatroulette': {
    label: 'ChatRoulette',
    h1: 'Alternatief voor ChatRoulette',
    metaTitle: 'ChatRoulette - Privéchat - Tiptalk',
    metaDescription:
      'Privé chatruimte, één-op-één. Jij kiest met wie je praat — zonder verrassingen. Een modern alternatief voor ChatRoulette.',
    intro:
      'Kom je hier op zoek naar **ChatRoulette**, dan is tiptalk.chat de gecontroleerde versie: jij bepaalt wie er binnenkomt, zonder willekeurige vreemden.',
    paragraphs: [
      'Als je iets zoekt in de trant van **ChatRoulette**, dan doet tiptalk.chat iets soortgelijks maar toch anders: jij beslist met wie je praat. Jij opent de ruimte en deelt de link met de persoon of personen die je erin wilt hebben.',
      'Geen roulette en geen willekeurige onbekenden. Het is een privéruimte, één-op-één, en jij hebt de controle. Voel je je ongemakkelijk bij iemand, dan sluit je af en open je een nieuwe. Het grote verschil met een klassieke **ChatRoulette** is dat jij hier kiest, niet het toeval.',
      'Zo vermijd je de klassieke problemen van chatroulettes: mensen die zonder camera verbinden, ongewenste inhoud, gesprekken die drie seconden duren. Hier is de ruimte van jou en komt alleen binnen wie jij beslist.',
      'Wil je nieuwe mensen leren kennen, dan deel je de link gewoon op een forum, op een sociaal netwerk of waar je maar wilt. Wie jou interesseert, vindt je wel. Jij houdt de controle over wie er binnenkomt en wanneer.',
      'Het werkt op elk apparaat met een browser en je hebt video, spraak, tekst en fooien op één plek. Het is als een **ChatRoulette**, maar gemaakt voor 2026: zonder downloads, zonder Flash, zonder je ergens aan te melden.',
      'Voor creators die van cameraplatforms komen, biedt tiptalk.chat iets wat die niet hadden: live fooien in de chat zelf. Jij bepaalt wanneer je opent en sluit, zonder contracten of vast abonnement.',
      'Als je ruimte druk bezocht wordt, zet je de Tipsys die je ontvangt om in euro’s wanneer je wilt. Het beheer is veel overzichtelijker dan bij welke klassieke roulette dan ook, waar het verdienmodel verwarrend of ronduit onbestaand was.',
    ],
    faqs: [
      {
        q: 'Is tiptalk.chat net als ChatRoulette?',
        a: 'Het deelt het idee van één-op-één chatten met video, maar niet de roulette. Hier deel jij de link van je ruimte met wie je wilt, in plaats van dat het systeem je koppelt aan een willekeurige onbekende.',
      },
      {
        q: 'Kan ik een openbare ruimte openen zoals een ChatRoulette?',
        a: 'Je kunt de link delen waar je wilt (forums, sociale media, een profiel) en iedereen met die link komt in je ruimte. Jij houdt de toegang in de hand, want je kunt de ruimte op elk moment sluiten of er een PIN op zetten.',
      },
      FAQ_REGISTRO,
      FAQ_PRIVACIDAD,
      FAQ_MOVIL,
    ],
  },
  'chat-amigos': {
    label: 'Chat met vrienden',
    h1: 'Chat om met vrienden te praten',
    metaTitle: 'Chat met vrienden - Privé chatrooms - Tiptalk',
    metaDescription:
      'Privéchat om met vrienden te praten. Tekst, spraak en video vanuit de browser. Geen enorme groepen of meldingen, alleen jij en wie jij wilt.',
    intro:
      'Een **chat met vrienden** zonder nog meer ruis in WhatsApp. Privéruimte, spraak, video en niets wat opgeslagen blijft.',
    paragraphs: [
      'Soms wil je een gesprek niet in WhatsApp stoppen, en al helemaal niet dat het daar voor altijd blijft staan. tiptalk.chat geeft je een privéruimte die alleen bestaat zolang je hem open wilt houden. Bedoeld voor een losse **chat met vrienden** zonder je andere chats te vervuilen.',
      'Je nodigt een vriend uit, deelt foto’s en video’s, belt via spraak of doet een videogesprek. Als jullie klaar zijn, sluit je de ruimte en wordt alles wat erin is gestuurd gewist. Er blijft geen geschiedenis hangen op jouw telefoon of die van hem.',
      'Het is handig om plannen af te stemmen, voor een lang gesprek met iemand ver weg of gewoon om een rustige plek te hebben om te kletsen. Omdat er geen massale groepen zijn, komen er niet elke twee minuten meldingen binnen die je uit je onderwerp halen.',
      'Spreek je af met een vriendin die in een ander land woont en laat het tijdsverschil jullie maar een kort venster om te praten, dan lost een **chat met vrienden** op tiptalk.chat dat op: zij komt binnen via een link, jij via een andere, en jullie beginnen te praten zonder iets te downloaden.',
      'Bij lange gesprekken houdt het systeem de verbinding vast, ook als een van jullie halverwege van wifi naar 4G overschakelt. De kwaliteit zakt heel even en herstelt zich weer, zonder dat je opnieuw hoeft te bellen.',
      'Omdat er geen account nodig is, kun je iemand uitnodigen die geen zin heeft om nóg een app te installeren. Hij heeft alleen de link nodig. Hij vult zijn naam in, komt binnen en is er meteen bij.',
      'Het is vooral handig als er een derde kanaal is (een partner, een neef, je werk) waar al veel ruis zit. Een aparte **chat met vrienden** openen zorgt dat je gesprekken niet door elkaar lopen.',
    ],
    faqs: [
      {
        q: 'Moeten mijn vrienden een account aanmaken om in de chat te komen?',
        a: 'Nee. Ze hebben alleen de link nodig die je deelt. Bij binnenkomst wordt om een nickname gevraagd om zich in de ruimte te identificeren, en dat is het.',
      },
      {
        q: 'Kan ik meerdere ruimtes tegelijk aanmaken voor verschillende groepen vrienden?',
        a: 'Ja. Elke ruimte staat op zichzelf en bestaat alleen zolang je hem openhoudt. Je kunt er een hebben met schoolvrienden, een met sportmaatjes en een met familie, zonder dat ze door elkaar lopen.',
      },
      FAQ_REGISTRO,
      FAQ_PRIVACIDAD,
      FAQ_MOVIL,
    ],
  },
  'chat-privado': {
    label: 'Privéchat',
    h1: 'Privéchat voor één-op-één',
    metaTitle: 'Privéchat - Privéchat - Tiptalk',
    metaDescription:
      'Privéchat, één-op-één, met video, spraak en fooien. Jij opent de ruimte, deelt de link en alleen wie jij beslist komt binnen.',
    intro:
      'Een echte **privéchat**: een ruimte voor één-op-één, zonder opgeslagen geschiedenis, met video en fooien op dezelfde plek.',
    paragraphs: [
      'tiptalk.chat is in de kern een **privéchat** zoals vanouds, maar beter opgezet. Jij bepaalt wie er binnenkomt: heb je de link niet, dan bereik je de ruimte niet. En zelfs met de link, als de maker de ruimte sluit, werkt hij niet meer.',
      'Standaard blijft niets van wat er binnen gebeurt bewaard na het sluiten. We wissen de berichten en de bestanden zodra het gesprek is afgelopen, en na 24 uur sluit de ruimte vanzelf. Dat is het verschil met elk sociaal netwerk: hier traint wat je stuurt niets en blijft het niet voor altijd op een server staan.',
      'Wil je nog meer privacy, dan zet je een **PIN** op de ruimte zodat de link alleen niet volstaat. Zo kan iemand die de link kopieert en deelt er toch niet in zonder de code.',
      'De **privéchat** ondersteunt tekst, foto’s, korte video’s, spraakgesprekken en videogesprekken. Allemaal in dezelfde ruimte. Ga je van chat naar video en weer terug, dan valt er niets weg: het blijft dezelfde draad.',
      'Anders dan bij de chats in sociale media zijn er hier geen advertenties, geen aanbevelingen en geen “personen die je misschien kent”. Het is alleen de chat. Het bedrijf verdient niets aan je gesprekken — het verdient aan de fooien, en alleen als jij besluit ze te gebruiken.',
      'Wat technische privacy betreft: de verbindingen lopen via TLS, de bestanden gaan door versleutelde opslag en de betaalwebhooks voldoen aan de standaarden van Stripe Connect. Geen magie en geen vage beloftes: het is de standaardtechniek, goed geconfigureerd.',
      'Wanneer je een ruimte sluit, draait er een proces dat alles wat erbij hoort opruimt: media in de opslag, berichten in de database en de ruimte zelf. Het enige wat overblijft is het fooienregister, een verplichte boekhoudkundige registratie.',
    ],
    faqs: [
      {
        q: 'Is tiptalk.chat echt een privéchat?',
        a: 'Ja. De ruimte is alleen toegankelijk voor wie de link heeft (en de PIN als je die hebt ingeschakeld). De inhoud wordt gewist bij het sluiten. We tonen de ruimtes in geen enkele openbare lijst.',
      },
      {
        q: 'Is de privéchat end-to-end versleuteld?',
        a: 'De verbindingen gebruiken end-to-end TLS van browser → server, maar de berichten lopen via onze backend om bij de ontvangers te kunnen komen. Het is geen zuivere E2EE zoals Signal, maar de inhoud wordt gewist zodra de ruimte sluit.',
      },
      FAQ_REGISTRO,
      FAQ_PRIVACIDAD,
      FAQ_NAVEGADOR,
    ],
  },
  'chat-token': {
    label: 'Tokenchat',
    h1: 'Chat met tokens — Tipsys',
    metaTitle: 'Tokenchat - Geld verdienen met chatten - Tiptalk',
    metaDescription:
      'Chatruimte met een tokensysteem (Tipsys). Ontvang live fooien van je publiek. Zet je tokens om in euro’s wanneer je wilt.',
    intro:
      'tiptalk.chat werkt als een **tokenchat**: binnen zijn er Tipsys, buiten euro’s. Je koopt, je stuurt, je betaalt uit.',
    paragraphs: [
      'De **tokens** van tiptalk.chat heten Tipsys. De omrekening is eenvoudig: 1 € staat gelijk aan 8 Tipsys bij aankoop. Bij het uitbetalen staan 10 Tipsys gelijk aan 1 € (het verschil is de commissie die het platform draaiende houdt).',
      'Wanneer iemand je Tipsys stuurt, verzamelen die zich in je portemonnee. Zodra je het minimum bereikt (300 Tipsys = 30 € bruto), zet je ze om in euro’s en betaal je ze uit naar je bankrekening. De uitbetaling loopt via onze betaalprovider en komt doorgaans binnen 1-2 werkdagen aan.',
      'Wat je in de **tokenchat** ziet, is direct: elke fooi verschijnt meteen als een mini-animatie. Geen wachttijden, geen maandelijkse afrekeningen, geen facturen die in een inbox blijven hangen.',
      'De **tokens** zijn ideaal voor creators omdat ze de beslissing “ik ga deze persoon steunen” loskoppelen van de beslissing “ik ga mijn kaart er weer bij pakken”. Je publiek koopt een pakket en laat daarna met één klik fooien achter, zonder opnieuw langs de betaalpagina te hoeven.',
      'Er zijn pakketten van 40 (5 €), 80 (10 €), 160 (20 €) en 400 (50 €) Tipsys. Hoe groter het pakket, hoe makkelijker je publiek de gewoonte aanhoudt zonder telkens te hoeven bijladen. Wil iemand een ander bedrag, dan bepaal jij dat: de ruimte accepteert vrije bedragen.',
      'Omdat de **tokenchat** van het platform zelf is, bestaat er geen risico dat een betaling mislukt door een probleem met een externe betaalpagina. Heb je Tipsys in je portemonnee, dan zijn ze van jou.',
      'Wat belastingen betreft: de uitbetalingen gaan naar je rekening en zijn persoonlijke inkomsten waarover je in je eigen land inkomstenbelasting betaalt. We geven je in je dashboard een maandelijks overzicht zodat je ze makkelijk kunt opgeven.',
    ],
    faqs: [
      {
        q: 'Wat zijn Tipsys, de interne token van tiptalk.chat?',
        a: 'Het is onze virtuele fooienmunt. 1 € staat gelijk aan 8 Tipsys bij aankoop, 10 Tipsys staan gelijk aan 1 € bij uitbetaling. Het verschil is de platformcommissie (30%).',
      },
      {
        q: 'Verlopen de Tipsys in de portemonnee?',
        a: 'Nee, de Tipsys die je in je portemonnee hebt, blijven onbeperkt geldig. Je kunt ze als fooi versturen of in euro’s uitbetalen zodra je het minimum bereikt.',
      },
      FAQ_PROPINAS,
      FAQ_PRECIO,
      FAQ_REGISTRO,
    ],
  },
  'chat-tips': {
    label: 'Chat met tips',
    h1: 'Chat met live tips',
    metaTitle: 'Chat met tips - Geld verdienen met chat - Tiptalk',
    metaDescription:
      'Ontvang tips rechtstreeks in de chat. Spraak, video en fooien in dezelfde ruimte. Zonder externe betaalpagina’s, zonder wachttijden.',
    intro:
      'De **tips** op tiptalk.chat gaan in de chat zelf. Knop, bedrag, animatie en klaar.',
    paragraphs: [
      'Een **tip** op tiptalk.chat is iets wat de persoon aan de andere kant je kan sturen zonder de chat te verlaten. Hij klikt op een knop, kiest hoeveel, en de animatie verschijnt meteen. Jij ziet het live en de ander vertrekt met het gevoel je voor het moment bedankt te hebben.',
      'Het is veel directer dan een aparte overboeking of een PayPal in een ander tabblad. De **chat met tips** verwerkt de fooi als zomaar een bericht, met zijn eigen visuele animatie en een boeking in de portemonnee.',
      'Het werkt net zo goed voor creators als voor professionals die een korte consultatie in rekening brengen of voor vrienden die je op afstand op iets willen trakteren. De economie is dezelfde: Tipsys die zich opstapelen en in euro’s worden omgezet.',
      'Voor de creator heeft het ontvangen van **tips** in de chat een voordeel boven het model “betaal aan het eind”: de fooi wordt in het moment gegeven, net na het punt waarop iemand je wil bedanken. Dat is psychologisch makkelijker dan een andere app openen om 2 € koud over te maken.',
      'De animatie van de fooi is subtiel — ze onderbreekt de chat niet en dekt hem niet af. Ze verschijnt maar een paar seconden als een vliegende emoji en wordt in de geschiedenis vastgelegd als een systeembericht.',
      'Wil je bedanken voor iets specifieks — een nuttig antwoord, een grapje — dan laat je een **tip** achter bij dat concrete bericht. Zo weet je waar de fooi op sloeg als je later je geschiedenis bekijkt.',
      'Er is een lage ondergrens: de kleinste **tip** is 25 cent (2 Tipsys). De hoogste is vrij — de persoon kiest zelf het bedrag. Loopt je ruimte goed, dan liggen de gemiddelde bedragen meestal tussen 50 cent en 2 €.',
    ],
    faqs: [
      {
        q: 'Moet ik betalen om een tip in een chat te sturen?',
        a: 'Om tips te sturen koop je eerst Tipsys (1 € = 8 Tipsys) en die verstuur je vervolgens met één klik tijdens het gesprek. Er zijn geen extra kosten per losse tip; de kost zit in het kopen van Tipsys.',
      },
      {
        q: 'Kan ik tips naar meerdere mensen tegelijk sturen?',
        a: 'Je hebt één portemonnee en de Tipsys die je hebt, gelden voor elke ruimte. Open je meerdere ruimtes, dan kun je in elke ruimte fooien sturen met hetzelfde saldo.',
      },
      FAQ_PROPINAS,
      FAQ_PRECIO,
      FAQ_PRIVACIDAD,
    ],
  },
  'chatear-online': {
    label: 'Online chatten',
    h1: 'Online chatten in het Nederlands',
    metaTitle: 'Online chatten - Privé chatrooms - Tiptalk',
    metaDescription:
      'Online chatten in het Nederlands. Privéruimte met tekst, spraak en video vanuit de browser. Deel de link en begin meteen.',
    intro:
      'Om **online te chatten** in het Nederlands zonder iets te downloaden: je opent een ruimte, deelt de link en jullie praten.',
    paragraphs: [
      '**Online chatten** op tiptalk.chat is een ruimte openen met een naam, de link delen en klaar. Geen account nodig, geen telefoonnummer, geen sms-verificatie. Je gaat regelrecht naar de chat.',
      'De ruimte is alleen van jou en van wie je uitnodigt. Wil je van tekst naar video of spraak, dan zit dat al op dezelfde plek: twee knoppen linksboven. Je hoeft geen Skype, Google Meet of Zoom te openen.',
      'Na 24 uur sluit de ruimte vanzelf en verdwijnt alles wat jullie erin hebben gestuurd. Wil je meer tijd, dan open je gewoon een nieuwe. Dat is prettig voor gesprekken die je niet in je algemene geschiedenis wilt zien ophopen.',
      'Om **online te chatten** met iemand aan de andere kant van de wereld heb je alleen een goede internetverbinding nodig. De vertraging blijft laag omdat we de gespreksservers kiezen op basis van waar jullie beiden zitten.',
      'Anders dan bij andere sites om **online te chatten**, zijn de fooien hier een natuurlijk onderdeel van het geheel. Vond je het moment met iemand leuk, dan zeg je dat met een knop. Word je geholpen, dan erken je dat zonder een andere app te openen.',
      'De interface is in het Nederlands, de systeemberichten zijn in het Nederlands, de emoji’s en stickers werken in het Nederlands. Geen houterige vertalingen en geen knoppen die half in het Engels staan. Het is gemaakt voor Nederlandstaligen.',
      'Kom je maar één keertje binnen om te chatten, dan hoef je niet eens je echte naam achter te laten. Je kiest een willekeurige nickname en je bent binnen.',
    ],
    faqs: [
      {
        q: 'Hoeveel mensen kunnen er tegelijk online chatten in een ruimte?',
        a: 'De ruimte is bedoeld voor één-op-één (twee personen). Wil je met meer mensen online chatten, dan kun je het beste meerdere ruimtes openen of een ander soort hulpmiddel gebruiken.',
      },
      {
        q: 'Werkt het om online te chatten tussen verschillende landen?',
        a: 'Ja. De gesprekken lopen via servers in Europa, de VS en Zuid-Amerika, zodat de vertraging laag blijft, ongeacht de bestemming. Berichten en fooien reizen meteen.',
      },
      FAQ_REGISTRO,
      FAQ_MOVIL,
      FAQ_NAVEGADOR,
    ],
  },
};
