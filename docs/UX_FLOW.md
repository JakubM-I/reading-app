# Przeplyw UX

## Zasady Interfejsu

Interfejs ma byc spokojny, przewidywalny i czytelny. Glownym urzadzeniem jest MacBook, ale elementy powinny byc wystarczajaco duze, aby dziecko moglo klikac lub przeciagac sylaby bez frustracji.

Podstawowe zasady:

- jedno glowne zadanie na ekranie;
- widoczny postep sesji;
- jasny przycisk resetu biezacej sesji;
- panel rodzica oddzielony od obszaru dziecka;
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

### Wybor Poziomu

Rodzic wybiera poziom recznie. Przy kazdym poziomie aplikacja pokazuje krotki opis.

Przyklad:

- `Poziom 1 - proste sylaby`: sylaby otwarte i latwe slowa dwusylabowe.
- `Poziom 2 - proste zdania`: latwe slowa w krotkich zdaniach.
- `Poziom 3 - dwuznaki`: utrwalanie `ch`, `sz`, `cz`, `rz`.
- `Poziom 4 - trudniejsze dwuznaki`: `dz`, `dź`, `dż`.

### Sesja

Kazda sesja ma staly schemat:

1. Rozgrzewka.
2. Czytanie prowadzone.
3. Budowanie slow.
4. Krotkie zdanie i pytanie.
5. Podsumowanie.

Na ekranie sesji widoczne sa:

- numer zadania, np. `4 / 10`;
- aktualny typ zadania;
- obszar cwiczenia;
- sekcja oceny rodzica;
- reset biezacej sesji.

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
