# 🚀 Projekt-Roadmap: Union Investment & HDI Mission Bot

**Genesys Cloud Architect Multi-Case-Bot**

Diese Roadmap dokumentiert den aktuellen Entwicklungsstand des Genesys Cloud Architect Multi-Case-Bots und skizziert die verbleibenden Schritte bis zum vollständigen Betrieb (Go-Live).

---

## 🟢 Phase 1: Konzeption & Architektur

**Status:** ✅ Abgeschlossen

- [x] **Architektur-Design**  
  Festlegung des zentralen Runtime-Flows (`unioninvestment_ora_call_runtime`) mit Switch-Routing für verschiedene Cases/Missionen.

- [x] **Projekt-Dokumentation**  
  Erstellung eines umfassenden `README.md` zur Systemübersicht.

- [x] **Versionskontrolle**  
  Initialisierung des GitHub-Repositories und Strukturierung der Projektordner.

---

## 🟢 Phase 2: Implementierung Case 1 — Lebensversicherungs-Angebot

**Flow-Name:** `DIY:Leben_Angebot`  
**Status:** ✅ Abgeschlossen

### Implementierte Komponenten

- [x] **Bot Flow Setup**  
  Erstellung des autonomen Bot-Moduls für das Lebensversicherungs-Angebot.

- [x] **NLU Slots & Typen Konfiguration**
  - `User_Age` (Typ: `builtin:number`)
  - `Is_Smoker` (Typ: `New List` / `Is_SmokerType` mit Werten `Ja`/`Nein` inkl. deutscher Synonyme)
  - `Coverage_Amount` (Typ: `builtin:number`)
  - `Policy_Term` (Typ: `builtin:number`)

- [x] **Dialog-Logik (In-Bot Collection)**  
  Erstellung der sequenziellen `Ask for Slot`-Blöcke innerhalb der Task `Task_Leben_Angebot`.

- [x] **Datenübergabe-Vorbereitung**  
  Konfiguration der globalen `Flow.`-Variablen mit aktiviertem Output-Flag für den Parent-Flow.

---

## 🟢 Phase 3: Implementierung Case 2 — Stammdaten Änderung

**Flow-Name:** `DIY:Stammdaten_Aenderung`  
**Status:** 🔄 In Planung

### Geplante Arbeitsschritte

- [x] **Bot Flow Design**
- [x] **Bot Flow Design**
  - Erstellung des zweiten autonomen Bots für Kundenadreß- und Datenupdates
  - Definition der benötigten Slots (z. B. Kundennummer, neue Adresse, PLZ)

- [x] **Datenübergabe-Vorbereitung**  
  Konfiguration der globalen `Flow.`-Ausgabevariablen für den Parent-Flow.

---

## 🟢 Phase 4: Zentraler Backend-Service

**Technologie:** AWS Lambda & API Gateway  
**Status:** 🔄 In Planung

- [x] **Unifizierte AWS Lambda Entwicklung**
  - Erstellung einer zentralen Node.js Lambda-Funktion
  - Entgegennahme von Anfragen für beide Cases (Berechnung vs. Stammdatenänderung)
  - Routing-Typ-basierte Verarbeitung

- [x] **API Gateway Deployment**
  - Bereitstellung des gemeinsamen HTTP-Endpoints für den Zugriff aus Genesys Cloud

---

## 🟢 Phase 5: Genesys Data Actions & Parent-Flow Routing

**Status:** 🔄 In Planung

- [x] **Genesys Data Actions Einrichtung**
  - Erstellung der Custom Data Actions (oder einer unifizierten Action)
  - Kommunikation mit dem AWS API Gateway
  - Definition der Input- und Output-Schemas für beide Geschäftsvorgänge

- [x] **Parent Flow Routing anbinden**
  - Vollständige Konfiguration des `Switch`-Blocks im Haupt-Runtime-Flow (`unioninvestment_ora_call_runtime`)
  - Routing für `leben_angebot` und `stammdaten_aenderung`
  - Verknüpfung mit den jeweiligen `Call Bot Flow`-Blöcken

- [x] **End-to-End Test (Architect Test-Tool)**
  - Simulation von Interaktionen für beide Cases
  - Prüfung der NLU-Erkennung
  - Validierung der API-Antworten

---

## ⚪ Phase 6: Finalisierung & Go-Live

**Status:** 📋 Ausblick

- [ ] **Error Handling & Fallbacks**
  - Implementierung von Wiederholungsversuchen bei ungültigen Eingaben
  - Fallback-Routen (Transfer zu Agenten)

- [ ] **Publishing**
  - Finale Validierung aller Flows in Genesys Cloud
  - Veröffentlichung (Publish) der Produktionsversion

- [ ] **Produktiv-Abnahme**
  - Abschließender Test unter Realbedingungen
  - Go-Live und Monitoring

---

## 📊 Fortschrittsübersicht

| Phase | Beschreibung | Status |
|-------|-------------|--------|
| 1 | Konzeption & Architektur | ✅ Abgeschlossen |
| 2 | Case 1: Leben Angebot | ✅ Abgeschlossen |
| 3 | Case 2: Stammdaten Änderung | 🔄 In Planung |
| 4 | Backend-Service (AWS Lambda) | 🔄 In Planung |
| 5 | Genesys Integration & Routing | 🔄 In Planung |
| 6 | Finalisierung & Go-Live | ⏳ Ausblick |

---

**Letzte Aktualisierung:** 2024  
**Projekt-Verantwortliche:** Union Investment & HDI
