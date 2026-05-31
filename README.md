# Reading App

Lokalna aplikacja edukacyjna wspierająca naukę czytania po polsku. Projekt jest tworzony jako indywidualne narzędzie do pracy rodzica z dzieckiem, ktore konczy pierwsza klase i ma trudnosc ze skladaniem sylab w wyrazy oraz z rozumieniem prostych zdan po przeczytaniu.

## Cel

Celem pierwszej wersji jest stworzenie spokojnego, przewidywalnego narzedzia do krotkich sesji czytania. Aplikacja ma pomagac w przechodzeniu od sylaby do calego wyrazu, a nastepnie do prostego zdania.

Najwazniejsze zalozenia:

- wspolna praca rodzic + dziecko;
- sesje trwajace okolo 3-6 minut;
- jezyk polski;
- jeden lokalny profil dziecka;
- brak kont, backendu i synchronizacji w MVP;
- baza cwiczen zapisana jako pliki JSON w repo;
- lokalny zapis punktow, historii sesji i trudnych slow;
- eksport/import postepow jako kopia zapasowa JSON;
- motyw wizualny: generyczne auta, wyscigi, pojazdy, tory i odznaki kierowcy.

## Zakres MVP

Pierwsza wersja ma zawierac:

- rozgrzewke liter i dwuznakow;
- czytanie prowadzone w schemacie sylaba -> wyraz -> zdanie;
- budowanie slow z sylab;
- reczna ocene zadania przez rodzica;
- punkty i proste odznaki;
- podsumowanie dnia, tygodnia i miesiaca;
- eksport i import postepow;
- reset biezacej sesji oraz pelny reset postepow.

MVP nie obejmuje:

- kont uzytkownikow;
- backendu;
- rozpoznawania mowy;
- AI;
- pelnej gry;
- publicznego uzycia marek, postaci, nazw ani assetow chronionych prawami IP.

## Planowany Stos Techniczny

Docelowa pierwsza implementacja:

- React;
- Vite;
- TypeScript;
- statyczne pliki JSON z baza cwiczen;
- lokalny zapis danych w przegladarce;
- eksport/import postepow do pliku JSON;
- uruchamianie lokalne na MacBooku;
- pozniejszy deploy statyczny na Netlify.

Na obecnym etapie repo zawiera tylko dokumentacje projektowa. Aplikacja nie zostala jeszcze wygenerowana.

## Dokumentacja

- [Instrukcje dla agentow](AGENTS.md)
- [Specyfikacja produktu](docs/PRODUCT_SPEC.md)
- [Model nauki](docs/LEARNING_MODEL.md)
- [Przeplyw UX](docs/UX_FLOW.md)
- [Postepy i nagrody](docs/PROGRESS_AND_REWARDS.md)
- [Plan tresci](docs/CONTENT_PLAN.md)
- [Plan techniczny](docs/TECHNICAL_PLAN.md)
- [Workflow realizacji](docs/IMPLEMENTATION_WORKFLOW.md)
