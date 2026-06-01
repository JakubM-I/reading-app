# Czytanie krok po kroku

Lokalna aplikacja edukacyjna wspierająca krótkie ćwiczenia czytania po polsku.
Projekt jest tworzony jako spokojne, przewidywalne narzędzie do wspólnej pracy
rodzica z dzieckiem.

Najważniejsze założenia MVP:

- wspólna praca rodzic + dziecko;
- sesje trwające około 3-6 minut;
- jeden lokalny profil dziecka;
- brak kont, backendu i synchronizacji;
- baza ćwiczeń zapisana jako statyczne pliki JSON w repozytorium;
- lokalny zapis punktów, historii sesji i trudnych słów;
- eksport/import postępów jako kopia zapasowa JSON;
- spokojny motyw: generyczne auta, pojazdy, tory i odznaki kierowcy.

## Etap 1

Aktualny stan obejmuje przygotowanie statycznej bazy ćwiczeń:

- React + Vite + TypeScript;
- podstawowe skrypty `dev`, `build`, `lint` i `preview`;
- spokojny placeholder aplikacji;
- minimalne katalogi pod przyszłe obszary: `content`, `session`, `progress`, `components`, `storage`.
- statyczne pliki JSON: `levels.json`, `syllables.json`, `words.json`, `sentences.json`;
- prostą walidację struktury danych.

Sesja, wybór poziomu, ocena zadań i zapis postępów pojawią się w kolejnych etapach.

## Dokumentacja

- [Instrukcje dla agentów](AGENTS.md)
- [Specyfikacja produktu](docs/PRODUCT_SPEC.md)
- [Model nauki](docs/LEARNING_MODEL.md)
- [Przepływ UX](docs/UX_FLOW.md)
- [Postępy i nagrody](docs/PROGRESS_AND_REWARDS.md)
- [Plan treści](docs/CONTENT_PLAN.md)
- [Plan techniczny](docs/TECHNICAL_PLAN.md)
- [Workflow realizacji](docs/IMPLEMENTATION_WORKFLOW.md)

## Uruchamianie

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Walidacja treści

```bash
npm run validate:content
```
