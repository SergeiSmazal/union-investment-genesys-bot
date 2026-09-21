```markdown
# Projekt-Roadmap: Union Investment & HDI Mission Bot

Diese Roadmap dokumentiert den aktuellen Entwicklungsstand des Genesys Cloud Architect Multi-Case-Bots und skizziert die verbleibenden Schritte bis zum vollständigen Betrieb (Go-Live).

---

## 🟢 Phase 1: Konzeption & Architektur (Abgeschlossen)
* [x] **Architektur-Design:** Festlegung des zentralen Runtime-Flows (`unioninvestment_ora_call_runtime`) mit Switch-Routing für verschiedene Cases/Missionen.
* [x] **Projekt-Dokumentation:** Erstellung eines umfassenden `README.md` zur Systemübersicht.
* [x] **Versionskontrolle:** Initialisierung des GitHub-Repositories und Strukturierung der Projektordner.

---

## 🟢 Phase 2: Implementierung Case 1 — Leben Angebot (`DIY:Leben_Angebot`) (Abgeschlossen)
* [x] **Bot Flow Setup:** Erstellung des autonomen Bot-Moduls für das Lebensversicherungs-Angebot.
* [x] **NLU Slots & Typen Konfiguration:**
  * `User_Age` (Typ: `builtin:number`)
  * `Is_Smoker` (Typ: `New List` / `Is_SmokerType` mit Werten `Ja`/`Nein` inkl. deutscher Synonyme)
  * `Coverage_Amount` (Typ: `builtin:number`)
  * `Policy_Term` (Typ: `builtin:number`)
* [x] **Dialog-Logik (In-Bot Collection):** Erstellung der sequenziellen `Ask for Slot`-Blöcke innerhalb der Task `Task_Leben_Angebot`.
* [x] **Datenübergabe-Vorbereitung:** Konfiguration der globalen `Flow.`-Variablen mit aktiviertem Output-Flag für den Parent-Flow.
* [x] **Backend Mock-Service:** Entwicklung der AWS Lambda (Node.js) Beitragsberechnungs-Logik.

---

## 🟡 Phase 3: Integration & Testing — Case 1 (In Arbeit / Nächster Schritt)
* [クス] **Genesys Data Action Einrichtung:** 
  * Erstellung einer Custom Data Action in Genesys Cloud.
  * Anbindung an das AWS API Gateway (Endpoint der Lambda-Funktion).
  * Definition von Input- und Output-Schemas (`age`, `targetSum`, `isSmoker`, `term` -> `monthlyFee`).
* [ ] **Parent Flow Routing anbinden:**
  * Einbindung des `Switch`-Blocks im Haupt-Runtime-Flow (`unioninvestment_ora_call_runtime`) für den Case `leben_angebot`.
  * Verknüpfung mit dem Block `Call Bot Flow` (`DIY:Leben_Angebot`).
* [ ] **End-to-End Test (Architect Test-Tool):**
  * Simulation von Anrufen/Interaktionen.
  * Prüfung der NLU-Spracherkennung für alle 4 Slots.
  * Validierung des API-Calls zur Lambda und korrekte TTS-Wiedergabe des berechneten Beitrags.

---

## ⚪ Phase 4: Implementierung Case 2 — Stammdaten Änderung (`Stammdaten_Aenderung`) (Geplant)
* [ ] **Bot Flow Design (`DIY:Stammdaten_Aenderung`):**
  * Erstellung des zweiten autonomen Bots für Kundenadern- und Datenupdates.
  * Definition der benötigten Slots (z. B. Kundennummer, neue Adresse, PLZ).
* [ ] **Backend-Anbindung (CRM / Mock API):**
  * Erstellung oder Anbindung einer Lambda-Funktion zur Aktualisierung von Stammdaten im Test-System.
* [ ] **Erweiterung des Haupt-Routing-Flows:**
  * Konfiguration des `Case 2` im `Switch`-Block des Haupt-Runtime-Flows (`stammdaten_aenderung`).

---

## ⚪ Phase 5: Finalisierung & Go-Live (Ausblick)
* [ ] **Error Handling & Fallbacks:**
  * Implementierung von Wiederholungsversuchen bei ungültigen Eingaben (No-Input / No-Match).
  * Fallback-Route (Transfer zu menschlichen Agenten) im Haupt-Switch (`Default`-Zweig).
* [ ] **Publishing:**
  * Finale Validierung und Veröffentlichung (Publish) aller Flows in Genesys Cloud.
* [ ] **Produktiv-Abnahme:**
  * Abschließender Test unter Realbedingungen.

```

---
