# 📋 Projekt-Dokumentation: Union Investment & HDI Self-Service & Mission Bot Flow

**Genesys Cloud Architect**

---

## 1. Projektübersicht und Zielsetzung

Dieses Projekt implementiert eine automatisierte Self-Service-Steuerung (**Mission Bot Flow**) innerhalb der Genesys Cloud Architect Umgebung für eine Investment- und Versicherungsplattform.

### Hauptziele

✨ **Vollautomatisierte Kundenabwicklung**  
Eingehende Kundenanfragen werden automatisch (ohne sofortige Einbindung von Agenten) über intelligente Sprach- oder Chat-Bots bearbeitet.

💾 **Datenerfassung im Dialog**  
Der Bot sammelt relevante Daten direkt im Kundengespräch über strukturierte Slots und Natural Language Understanding (NLU).

🔗 **Backend-Integration**  
Die erfassten Daten werden über ein externes Backend (AWS Lambda via Data Actions) verarbeitet und das Ergebnis dem Kunden präsentiert.

🏢 **Multi-Brand-Unterstützung**  
Das System basiert auf einer mandanten- und missionsorientierten Architektur für die Marken **Union Investment** und **HDI**.

---

## 2. Architektur & Routing-Struktur

### Haupt-Runtime-Flow

Der zentrale Einstiegs-Flow **`unioninvestment_ora_call_runtime`** steuert die gesamte Anfrage-Verarbeitung:

```
Eingehende Anfrage
    ↓
[Kontakt-Entgegennahme]
    ↓
[Switch-Block: Service-Typ Erkennung]
    ↙        ↓         ↘
  Case 1   Case 2   Default
  (Leben)  (Daten)  (Fallback)
    ↓        ↓         ↓
  Bot 1    Bot 2    Agent
```

### Service-Cases (Missionen)

| Case | Flow-Name | Beschreibung | Status |
|------|-----------|-------------|--------|
| **Case 1** | `leben_angebot` | Beitragsangebot der Lebensversicherung (HDI) | ✅ Aktiv |
| **Case 2** | `stammdaten_aenderung` | Änderung von Kundendatensätzen und Adressen | 🔄 In Arbeit |
| **Default** | `fallback` | Weiterleitung an menschlichen Agenten | 📋 Geplant |

---

## 3. Detaillierte Implementierung: Case 1 (`DIY:Leben_Angebot`)

Der Bot für die Lebensversicherung wurde als **autarker Bot Flow** konzipiert. Er führt die Datenerfassung vollständig im Dialog durch (In-Bot Collection) und stellt die Daten für nachgelagerte Integrationen bereit.

### A. Erfasste Parameter (Slots)

Der Bot sammelt sequenziell vier essenzielle Datenpunkte über NLU-gestützte `Ask for Slot`-Blöcke auf Deutsch:

#### 1. **`User_Age`** — Kundenalter
- **Datentyp:** `builtin:number`
- **Beschreibung:** Das aktuelle Alter des Kunden in Jahren
- **Beispiel-Input:** "Ich bin 40 Jahre alt" → `40`

#### 2. **`Is_Smoker`** — Raucherstatus
- **Datentyp:** `New List` / `Is_SmokerType`
- **Beschreibung:** Raucher- oder Nichtraucherstatus
- **Vordefinierte Werte:**
  - `Ja` — Synonyme: *Raucher, ja ich rauche, schon, jo*
  - `Nein` — Synonyme: *Nichtraucher, nein ich rauche nicht, niemals, kein Raucher*
- **Beispiel-Input:** "Ich bin Raucher" → `Ja`

#### 3. **`Coverage_Amount`** — Versicherungssumme
- **Datentyp:** `builtin:number`
- **Beschreibung:** Gewünschte Versicherungssumme in Euro
- **Beispiel-Input:** "Ich möchte fünfzigtausend Euro" → `50000`

#### 4. **`Policy_Term`** — Versicherungslaufzeit
- **Datentyp:** `builtin:number`
- **Beschreibung:** Gewünschte Laufzeit der Versicherung in Jahren
- **Beispiel-Input:** "Für zwanzig Jahre" → `20`

### B. Dialogflow & User Experience

```
Bot:    "Guten Tag! Ich helfe Ihnen gerne bei einem Lebensversicherungs-Angebot."
User:   "Gerne, danke."

Bot:    "Wie alt sind Sie?"
User:   "Ich bin 40 Jahre alt."
→ [User_Age = 40]

Bot:    "Vielen Dank. Rauchen Sie?"
User:   "Nein, ich bin Nichtraucher."
→ [Is_Smoker = Nein]

Bot:    "Wie hoch soll die Versicherungssumme sein?"
User:   "Fünfzigtausend Euro bitte."
→ [Coverage_Amount = 50000]

Bot:    "Für welchen Zeitraum?"
User:   "Zwanzig Jahre."
→ [Policy_Term = 20]

Bot:    "Perfekt! Ich berechne Ihnen ein Angebot..."
        [Übergabe an Backend]
```

### C. Datenübergabe (Data Handover)

**Ausgabe-Konfiguration:**

- Im Bot-Flow werden alle gesammelten Slots in **globale Variablen** mit dem Präfix `Flow.` umgewandelt
- Option ***Output from flow*** muss aktiviert sein
- Der übergeordnete **Parent-Flow** empfängt diese Variablen automatisch
- Der Parent-Flow reicht alle Parameter gebündelt an eine **Genesys Data Action** weiter

**Beispiel Variablen-Struktur:**
```
Flow.User_Age = 40
Flow.Is_Smoker = "Nein"
Flow.Coverage_Amount = 50000
Flow.Policy_Term = 20
```

---

## 4. Backend-Integration (AWS Lambda & Mock-Service)

Die Berechnungen für das Versicherungsangebot erfolgen über einen externen **Mock-Service** (AWS Lambda mit API Gateway Endpoint).

### Anfrage-Schema (Input)

```json
{
  "age": "40",
  "isSmoker": "Nein",
  "targetSum": "50000",
  "term": "20"
}
```

### Antwort-Schema (Output)

```json
{
  "monthlyPremium": 85.50,
  "totalPremium": 20520.00,
  "offerId": "OFF-2024-001",
  "validUntil": "2024-12-31",
  "status": "success"
}
```

### Genesys Data Action Integration

- **Endpoint-Typ:** HTTP POST
- **Target-URL:** `https://<API-ID>.execute-api.<REGION>.amazonaws.com/prod/calculate-premium`
- **Authentifizierung:** AWS IAM Signature v4
- **Request-Format:** JSON
- **Antwort-Format:** JSON

---

## 5. Case 2: Stammdaten Änderung (Ausblick)

### Geplante Funktionalität

Der zweite Bot-Flow `DIY:Stammdaten_Aenderung` wird für folgende Szenarien eingesetzt:

#### Erfasste Slots (geplant)
- `Customer_ID` — Eindeutige Kundennummer
- `Change_Type` — Art der Änderung (Adresse, Telefon, Email, etc.)
- `New_Address` — Neue Adressdaten (optional)
- `New_Phone` — Neue Telefonnummer (optional)
- `New_Email` — Neue E-Mail-Adresse (optional)

#### Backend-Verarbeitung
- Validierung der Kundendaten in der Unternehmensdatenbank
- Aktualisierung der Stammdaten
- Bestätigung per E-Mail an den Kunden
- Logging und Audit-Trail

---

---

**Status:** 🔄 In aktiver Entwicklung  
**Letzte Aktualisierung:** 2024  
**Projekt:** Union Investment & HDI Self-Service Bot
