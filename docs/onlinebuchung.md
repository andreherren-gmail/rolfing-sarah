# Onlinebuchung: Anforderungen und technische Grundlage

## Ziel

Die Buchung wird vollständig auf der Website abgeschlossen. Kein Wechsel ins E-Mail-Programm. Kontaktdaten: Name, E-Mail und Telefonnummer. Keine medizinischen Unterlagen und keine offenen Felder für Krankengeschichten.

## Ablauf

Ort auswählen, Behandlungsart festlegen, Datum und verfügbare Uhrzeit wählen, Kontaktdaten eingeben, Buchung prüfen und abschliessen. Die Behandlungsart bestimmt die benötigte Dauer; deshalb muss sie vor der Auswahl eines verfügbaren Zeitfensters feststehen. Jeweils ein Akkordeon ist geöffnet. Kalender und Uhrzeiten werden in Europe/Zurich dargestellt, einschliesslich Sommerzeit.

Bereits belegte Zeiten werden deaktiviert dargestellt, ohne Namen oder andere Angaben der gebuchten Personen anzuzeigen. Eine veraltete Anzeige darf nicht zu einer Doppelbuchung führen: Der Server prüft und reserviert das gesamte Zeitfenster einschliesslich Pausen in einer atomaren Datenbanktransaktion. Da Sarah an beiden Standorten arbeitet, gilt die Sperre standortübergreifend.

## Technischer Vorschlag

Firebase Hosting bleibt bestehen. Serverseitige Buchungsendpunkte über Cloud Functions, Speicherung in Cloud Firestore. Die Browser erhalten keinen direkten Lese- oder Schreibzugriff auf Buchungen. Datenbankregeln sperren Kundendaten; serverseitig werden nur berechtigte Operationen ausgeführt. Bei einer bereits vorhandenen Datenbank muss die vorhandene Datenbankregion zuerst geprüft werden. Kein Standortwechsel oder Anlegen in einer anderen Region ohne Abgleich.

Verfügbarkeit muss aus bestätigten Arbeitszeiten, Behandlungsdauern, Pausen, Abwesenheiten und allfälligen bestehenden Kalenderbelegungen berechnet werden. Eine definitive Bestätigung oder ein Status «zur Freigabe» hängt von Sarahs gewähltem Ablauf ab. Keine erfundenen Öffnungszeiten, Dauern oder freien Zeitfenster.

Die bestehende Hosting-Aktion veröffentlicht keine Cloud Functions. Backend-Bereitstellung, erforderliche Projektrollen, Datenbank und Spamschutz müssen zusätzlich eingerichtet und geprüft werden. Die im GitHub-Secret hinterlegte Hosting-Berechtigung allein belegt keine ausreichende Backend-Berechtigung. Cloud Functions benötigen einen aktivierten Blaze-Tarif. Die nötigen APIs, Kontingente und tatsächlichen Gebühren sind im Projekt zu prüfen; kein kostenpflichtiger Dienst wird in diesem Schritt aktiviert.

## Spamschutz

Für den Produktivbetrieb eine App-Check-Integration mit geeignetem reCAPTCHA-Anbieter prüfen. Token müssen serverseitig verifiziert werden. Zusätzlich Eingabevalidierung und begrenzte Anfragen pro Zeitfenster vorsehen. Ein verstecktes Honeypot-Feld kann ergänzen, ersetzt aber keine serverseitige Prüfung. App Check ist kein Beweis für die Identität einer Person. Je nach Missbrauchsrisiko kann eine Bestätigung der E-Mail-Adresse mit zeitlich begrenzter Vormerkung sinnvoll sein.

## Datenschutz und Betrieb

Kontaktangaben nicht öffentlich ausliefern, nicht in URLs aufnehmen und nicht in Standardlogs schreiben. Datenschutzerklärung vor Produktivschaltung an Verarbeitung und Spamschutz anpassen. Sarah braucht einen berechtigten Weg, Abwesenheiten zu hinterlegen und Buchungen zu verwalten oder zu stornieren. Eine Bestätigung per E-Mail benötigt einen konfigurierten Versanddienst und bestätigten Absender; keine Zugangsdaten im Repository ablegen.

## Noch benötigte Entscheidungen

- Wochentage, Zeiten und Ausnahmen je Standort.
- Behandlungsdauer je Methode und Erst-/Folgetermin, Pausen und gegebenenfalls Wegezeit.
- Sofort verbindliche Buchung oder persönliche Freigabe.
- Bestehender Kalender und benötigter Abgleich.
- Blaze-Status und Berechtigungen im Firebase-Projekt.

Die Seite wurde auf Wunsch des Nutzers als lokaler Buchungsprototyp umgesetzt. Sie bleibt ausdrücklich als Demo gekennzeichnet und nimmt keine echten Buchungen entgegen.

## Abnahme

Prüfen: freie und belegte Zeitfenster, parallele Buchungen desselben Zeitfensters, Überlappungen verschiedener Behandlungsdauern und Standorte, Pausen/Abwesenheiten, ungültige und vergangene Zeitpunkte, Sommerzeit, fehlende oder ungültige Spamschutz-Tokens, Wiederholung einer Buchung nach einem Verbindungsabbruch, Schutz der Kundendaten und das gewählte Bestätigungsverfahren. Erst nach echter Backend- und Integrationserprobung online als Buchung freigeben.

## Bestätigte Demo-Vorgaben

Montag Bern, Dienstag Niederscherli, jeweils 08:00 bis 17:00. Sitzung 75 Minuten, Pause 15 Minuten. Diese Angaben wurden ausdrücklich als Prototypbeispiel freigegeben und sind keine bestätigten produktiven Öffnungszeiten. Der Nutzer möchte zunächst die Demo; kostenpflichtige Infrastruktur und echtes CAPTCHA werden dafür nicht benötigt.
