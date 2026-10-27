# Balance — Sarah Herren

Einfache Landingpage mit bestehendem Balance-Logo, Steinmotiv als Hintergrund, Kontakt und beiden Praxisadressen. Der ausführliche Website-Prototyp bleibt unter `/prototyp/` erhalten und ist nicht in der Landingpage verlinkt.

## Bilder

Die Originaldateien gehören nach:

- `assets/balance.avif`
- `assets/steine.avif`

Der Build prüft, ob beide Originaldateien vorhanden sind. Fehlende Dateien verhindern eine unvollständige Veröffentlichung.

## Lokal

Node.js 22 oder neuer. Keine Laufzeit-Abhängigkeiten, kein Tracking und keine externen Fonts.

```sh
npm run dev
```

Entwicklungsserver auf Port 3000. Landingpage unter `/`, ausführlicher Entwurf unter `/prototyp/`. Änderungen nach Neuladen sichtbar. Mit `PORT=3001 npm run dev` ist ein anderer Port möglich.

```sh
npm ci
npm run build
npm run preview
```

Der Build erstellt `dist/` neu und übernimmt Landingpage, Originalbilder sowie den Unterordner `prototyp/`. Vor dem Start der Vorschau einen eventuell auf Port 3000 laufenden Entwicklungsserver beenden.

## Firebase und GitHub

Projekt: `balance-40bed`. `.github/workflows/firebase-hosting.yml` veröffentlicht bei Änderungen auf `main` und lässt sich auch manuell unter GitHub → Actions starten. Er benötigt das Repository-Secret `FIREBASE_SERVICE_ACCOUNT_BALANCE_40BED`. Dienstkonto-Schlüssel ausschliesslich als GitHub-Secret speichern, niemals im Repository oder Chat.

Das Dienstkonto benötigt geeignete Projektberechtigungen, insbesondere Firebase Hosting Admin und für die CLI-Prüfung Service Usage Viewer oder Service Usage Consumer.

Eine autorisierte lokale Firebase CLI kann alternativ deployen:

```sh
npm run build
firebase deploy --only hosting --project balance-40bed
```

Die Landingpage ist für Suchmaschinen freigegeben. `/prototyp/` bleibt durch `robots.txt` und ein `noindex`-Meta-Tag von der Indexierung ausgeschlossen; das ist keine Zugriffssperre. Beide Pfade sind nach Veröffentlichung öffentlich erreichbar.

## Inhalt

Kontaktdaten und Qualifikation stammen aus dem bereitgestellten Praxiskonzept. Impressum und Datenschutz enthalten einen ausdrücklichen Hinweis auf die noch ausstehende Bestätigung durch Sarah. Es gibt keine Online-Buchung und kein Kontaktformular. E-Mail- und Telefonlinks sind aktiv. Die eigene Domain sowie Weiterleitungen alter Wix-Adressen werden separat eingerichtet.

## Cache bei Veröffentlichungen

Der Build versieht CSS und JavaScript jeder Seite mit einem Inhalts-Hash im Dateinamen. Firebase liefert Dateien mit Revalidierung aus, damit eine neue Landingpage nicht mit zwischengespeicherten Prototyp-Styles kombiniert wird. Die Originaldateinamen bleiben für bereits geöffnete Seiten verfügbar.

## Informativer Prototyp

Der ausführliche Entwurf unter `/prototyp/` folgt der blau-weissen Farbwelt der Landingpage. Er erklärt Rolfing®, Faszientherapie und ScarWork – Narbenarbeit, die Zusammenhänge der Ansätze, den Behandlungsablauf und häufige Fragen. Kontakt bleibt per Telefon oder E-Mail; es gibt kein Reservationssystem. Das überarbeitete Konzept und die noch zu bestätigenden Inhalte stehen in `docs/konzept-prototyp.md`.
