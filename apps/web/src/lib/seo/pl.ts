import type { SeoPage } from '../seo-pages';

// ===== Reusable FAQ snippets (Polish) ===================================
const FAQ_REGISTRO_PL = {
  q: 'Czy muszę się rejestrować, żeby korzystać z tiptalk.chat?',
  a: 'Nie. Możesz stworzyć pokój, podając tylko pseudonim i nazwę, a druga osoba wchodzi przez link bez zakładania konta. Rejestracja jest potrzebna tylko wtedy, gdy chcesz otrzymywać napiwki i wypłacać je na swoje konto.',
};

const FAQ_PRIVACIDAD_PL = {
  q: 'Co dzieje się z moimi wiadomościami, gdy pokój zostaje zamknięty?',
  a: 'Gdy zamykasz pokój (albo po 24 godzinach), usuwamy wszystkie przesłane wiadomości, zdjęcia i filmy. Na naszych serwerach nie zostaje nic poza rejestrem transakcji napiwków, który musimy przechowywać ze względów podatkowych.',
};

const FAQ_PRECIO_PL = {
  q: 'Ile kosztuje stworzenie pokoju?',
  a: 'Tworzenie pokoju jest darmowe i zawsze takie pozostanie. Płaci się jedynie za napiwki, bo to prawdziwe pieniądze, które przechodzą z rąk do rąk. Jeśli chcesz tylko czatować i dzwonić, nie płacisz nic.',
};

const FAQ_MOVIL_PL = {
  q: 'Czy działa na telefonie?',
  a: 'Tak, bez instalowania żadnej aplikacji. Pokój otwiera się w przeglądarce telefonu (Chrome, Safari, Firefox), tak jak każda inna strona. Połączenia korzystają z mikrofonu i kamery telefonu.',
};

const FAQ_PROPINAS_PL = {
  q: 'Jak działają napiwki?',
  a: 'Napiwki nazywają się Tipsys. 1 € to 8 Tipsys przy zakupie. Gdy ktoś wysyła ci Tipsys, gromadzą się w twoim portfelu, a zamieniasz je na euro, kiedy chcesz je wypłacić (10 Tipsys = 1 € przy przeliczeniu z powrotem na euro).',
};

const FAQ_NAVEGADOR_PL = {
  q: 'W jakich przeglądarkach działa?',
  a: 'Działa w aktualnych wersjach Chrome, Safari, Firefox, Edge i Brave. Do połączeń wideo przeglądarka za pierwszym razem poprosi o zgodę na dostęp do kamery i mikrofonu.',
};

