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

Das Kopfband des Prototyps bleibt beim Scrollen sichtbar. Ein Hamburger-Symbol öffnet auf Desktop und Mobilgeräten ein von rechts einschiebendes Menü mit fünf Einträgen. Auf den Einstieg folgt direkt Sarahs Vorstellung, danach die Methoden ohne Auswahlkacheln oder Abschnittsnummern. `/prototyp/preise/` zeigt eine eigene Preis- und Versicherungsseite mit ausdrücklich markierten offenen Angaben für Sarah.

## SEO und strukturierte Daten

`site.config.json` legt die aktuelle öffentliche Hauptadresse fest (`https://balance-40bed.web.app`). Bei einem Domainwechsel zuerst die neue Domain verbinden und prüfen, dann `origin` dort umstellen, neu bauen und veröffentlichen. Anschliessend Weiterleitungen von bisherigen Adressen sowie Search Console separat konfigurieren. Die Build-Ausgabe erhält Canonical-Adressen und Open-Graph-Metadaten je Seite. Die Landingpage enthält JSON-LD für Sarah, die Organisation, beide Praxisstandorte und die drei Tätigkeitsbereiche. Es werden keine Versicherungsanerkennungen, Öffnungszeiten, Bewertungen oder Preise erfunden.

`dist/sitemap.xml` enthält ausschliesslich die Landingpage. Die ausgelieferte `robots.txt` verweist auf diese Sitemap; `/prototyp/` bleibt gesperrt und alle Entwurfsseiten behalten `noindex, nofollow`. Eine robots.txt-Sperre verhindert das Crawlen und ist keine Garantie für eine Entfernung bereits indexierter URLs. Wenn Entwurfsseiten bereits in einer Suche erscheinen, gezielt Crawling für das Erkennen von `noindex` erlauben oder geeignete Entfernungsmassnahmen prüfen. Diese Regeln erst bei der inhaltlichen Freigabe ändern.

Die SEO-Ergänzungen entstehen im Build: für ihre Prüfung `npm run build` und `npm run preview` verwenden. Der einfache Entwicklungsserver liefert die Quelldateien ohne die zusätzlich erzeugten SEO-Tags. Die Bilddateien Faszien, Narbe und Praxisplatzhalter werden als WebP ausgeliefert. Ihre PNG-Originale bleiben im Repository, werden aber nicht ins Deployment kopiert.

Noch ausserhalb des Codes offen: Hauptdomain verbinden, Google Search Console verifizieren und Sitemap einreichen, Google-Unternehmensprofile je berechtigtem Standort prüfen und Fachverzeichnisse auf einheitliche Praxisdaten abgleichen. Fachliche Autorenschaft, Preise und Anerkennungen erst nach Sarahs Bestätigung vervollständigen; diese Optimierungen garantieren keine Rankings oder KI-Zitate.

## Terminassistent

`/prototyp/termin/` ist ein clientseitiger Assistent für eine **Terminanfrage**, keine Echtzeitbuchung. Ein sichtbarer Button auf den Prototypseiten öffnet die Auswahl von Ort, Datum/Zeit und Behandlung. Er erstellt eine Zusammenfassung und einen `mailto:`-Link. Es wird nichts automatisch gesendet, reserviert oder dauerhaft gespeichert. Ohne E-Mail-Programm steht ein kopierbarer Anfragetext bereit. Freie Termine, verbindliche Dauer und Tarife sind nicht hinterlegt. Der Nutzer ergänzt seinen Namen im E-Mail-Programm; Sarah bestätigt den Termin persönlich. `prototyp/termin.js` wird beim Build wie die übrigen Skripte mit einem Inhalts-Hash ausgeliefert.
