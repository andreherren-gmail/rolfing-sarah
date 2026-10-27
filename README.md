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

Die Konfiguration zeigt auf das vom Nutzer genannte Projekt `balance-40bed`. Ein GitHub-Workflow für automatische Deployments von `main` ist eingerichtet. Er benötigt das Repository-Secret `FIREBASE_SERVICE_ACCOUNT_BALANCE_40BED`; ohne dieses Secret kann er nicht veröffentlichen. Ein erfolgreiches Deployment wurde noch nicht bestätigt.

Nach Inhaltsfreigabe und autorisierter Firebase-Anmeldung lässt sich mit der offiziellen Firebase CLI veröffentlichen:

```sh
npm run build
firebase deploy --only hosting --project balance-40bed
```

Vor einem produktiven Deployment: Projektzugriff prüfen, Texte mit Sarah abstimmen, Porträt und Praxisbilder ergänzen, Kontaktdaten und Qualifikation bestätigen, Tarife und Bedingungen ergänzen, vollständiges Impressum und Datenschutzerklärung erstellen und Buchungsdienst wählen. Anschliessend Prototyp-Hinweise sowie die Indexierungssperren in `index.html` und `robots.txt` anpassen. Alte Wix-URLs und ihre Weiterleitungen sind für die Migration noch zu planen.

E-Mail-, Telefon- und Kartenlinks sind aktiv; es gibt kein Kontaktformular und noch keine Online-Buchung. Google Maps wird erst nach Klick auf einen externen Link aufgerufen. Browserprozesse und Server müssen nach einem Neustart erneut gestartet werden.

## Automatische Veröffentlichung

Der Workflow `.github/workflows/firebase-hosting.yml` baut die Website und veröffentlicht den Stand von `main` im Firebase-Projekt `balance-40bed`. Er lässt sich auch manuell unter GitHub → Actions starten.

Benötigt wird ein Firebase-Servicekonto mit Zugriff auf Hosting in diesem Projekt. Dessen JSON-Schlüssel ausschliesslich als GitHub Actions Repository-Secret `FIREBASE_SERVICE_ACCOUNT_BALANCE_40BED` hinterlegen, niemals im Repository oder Chat. Die offizielle Firebase CLI kann die GitHub-Anbindung mit `firebase init hosting:github --project balance-40bed` in einer autorisierten lokalen Umgebung einrichten. Bereits vorhandene Hosting-Konfiguration und den Workflow dabei erhalten.

Die Indexierungssperre bleibt für diesen ausdrücklich als Entwurf gekennzeichneten Prototyp aktiv. Sie ist keine Zugriffssperre: Ein Deployment im Live-Kanal ist öffentlich erreichbar.