export const pl: Record<string, Partial<SeoPage>> = {
  'chat-online': {
    label: 'Czat online',
    h1: 'Czat online na żywo',
    metaTitle: 'Czat online - Prywatne pokoje czatu - Tiptalk',
    metaDescription:
      'Czat online na żywo. Stwórz prywatny pokój i w kilka sekund zacznij rozmawiać z kim chcesz. Bez instalowania czegokolwiek.',
    intro:
      'Prosty, prywatny **czat online** bez pobierania. Otwierasz pokój, udostępniasz link i rozmowa się zaczyna.',
    paragraphs: [
      'Na tiptalk.chat otwierasz **czat online** w kilka sekund. Żadnych pobierań, żadnego numeru telefonu, żadnego czekania. Wpisujesz tylko nazwę pokoju, klikasz przycisk tworzenia i masz gotowy link do udostępnienia komu chcesz.',
      'Działa z przeglądarki telefonu albo komputera, to bez różnicy. Rozmowa toczy się tylko między tobą a osobą po drugiej stronie — żadnych masowych grup ani ludzi wchodzących bez zapowiedzi. To, co dzieje się w twoim **czacie online**, zostaje między wami.',
      'Jeśli masz ochotę wyjść poza tekst, jednym przyciskiem uruchamiasz połączenie głosowe albo wideo. Jakość połączenia dostosowuje się do twojego łącza: gdy masz słaby zasięg, zostaje głos, a rozdzielczość spada, żeby nic się nie rwało.',
      'A jeśli ktoś opowiada ci coś, co jest tego warte, możesz zostawić mu napiwek na żywo. Animacja pojawia się na ekranie natychmiast, żeby druga osoba zobaczyła ten gest, a ty nie musisz nic mówić.',
      'W przeciwieństwie do grupy na WhatsAppie czy serwera na Discordzie to, co wysyłasz, nie zostaje zapisane na zawsze. Po zamknięciu pokoju (albo po 24 godzinach) usuwa się wszystko: wiadomości, zdjęcia i filmy. Chodzi o to, żeby **czat online** działał jak rozmowa głosowa: żywy, dopóki trwa, i nic ponadto.',
      'Jest pomyślany dla ludzi, którzy potrzebują szybkiego miejsca na rozmowę z kimś bez przechodzenia przez media społecznościowe. Korepetycje, krótka konsultacja, pogawędka z kimś poznanym offline albo rozmowa z rodziną mieszkającą daleko.',
      'Nie ma limitu tego, ile pokoi możesz stworzyć. Jeśli jeden zapełni się kontekstem i chcesz zacząć od zera, w trzydzieści sekund otwierasz kolejny i udostępniasz nowy link.',
    ],
    faqs: [
      {
        q: 'Czy mogę używać tiptalk.chat jako czatu online dla mojej firmy?',
        a: 'Tak. Wiele osób korzysta z niego przy konsultacjach z klientami, korepetycjach albo sesjach coachingowych. Pokój jest prywatny, płatność idzie przez napiwki albo stałą stawkę, którą ustalasz wcześniej, a po zakończeniu nie zostaje żadna historia.',
      },
      {
        q: 'Ile osób może wejść na czat online?',
        a: 'Z założenia jest jeden na jednego. Pokój przyjmuje osobę, która go stworzyła, i tego, kto ma link — co daje prywatną rozmowę we dwoje. Jeśli potrzebujesz więcej, możesz otworzyć kilka pokoi naraz.',
      },
      FAQ_REGISTRO_PL,
      FAQ_PRIVACIDAD_PL,
      FAQ_MOVIL_PL,
    ],
  },
  'chat-propinas': {
    label: 'Czat z napiwkami',
    h1: 'Czat z napiwkami',
    metaTitle: 'Czat z napiwkami - Zarabianie na czacie - Tiptalk',
    metaDescription:
      'Prywatny czat z wbudowanymi napiwkami. Otrzymuj napiwki od swojej publiczności w każdej rozmowie. Stwórz pokój za darmo i zacznij już teraz.',
    intro:
      'Na tiptalk.chat **napiwki** są wewnątrz czatu. Przycisk, kwota i pojawiają się na ekranie natychmiast.',
    paragraphs: [
      'Cały urok tiptalk.chat polega na tym, że każda rozmowa może zamienić się w **czat z napiwkami**. Jeśli ktoś cię rozśmiesza, pomaga ci albo po prostu chcesz docenić czyjś czas, jest do tego przycisk. Bez zmiany aplikacji, bez otwierania przelewu, bez przechodzenia do innej karty.',
      'Działa na Tipsys, naszej wirtualnej walucie. 1 € to 8 Tipsys przy zakupie, a 10 Tipsys to 1 € przy przeliczeniu podczas wypłaty. Kto otrzymuje **napiwki**, gromadzi je w swoim portfelu i może zamienić na euro po osiągnięciu progu wypłaty.',
      'To bezpośrednie, bez topornych bramek płatności i przeskoków do innej aplikacji. Klikasz przycisk, wybierasz kwotę i na czacie pojawia się animacja, żeby druga osoba od razu ją zobaczyła. Żadnych późniejszych potwierdzeń ani maili w stylu „dotarł do ciebie przelew”.',
      'Są napiwki ustalone z góry (0,25 €, 0,50 €, 1 €, 2 €, 5 €) i opcja wpisania dowolnej kwoty. Jeśli chcesz dołączyć krótką notkę do napiwku, wysyła się ją obok: podziękowanie, żart, cokolwiek.',
      'Gdy w jednej rozmowie dostajesz wiele **napiwków**, wszystkie pojawiają się w portfelu jako osobne pozycje. To daje przejrzystą historię: widzisz, kiedy przyszedł każdy z nich i z którego pokoju pochodzi.',
      'Żeby zacząć otrzymywać, wystarczy się zarejestrować (w niecałą minutę), podłączyć konto do wypłat i otworzyć pokój. Reszta to już czatowanie: pozostałym zajmuje się platforma.',
      'System sprawdza się tak samo dobrze u twórców z dużą publicznością, jak u profesjonalistów udzielających jednorazowej konsultacji. Jeśli twoja praca mierzy się w rozmowach, trzymanie **napiwków** wewnątrz czatu obniża tarcie do minimum.',
    ],
    faqs: [
      {
        q: 'Kto płaci prowizję na czacie z napiwkami?',
        a: 'Prowizję pokrywa osoba, która otrzymuje napiwek (30%). Kto daje napiwek, płaci cenę widoczną na ekranie bez dodatkowych dopłat — to, co zaoferuje, to euro, które trafiają do odbiorcy.',
      },
      {
        q: 'Ile wynosi minimum, żeby wypłacić napiwki na konto?',
        a: 'Minimalna wypłata to 300 Tipsys, czyli równowartość 30 € brutto przed prowizją. Wypłatę można zlecać dowolną liczbę razy po przekroczeniu tego progu.',
      },
      FAQ_PROPINAS_PL,
      FAQ_REGISTRO_PL,
      FAQ_PRIVACIDAD_PL,
    ],
  },
  'chat-movil': {
    label: 'Czat mobilny',
    h1: 'Czat na telefon',
    metaTitle: 'Czat mobilny - Prywatny czat - Tiptalk',
    metaDescription:
      'Prywatny czat zoptymalizowany pod telefon. Tekst, głos i wideo z przeglądarki. Bez pobierania. Udostępnij link i czatuj już teraz.',
    intro:
      'tiptalk.chat działa jak **czat mobilny** bez aplikacji: pokój otwiera się w Safari albo Chrome i już jesteś w środku.',
    paragraphs: [
      'tiptalk.chat jest pomyślany pod telefon. Pokój otwierasz w Safari, Chrome albo przeglądarce, której używasz, tak samo jak każdą stronę. Nie ma aplikacji do pobrania, nie ma aktualizacji, nie ma dziwnych uprawnień: to tylko kolejna karta.',
      'Możesz wysyłać wiadomości, zdjęcia, krótkie filmy i zaczynać połączenia z przednią kamerą albo mikrofonem. Wszystko z tego samego miejsca. Jeśli zdecydujesz się na wideorozmowę, przeglądarka za pierwszym razem poprosi o zgodę na kamerę, a potem zostaje ona przyznana dla tego pokoju.',
      'Nie ma aplikacji do instalowania ani dziwnych powiadomień. Jeśli zamkniesz kartę, rozmowa czeka tam dalej, dopóki pokój jest otwarty. Wracasz przez link i podejmujesz od miejsca, w którym skończyłeś.',
      'Interfejs **czatu mobilnego** dopasowuje się do ekranu: wiadomości zajmują użyteczną szerokość, klawiatura sama się dostosowuje, a przyciski połączeń są w zasięgu kciuka, w prawym górnym rogu.',
      'Gdy jesteś w wideorozmowie, czat działa dalej poniżej. Możesz czytać wiadomości, które przychodzą, bez rozłączania się, a osoba po drugiej stronie widzi, co piszesz w trakcie rozmowy. Przydatne, gdy trzeba podać link, adres albo liczbę bez gubienia wątku.',
      'Połączenia w **czacie mobilnym** działają na danych albo WiFi i dostosowują się do jakości sieci. Jeśli masz słabe 4G, automatycznie spada rozdzielczość wideo, żeby głos się nie urywał. A jeśli stracisz połączenie, po powrocie samo się wznawia.',
      'Działa tak samo z iPhone’a, jak z Androida. Jedyny warunek to aktualna przeglądarka: nic dziwnego, wszystkie telefony z ostatnich lat to spełniają.',
    ],
    faqs: [
      {
        q: 'Czy muszę zainstalować aplikację, żeby korzystać z czatu na telefonie?',
        a: 'Nie. Całość działa z przeglądarki. Nie ma wersji natywnej, bo nie jest potrzebna: wideorozmowy, napiwki i zdjęcia działają dobrze z poziomu strony.',
      },
      {
        q: 'Czy czat mobilny z wideo zużywa dużo danych?',
        a: 'Standardowa wideorozmowa zużywa od 5 do 10 MB na minutę. Jeśli masz mało danych, możesz wyłączyć kamerę i zostawić sam głos, co spada do niecałego 1 MB na minutę.',
      },
      FAQ_NAVEGADOR_PL,
      FAQ_REGISTRO_PL,
      FAQ_PRIVACIDAD_PL,
    ],
  },
  'chatroulette': {
    label: 'ChatRoulette',
    h1: 'Alternatywa dla ChatRoulette',
    metaTitle: 'ChatRoulette - Prywatny czat - Tiptalk',
    metaDescription:
      'Prywatny pokój czatu jeden na jednego. To ty wybierasz, z kim rozmawiasz — bez niespodzianek. Nowoczesna alternatywa dla ChatRoulette.',
    intro:
      'Jeśli trafiasz tu, szukając **ChatRoulette**, tiptalk.chat to wersja pod kontrolą: to ty decydujesz, kto wchodzi, bez przypadkowych nieznajomych.',
    paragraphs: [
      'Jeśli trafiasz tu, szukając czegoś w stylu **ChatRoulette**, tiptalk.chat robi coś podobnego, ale inaczej: to ty decydujesz, z kim rozmawiasz. Otwierasz pokój i udostępniasz link osobie albo osobom, które chcesz zaprosić do środka.',
      'Nie ma ruletki ani przypadkowych nieznajomych. To prywatny pokój jeden na jednego, kontrolowany przez ciebie. Jeśli ktoś cię krępuje, zamykasz i otwierasz kolejny. Kluczowa różnica wobec klasycznego **ChatRoulette** jest taka, że tutaj wybierasz ty, a nie los.',
      'To eliminuje typowe problemy ruletek czatu: ludzi, którzy łączą się bez kamery, niechciane treści, rozmowy trwające trzy sekundy. Tutaj pokój jest twój i wchodzi tylko ten, kogo wskażesz.',
      'Jeśli chcesz poznać nowe osoby, po prostu udostępniasz link na forum, w mediach społecznościowych albo gdzie chcesz. Kto się tobą zainteresuje, ten cię znajdzie. Ty zachowujesz kontrolę nad tym, kto wchodzi i kiedy.',
      'Działa na każdym urządzeniu z przeglądarką, a wideo, głos, tekst i napiwki masz w jednym miejscu. To jak **ChatRoulette**, ale pomyślany na rok 2026: bez pobierania, bez Flasha, bez zapisywania się do czegokolwiek.',
      'Twórcom przychodzącym z platform kamerkowych tiptalk.chat oferuje coś, czego tamte nie miały: napiwki na żywo wewnątrz czatu. To ty decydujesz, kiedy otwierasz i zamykasz, bez umów i stałej opłaty.',
      'Jeśli twój pokój ma ruch, Tipsys, które otrzymujesz, zamieniasz na euro, kiedy chcesz. Zarządzanie jest znacznie czystsze niż w jakiejkolwiek klasycznej ruletce, gdzie model zarobku był mętny albo wprost nie istniał.',
    ],
    faqs: [
      {
        q: 'Czy tiptalk.chat jest jak ChatRoulette?',
        a: 'Dzieli ideę czatu jeden na jednego z wideo, ale nie ruletkę. Tutaj to ty udostępniasz link do swojego pokoju komu chcesz, zamiast być losowo łączonym z nieznajomym przez system.',
      },
      {
        q: 'Czy mogę otworzyć publiczny pokój jak w ChatRoulette?',
        a: 'Możesz udostępnić link gdzie chcesz (fora, media społecznościowe, profil) i każdy z tym linkiem wejdzie do twojego pokoju. Ty wciąż kontrolujesz dostęp, bo możesz go w dowolnej chwili zamknąć albo ustawić PIN.',
      },
      FAQ_REGISTRO_PL,
      FAQ_PRIVACIDAD_PL,
      FAQ_MOVIL_PL,
    ],
  },
  'chat-amigos': {
    label: 'Czat ze znajomymi',
    h1: 'Czat do rozmów ze znajomymi',
    metaTitle: 'Czat ze znajomymi - Prywatne pokoje czatu - Tiptalk',
    metaDescription:
      'Prywatny czat do rozmów ze znajomymi. Tekst, głos i wideo z przeglądarki. Bez ogromnych grup i powiadomień, tylko ty i kto zechcesz.',
    intro:
      'Twój **czat ze znajomymi** bez dokładania hałasu na WhatsAppie. Prywatny pokój, głos, wideo i nic, co zostaje nagrane.',
    paragraphs: [
      'Czasem nie chcesz wrzucać rozmowy na WhatsApp ani żeby została tam na zawsze. tiptalk.chat daje ci prywatny pokój, który istnieje tylko dopóki chcesz go mieć otwarty. Pomyślany na jednorazowy **czat ze znajomymi** bez zaśmiecania reszty rozmów.',
      'Możesz wpuścić znajomego, dzielić się zdjęciami i filmami, dzwonić głosowo albo robić wideorozmowę. Gdy skończycie, zamykasz pokój i usuwa się wszystko, co zostało w nim wysłane. Nie zostaje żadna historia wisząca na twoim telefonie ani na jego.',
      'Nadaje się do ustalania planów, do długiej rozmowy z kimś z daleka albo po prostu do posiadania miejsca bez hałasu, gdzie można pogadać. Bo nie ma masowych grup, nie wpadają powiadomienia co dwie minuty, które wyrywają z tematu.',
      'Jeśli umawiasz się z koleżanką mieszkającą w innym kraju, a różnica czasu zostawia wam krótkie okno na rozmowę, otwarcie **czatu ze znajomymi** na tiptalk.chat rozwiązuje sprawę: ona wchodzi przez jeden link, ty przez drugi i zaczynacie rozmawiać bez pobierania czegokolwiek.',
      'Przy długich rozmowach system utrzymuje połączenie, nawet jeśli jedno z was w połowie przełącza się z WiFi na 4G. Jakość na chwilę spada i się odbudowuje, bez konieczności rozłączania.',
      'Ponieważ nie trzeba konta, możesz zaprosić kogoś, kto nie ma ochoty instalować kolejnej aplikacji. Potrzebuje tylko linka. Wpisuje swoje imię, wchodzi i już jest w środku.',
      'Szczególnie przydaje się, gdy istnieje trzeci kanał (partner, kuzyn, praca), gdzie jest już dużo hałasu. Otwarcie osobnego **czatu ze znajomymi** pozwala nie mieszać rozmów.',
    ],
    faqs: [
      {
        q: 'Czy moi znajomi muszą zakładać konto, żeby wejść na czat?',
        a: 'Nie. Potrzebują tylko linka, który im udostępnisz. Przy wejściu poprosi ich o pseudonim do identyfikacji w pokoju i tyle.',
      },
      {
        q: 'Czy mogę stworzyć kilka pokoi naraz dla różnych grup znajomych?',
        a: 'Tak. Każdy pokój jest niezależny i żyje tylko dopóki trzymasz go otwartym. Możesz mieć jeden ze znajomymi ze szkoły, drugi z kolegami z siłowni i trzeci z rodziną, i się nie mieszają.',
      },
      FAQ_REGISTRO_PL,
      FAQ_PRIVACIDAD_PL,
      FAQ_MOVIL_PL,
    ],
  },
  'chat-privado': {
    label: 'Czat prywatny',
    h1: 'Czat prywatny jeden na jednego',
    metaTitle: 'Czat prywatny - Prywatny czat - Tiptalk',
    metaDescription:
      'Prywatny czat jeden na jednego z wideo, głosem i napiwkami. Otwierasz pokój, udostępniasz link i wchodzi tylko ten, kogo wskażesz.',
    intro:
      'Prawdziwy **czat prywatny**: pokój jeden na jednego, bez zapisanej historii, z wideo i napiwkami w jednym miejscu.',
    paragraphs: [
      'tiptalk.chat to w gruncie rzeczy **czat prywatny** jak za dawnych czasów, tylko lepiej zbudowany. To ty decydujesz, kto wchodzi: jeśli nie masz linka, nie dotrzesz do pokoju. A nawet gdy masz link, to jeśli twórca go zamknie, przestaje działać.',
      'Domyślnie nic z tego, co dzieje się w środku, nie zostaje zapisane po zamknięciu. Usuwamy wiadomości i pliki po zakończeniu rozmowy, a po 24 godzinach pokój zamyka się sam. To różnica wobec każdej sieci społecznościowej: tutaj to, co wysyłasz, niczego nie trenuje ani nie zostaje na serwerze na zawsze.',
      'Jeśli chcesz jeszcze więcej prywatności, możesz nadać pokojowi **PIN**, żeby sam link nie wystarczał. Wtedy nawet jeśli ktoś skopiuje i udostępni link, nie wejdzie bez kodu.',
      '**Czat prywatny** obsługuje tekst, zdjęcia, krótkie filmy, połączenia głosowe i wideorozmowy. Wszystko w tym samym pokoju. Jeśli przechodzisz z czatu na wideo, a potem wracasz, nic się nie gubi: to wciąż ten sam wątek.',
      'W odróżnieniu od czatów wbudowanych w sieci społecznościowe tutaj nie ma reklam, nie ma rekomendacji, nie ma „osób, które być może znasz”. To po prostu czat. Firma nie zarabia na twoich rozmowach — zarabia na napiwkach, i tylko jeśli ty zdecydujesz się ich używać.',
      'Jeśli chodzi o prywatność techniczną: połączenia idą przez TLS, pliki przechodzą przez zaszyfrowane magazyny, a webhooki płatności spełniają standardy Stripe Connect. To nie magia ani mgliste obietnice: to standardowy stos dobrze skonfigurowany.',
      'Gdy zamykasz pokój, uruchamia się proces, który czyści wszystko, co z nim związane: media w magazynie, wiadomości w bazie danych i sam pokój. Jedyne, co przetrwa, to rejestr napiwków, który jest obowiązkowym zapisem księgowym.',
    ],
    faqs: [
      {
        q: 'Czy tiptalk.chat to naprawdę czat prywatny?',
        a: 'Tak. Pokój jest dostępny tylko dla tego, kto ma link (i PIN, jeśli go włączyłeś). Treść usuwa się po zamknięciu. Nie pokazujemy pokoi na żadnej publicznej liście.',
      },
      {
        q: 'Czy czat prywatny jest szyfrowany od końca do końca?',
        a: 'Połączenia korzystają z TLS od końca do końca na trasie przeglądarka → serwer, ale wiadomości przechodzą przez nasz backend, żeby móc rozdzielić je do odbiorców. To nie czyste E2EE jak w Signalu, ale treść usuwa się po zamknięciu pokoju.',
      },
      FAQ_REGISTRO_PL,
      FAQ_PRIVACIDAD_PL,
      FAQ_NAVEGADOR_PL,
    ],
  },
  'chat-token': {
    label: 'Czat z tokenami',
    h1: 'Czat z tokenami — Tipsys',
    metaTitle: 'Czat z tokenami - Zarabianie na czatowaniu - Tiptalk',
    metaDescription:
      'Pokój czatu z systemem tokenów (Tipsys). Otrzymuj napiwki na żywo od swojej publiczności. Zamieniaj tokeny na euro, kiedy chcesz.',
    intro:
      'tiptalk.chat działa jak **czat z tokenami**: w środku Tipsys, na zewnątrz euro. Kupujesz, wysyłasz, wypłacasz.',
    paragraphs: [
      '**Tokeny** tiptalk.chat nazywają się Tipsys. Przelicznik jest prosty: 1 € to 8 Tipsys przy zakupie. Przy wypłacie 10 Tipsys to 1 € (różnica to prowizja, która utrzymuje platformę).',
      'Gdy ktoś wysyła ci Tipsys, gromadzą się w twoim portfelu. Kiedy osiągniesz minimum (300 Tipsys = 30 € brutto), zamieniasz je na euro i wypłacasz na konto bankowe. Wypłata przechodzi przez naszego dostawcę płatności i zwykle dociera w 1-2 dni robocze.',
      'To, co widzisz wewnątrz **czatu z tokenami**, jest bezpośrednie: każdy napiwek pojawia się jako mała animacja natychmiast. Bez czekania, bez rozliczeń na koniec miesiąca, bez faktur utkniętych w skrzynce odbiorczej.',
      '**Tokeny** są idealne dla twórców, bo oddzielają decyzję „wesprę tę osobę” od decyzji „znów wyciągam kartę”. Twoja publiczność kupuje pakiet, a potem zostawia napiwki jednym kliknięciem, bez ponownego przechodzenia przez bramkę.',
      'Są pakiety po 40 (5 €), 80 (10 €), 160 (20 €) i 400 (50 €) Tipsys. Im większy pakiet, tym łatwiej twojej publiczności utrzymać nawyk bez doładowywania za każdym razem. Jeśli ktoś chce inną kwotę, decydujesz ty: pokój przyjmuje dowolne kwoty.',
      'Ponieważ **czat z tokenami** jest własnością platformy, nie ma ryzyka, że wypłata padnie przez problem z zewnętrzną bramką. Jeśli masz Tipsys w portfelu, są twoje.',
      'Co do podatków: wypłaty trafiają na twoje konto i są dochodem osobistym podlegającym podatkowi dochodowemu w Hiszpanii (albo jego odpowiednikowi w twoim kraju). Udostępniamy ci miesięczne podsumowanie w panelu, żeby łatwo było je rozliczyć.',
    ],
    faqs: [
      {
        q: 'Czym są Tipsys, wewnętrzny token tiptalk.chat?',
        a: 'To nasza wirtualna waluta napiwków. 1 € to 8 Tipsys przy zakupie, 10 Tipsys to 1 € przy wypłacie. Różnica to prowizja platformy (30%).',
      },
      {
        q: 'Czy Tipsys w portfelu tracą ważność?',
        a: 'Nie, Tipsys, które masz w portfelu, utrzymują się bezterminowo. Możesz wysyłać je jako napiwki albo wypłacić w euro po osiągnięciu minimum.',
      },
      FAQ_PROPINAS_PL,
      FAQ_PRECIO_PL,
      FAQ_REGISTRO_PL,
    ],
  },
  'chat-tips': {
    label: 'Czat z tipami',
    h1: 'Czat z tipami na żywo',
    metaTitle: 'Czat z tipami - Zarabianie na czacie - Tiptalk',
    metaDescription:
      'Otrzymuj tipy bezpośrednio na czacie. Głos, wideo i napiwki w tym samym pokoju. Bez zewnętrznych bramek, bez czekania.',
    intro:
      '**Tipy** na tiptalk.chat są wewnątrz czatu. Przycisk, kwota, animacja i gotowe.',
    paragraphs: [
      '**Tip** na tiptalk.chat to coś, co osoba po drugiej stronie może ci wysłać bez wychodzenia z czatu. Klika przycisk, wybiera ile, i animacja pojawia się natychmiast. Ty widzisz to na żywo, a druga osoba odchodzi z poczuciem, że podziękowała ci za ten czas.',
      'To znacznie bardziej bezpośrednie niż osobny przelew czy PayPal otwarty w innej karcie. **Czat z tipami** wpisuje napiwek jako kolejną wiadomość, z jej wizualną animacją i wpisem w portfelu.',
      'Sprawdza się tak samo u twórców, jak u profesjonalistów pobierających opłatę za krótką konsultację, czy u znajomych, którzy chcą postawić ci coś na odległość. Ekonomia jest ta sama: Tipsys, które się gromadzą i zamieniają na euro.',
      'Dla twórcy otrzymywanie **tipów** wewnątrz czatu ma przewagę nad modelem „zapłać na końcu”: napiwek daje się na gorąco, tuż po chwili, która skłania do podziękowania. To psychologicznie łatwiejsze niż otwieranie innej aplikacji, żeby wysłać 2 € na zimno.',
      'Animacja napiwku jest dyskretna — nie przerywa ani nie zasłania czatu. Pojawia się tylko na kilka sekund jak lecące emoji i zapisuje się w historii jako wiadomość systemowa.',
      'W przypadkach, gdy chcesz podziękować za coś konkretnego — trafną odpowiedź, żart — możesz zostawić **tip** przy danej wiadomości. Wtedy wiesz, czego dotyczył napiwek, gdy później zajrzysz do historii.',
      'Nie ma wysokiego progu: najmniejszy **tip** to 25 centów (2 Tipsys). Najwyższy jest dowolny — osoba wybiera kwotę. Jeśli twój pokój dobrze się kręci, średnie kwoty zwykle wynoszą od 50 centów do 2 €.',
    ],
    faqs: [
      {
        q: 'Czy muszę płacić, żeby wysłać tip na czacie?',
        a: 'Żeby wysyłać tipy, najpierw kupujesz Tipsys (1 € = 8 Tipsys) i wysyłasz je jednym kliknięciem w trakcie rozmowy. Nie ma dodatkowego kosztu za pojedynczy tip; kosztem jest zakup Tipsys.',
      },
      {
        q: 'Czy mogę wysyłać tipy kilku osobom naraz?',
        a: 'Twój portfel jest jeden, a Tipsys, które masz, działają w dowolnym pokoju. Jeśli otworzysz kilka pokoi, możesz wysyłać napiwki w każdym z nich z tego samego salda.',
      },
      FAQ_PROPINAS_PL,
      FAQ_PRECIO_PL,
      FAQ_PRIVACIDAD_PL,
    ],
  },
  'chatear-online': {
    label: 'Czatowanie online',
    h1: 'Czatowanie online',
    metaTitle: 'Czatowanie online - Prywatne pokoje czatu - Tiptalk',
    metaDescription:
      'Czatowanie online. Prywatny pokój z tekstem, głosem i wideo z przeglądarki. Udostępnij link i zacznij już teraz.',
    intro:
      'Żeby **czatować online** bez pobierania czegokolwiek: otwierasz pokój, udostępniasz link, rozmawiacie.',
    paragraphs: [
      '**Czatowanie online** na tiptalk.chat to otwarcie pokoju z nazwą, udostępnienie linka i gotowe. Nie proszą o konto, nie proszą o telefon, nie proszą o weryfikację SMS-em. Idziesz prosto na czat.',
      'Pokój jest tylko twój i tego, kogo zdecydujesz się zaprosić. Jeśli chcesz przejść z tekstu na wideo albo głos, to już jest w tym samym miejscu: dwa przyciski w lewym górnym rogu. Nie musisz otwierać Skype’a, Google Meet ani Zooma.',
      'Po 24 godzinach pokój zamyka się sam i wszystko, co w nim wysłaliście, znika. Jeśli chcesz więcej czasu, po prostu otwierasz kolejny. Dobrze się to sprawdza przy rozmowach, których nie chcesz gromadzić w swojej ogólnej historii.',
      'Żeby **czatować online** z kimś po drugiej stronie świata, potrzebujesz tylko dobrego łącza. Opóźnienie pozostaje niskie, bo dobieramy serwery połączeń w zależności od tego, gdzie jesteście oboje.',
      'W odróżnieniu od innych stron do **czatowania online** napiwki są tu naturalną częścią przepływu. Jeśli spodobał ci się czas z kimś, mówisz to jednym przyciskiem. Jeśli ktoś ci pomaga, doceniasz to bez otwierania innej aplikacji.',
      'Interfejs jest przejrzysty, wiadomości systemowe czytelne, a emoji i naklejki obsługuje się bez problemu. Nie ma topornych tłumaczeń ani przycisków w połowie po angielsku.',
      'Jeśli wchodzisz na czat tylko raz, na chwilę, nie musisz nawet podawać prawdziwego imienia. Wpisujesz dowolny pseudonim i już jesteś w środku.',
    ],
    faqs: [
      {
        q: 'Ile osób może czatować online naraz w jednym pokoju?',
        a: 'Pokój jest pomyślany na jeden na jednego (dwie osoby). Jeśli musisz czatować online z większą liczbą osób, lepiej otworzyć kilka pokoi albo użyć innego rodzaju narzędzia.',
      },
      {
        q: 'Czy działa do czatowania online między różnymi krajami?',
        a: 'Tak. Połączenia są kierowane przez serwery w Europie, USA i Ameryce Południowej, więc opóźnienie pozostaje niskie niezależnie od celu. Wiadomości i napiwki lecą natychmiast.',
      },
      FAQ_REGISTRO_PL,
      FAQ_MOVIL_PL,
      FAQ_NAVEGADOR_PL,
    ],
  },
};
