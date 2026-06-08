# Przeplyw UX

## Zasady Interfejsu

Interfejs ma byc spokojny, przewidywalny i czytelny. Glownym urzadzeniem jest MacBook, ale elementy powinny byc wystarczajaco duze, aby dziecko moglo klikac lub przeciagac sylaby bez frustracji.

Podstawowe zasady:

- jedno glowne zadanie na ekranie;
- widoczny postep sesji;
- jasny przycisk resetu biezacej sesji;
- panel rodzica oddzielony od obszaru dziecka;
- wybor modulu po starcie sesji: `Sylabizowanie` albo `Czytanie`;
- brak sesji mieszanych w MVP;
- brak rozpraszajacych animacji;
- teksty krotkie i konkretne.

## Ekrany MVP

### Start

Zawiera:

- przycisk rozpoczecia sesji;
- podglad punktow lacznych;
- wejscie do panelu postepow;
- eksport/import postepow;
- wejscie do resetu danych.

### Wybor Modulu

Po kliknieciu rozpoczecia sesji rodzic wybiera, co dziecko cwiczy:

- `Sylabizowanie`;
- `Czytanie`.

Nie ma trybu mieszanego w MVP. Tego samego dnia mozna wykonac dwie osobne
sesje, np. najpierw sylabizowanie, a potem czytanie. Podsumowania i punkty sa
liczone wspolnie.

### Wybor Poziomu

Rodzic wybiera poziom recznie. Przy kazdym poziomie aplikacja pokazuje krotki opis.

Przyklad:

- `Poziom 1 - proste sylaby`: sylaby otwarte i latwe slowa dwusylabowe.
- `Poziom 2 - proste zdania`: latwe slowa w krotkich zdaniach.
- `Poziom 3 - dwuznaki`: utrwalanie `ch`, `sz`, `cz`, `rz`.
- `Poziom 4 - trudniejsze dwuznaki`: `dz`, `dź`, `dż`.

W module sylabizowania rodzic wybiera takze tryb pomocy:

- `Z pomocą`;
- `Z podpowiedzią`;
- `Samodzielnie`.

### Sesja

Kazda sesja ma staly schemat w ramach wybranego modulu.

Sesja sylabizowania:

1. Liczenie sylab.
2. Mowienie slowa sylabami.
3. Ukladanie albo wskazywanie sylab.
4. Wstawianie podzialu.
5. Podsumowanie.

Sesja czytania:

1. Rozgrzewka.
2. Czytanie prowadzone.
3. Budowanie slow.
4. Krotkie zdanie i pytanie.
5. Podsumowanie.

Na ekranie sesji widoczne sa:

- numer zadania, np. `4 / 10`;
- wybrany modul;
- aktualny typ zadania;
- obszar cwiczenia;
- sekcja oceny rodzica;
- reset biezacej sesji.

### Sylabizowanie

Modul sylabizowania uczy dziecko wskazywania, ile czesci ma slowo i gdzie sa
granice sylab. Nie zastepuje modulu czytania i nie miesza sie z nim w jednej
sesji.

Tryby:

- `Z pomocą`: pelny podzial jest widoczny, np. `ra-kie-ta`;
- `Z podpowiedzią`: widoczna jest czesciowa pomoc, np. liczba sylab albo jedno
  miejsce podzialu;
- `Samodzielnie`: dziecko widzi caly wyraz i samo wskazuje podzial.

Typy zadan:

- policz sylaby;
- powiedz slowo sylabami;
- uloz slowo z kafelkow sylab;
- wstaw kreski podzialu w slowie.

Przyklad zadania z podpowiedzia:

- slowo: `rakieta`;
- podpowiedz: `3 sylaby`;
- dziecko wskazuje podzial: `ra-kie-ta`;
- rodzic ocenia wykonanie.

Nie dodajemy zadania z wyborem poprawnego wariantu z kilku odpowiedzi, bo moze
prowadzic do zgadywania.

#### Podpowiedz Do Sylabizowania

Podpowiedz ma byc krotka i spokojna. Moze miec forme malej sciagi dla rodzica i
dziecka.

Przyklady:

- `Znajdź samogłoski.`
- `Zwykle jedna sylaba ma jedną samogłoskę.`
- `Powiedz słowo powoli.`
- `Dwuznak trzyma się razem.`
- `Nie każde i robi osobną sylabę.`

W trybie `Z pomocą` podpowiedz moze byc widoczna. W trybie `Z podpowiedzią`
moze byc pokazana pod zadaniem. W trybie `Samodzielnie` powinna byc schowana
pod przyciskiem `Podpowiedź`.

### Rozgrzewka

Krotkie zadania na rozpoznanie liter, dwuznakow albo sylab.

Przyklady:

- pokazany znak `sz`, dziecko czyta;
- wybierz taki sam znak;
- przeczytaj sylabe `ma`;
- odroznij `dz` od `dź`.

### Czytanie Prowadzone

Etapy na ekranie:

1. Sylaby.
2. Caly wyraz.
3. Zdanie.
4. Ocena rodzica.

Aplikacja moze przechodzic etapami po kliknieciu rodzica lub dziecka. Nie powinna wymuszac automatycznego tempa.

### Budowanie Slowa

Elementy:

- wyraz docelowy albo instrukcja;
- kafelki z sylabami;
- miejsce do ulozenia slowa;
- przycisk sprawdzenia lub przejscia dalej;
- ocena rodzica.

W MVP kafelki sa ukladane kliknieciem: dziecko klika sylabe, a aplikacja przenosi ja do pola odpowiedzi. Przeciaganie mozna dodac pozniej jako usprawnienie, ale nie jest wymagane w pierwszej wersji.

### Ocena Przez Rodzica

Po zadaniu widoczny jest naglowek:

`Oceń wykonanie zadania`

Przyciski:

- `Samodzielnie`;
- `Z pomocą`;
- `Trudne`;
- `Pomiń`.

Po wyborze aplikacja przechodzi do kolejnego zadania.

### Podsumowanie Sesji

Pokazuje:

- zdobyte punkty;
- liczbe zadan;
- liczbe ocen `Samodzielnie`, `Z pomocą`, `Trudne`, `Pomiń`;
- trudne slowa z sesji;
- nowa odznake, jesli zostala zdobyta;
- przycisk powrotu do startu.

## Panel Postepow

Panel postepow pokazuje:

- punkty laczne;
- punkty dzisiaj;
- podsumowanie dnia;
- podsumowanie tygodnia;
- podsumowanie miesiaca;
- liczbe sesji;
- ostatnie trudne slowa;
- odznaki.
- przyciski `Eksportuj postępy` i `Importuj postępy`.

Podsumowania maja byc proste. Na MVP nie trzeba zaawansowanych wykresow.

## Reset

Dwa poziomy resetu:

- `Resetuj bieżącą sesję`: wraca do poczatku sesji i nie zapisuje jej wyniku.
- `Wyczyść wszystkie postępy`: usuwa lokalne punkty, historie i odznaki po wyraznym potwierdzeniu.

Pelny reset musi wymagac dodatkowego potwierdzenia.
Reset postepow nie usuwa bazy cwiczen, bo baza jest czescia aplikacji i jest zapisana w plikach JSON w repo.
