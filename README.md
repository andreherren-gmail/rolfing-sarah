# Sarah Herren — Website-Prototyp

Statischer, responsiver Entwurf auf Basis des Praxiskonzepts vom 27. Oktober 2026. Keine Laufzeit-Abhängigkeiten, externen Fonts oder Trackingdienste. Die Illustration ist ein integriertes SVG; Sarahs echtes Porträt bleibt ausdrücklich ein Platzhalter.

## Lokal starten

Node.js 22 oder neuer:

```sh
npm run dev
```

Der Entwicklungsserver läuft auf Port 3000. Änderungen nach Neuladen sichtbar.

```sh
npm run build
npm run preview
```

Der Build kopiert die öffentlichen Dateien nach `dist/`. Vorschau ebenfalls auf Port 3000; vorher den Entwicklungsserver beenden.

## Firebase

Die Konfiguration zeigt auf das vom Nutzer genannte Projekt `balance-40bed`. Es wurde noch nichts veröffentlicht und kein GitHub-Workflow eingerichtet.

Nach Inhaltsfreigabe und autorisierter Firebase-Anmeldung lässt sich mit der offiziellen Firebase CLI veröffentlichen:

```sh
npm run build
firebase deploy --only hosting --project balance-40bed
```

Vor einem produktiven Deployment: Projektzugriff prüfen, Texte mit Sarah abstimmen, Porträt und Praxisbilder ergänzen, Kontaktdaten und Qualifikation bestätigen, Tarife und Bedingungen ergänzen, vollständiges Impressum und Datenschutzerklärung erstellen und Buchungsdienst wählen. Anschliessend Prototyp-Hinweise sowie die Indexierungssperren in `index.html` und `robots.txt` anpassen. Alte Wix-URLs und ihre Weiterleitungen sind für die Migration noch zu planen.

E-Mail-, Telefon- und Kartenlinks sind aktiv; es gibt kein Kontaktformular und noch keine Online-Buchung. Google Maps wird erst nach Klick auf einen externen Link aufgerufen. Browserprozesse und Server müssen nach einem Neustart erneut gestartet werden.
