# union-investment-genesys-bot
Вот подробный и структурированный файл **README.md**, описывающий весь проект целиком, включая архитектуру, логику распределения по кейсам, реализацию первого сценария (`Leben_Angebot`) и план для последующих модулей.

```markdown
# Projekt-Dokumentation: Union Investment & HDI — Self-Service & Mission Bot Flow (Genesys Cloud Architect)

## 1. Projektübersicht und Zielsetzung
Dieses Projekt implementiert eine automatisierte Self-Service-Steuerung (Mission Bot Flow) innerhalb der Genesys Cloud Architect Umgebung für eine Investment- und Versicherungsplattform. 
Das Hauptziel ist es, eingehende Kundenanfragen vollautomatisch (ohne sofortige Einbindung von Agenten) über intelligente Sprach- oder Chat-Bots zu bearbeiten, Daten direkt im Dialog zu erfassen, diese über ein externes Backend (AWS Lambda via Data Actions) zu verarbeiten und das Ergebnis dem Kunden auszuspüren.

Das System basiert auf einer mandanten- und missionsorientierten Architektur (u. a. für die Marken Union Investment und HDI), bei der ein zentraler Einstiegs-Routing-Flow eingehende Anfragen analysiert und an spezifische **Cases (Missionen)** verteilt.

---

## 2. Architektur & Routing-Struktur (Main Call Flow)
Der Haupt-Runtime-Flow (`unioninvestment_ora_call_runtime`) steuert die Entgegennahme des Kontakts und leitet diesen über einen zentralen **Switch-Block** basierend auf dem erkannten Service-Typ (Mission) weiter:

* **Case 1 (`leben_angebot`):** Steuert den Prozess für das Beitragsangebot der Lebensversicherung (HDI). Ruft den autonomen Bot `DIY:Leben_Angebot` auf.
* **Case 2 (`stammdaten_aenderung`):** Reserviert für die Änderung von Kundendatensätzen, Adressen oder Stammdaten.
* **Default:** Fallback-Route (z. B. Weiterleitung an einen menschlichen Agenten oder geordneter Ausstieg).

---

## 3. Detaillierte Implementierung: Case 1 (`DIY:Leben_Angebot`)

Der Bot für die Lebensversicherung wurde als autarker **Bot Flow** konzipiert, der die Datenerfassung vollständig im Dialog durchführt (In-Bot Collection) und die Daten für nachgelagerte Integrationen bereitstellt.

### A. Erfasste Parameter (Slots)
Der Bot sammelt sequenziell vier essenzielle Datenpunkte über NLU-gestützte `Ask for Slot`-Blöcke auf Deutsch:
1. **`User_Age`** (Typ: `builtin:number`) — Das aktuelle Alter des Kunden in Jahren.
2. **`Is_Smoker`** (Typ: `New List` / `Is_SmokerType`) — Raucherstatus mit vordefinierten Werten und Synonymen:
   * `Ja` (Synonyme: *Raucher, ja ich rauche, schon, jo*).
   * `Nein` (Synonyme: *Nichtraucher, nein ich rauche nicht, niemals, kein Raucher*).
3. **`Coverage_Amount`** (Typ: `builtin:number`) — Gewünschte Versicherungssumme in Euro.
4. **`Policy_Term`** (Typ: `builtin:number`) — Gewünschte Laufzeit der Versicherung in Jahren.

### B. Datenübergabe (Data Handover)
* Die im Bot gesammelten Slots werden am Ende des Bot-Flows über globale Variablen mit dem Präfix `Flow.` (und aktivierter Option *Output from flow*) an den übergeordneten Parent-Flow übergeben.
* Der Parent-Flow reicht diese Parameter gebündelt an eine **Genesys Data Action** weiter.

---

## 4. Backend-Integration (Mock-Service / AWS Lambda)
Die Berechnungen für das Versicherungsangebot erfolgen über einen externen Mock-Service (AWS Lambda mit API Gateway Endpoint).

* **Input-Schema (Beispiel):**
  ```json
  {
    "age": "40",
    "targetSum": "50000",
    "isSmoker": "Ja",
    "term": "20"
  }

```

* **Logik (AWS Lambda / Node.js Mock):**
Die Funktion verarbeitet die Parameter (Berücksichtigung von Risikofaktoren wie Alter und Raucherstatus) und gibt einen kalkulierten monatlichen oder jährlichen Beitrag zurück.
* **Output-Schema (Beispiel):**
```json
{
  "monthlyFee": 45.50,
  "currency": "EUR",
  "status": "success"
}

```



---

## 5. Nächste Schritte & Roadmap

1. **Finalisierung der Data Action:** Anbindung des AWS API Gateways an Genesys Cloud für `DIY:Leben_Angebot`.
2. **Implementierung von Case 2 (`Stammdaten_Aenderung`):** Erstellung und Anbindung des zweiten Bots für die Aktualisierung von Kundendaten im Haupt-Switch-Flow.
3. **End-to-End Testing:** Durchführung von Testläufen über das Architect Test-Tool (NLU-Erkennung und API-Antworten).

```

---
Хотите, чтобы мы сразу перешли к проектированию и настройке **Case 2 (Stammdaten Änderung)** или нужно что-то скорректировать в этом описании проекта?

```
