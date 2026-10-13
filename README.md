# Lernraum — GitHub Pages

Dieses fertige Paket benötigt keine Anmeldung, keine Installation von Node und keinen Server mit eigener Logik. Enthalten: Controlling Basics: 202 Fragen; Consumer Behavior: 373 Fragen (Theorie + Practical); Human Resource Management: 574 Fragen (Theorie + Practical). Controlling enthält 90 Original-Teilaufgaben und 30 neue Übungsvarianten. Consumer Behavior enthält Theoriefragen, einen Practical-Trainer und offene Seminaraufgaben mit englischen Lernhinweisen. Sein Stofffilter enthält Midterm 1 (Lectures 1–4 laut Seminar 1) und den bereits gelieferten Teil von Midterm 2 (Lecture 5). Human Resource Management verbindet Lectures 1–6 mit originalen Prüfungsübungen und dem Practical-Trainer zu Fallstudien, Managementprinzipien, Führungsstilen und Total Rewards. Seine genauen Midterm-Grenzen sind in den gelieferten Unterlagen nicht angegeben; deshalb erfolgt die Auswahl nach Lecture. Die offenen Originalaufgaben stehen separat mit zweisprachigen Lernhinweisen bereit. Alle Multiple-Choice-Fragen haben deutsche und englische Erklärungen, einschließlich der Begründungen zu jeder Antwortoption; für die meisten Fragen gibt es zusätzlich italienische Erklärungen. Beim ersten Start erklärt eine kurze visuelle Einführung die Bedienung; danach erscheint die Fächerauswahl. Die Einführung kann übersprungen und später über „Einführung ansehen“ wiederholt werden. Jede Quizfrage hat außerdem „Warum diese Frage?“ mit Lernziel, möglichem Prüfungsformat und nachvollziehbarem Materialbezug, auch auf Italienisch; dies ist keine Vorhersage der Prüfung.

## Veröffentlichen

1. Entpacke Lernraum-GitHub-Pages.zip.
2. Lade den gesamten Inhalt des Ordners in dein GitHub-Repository hoch, sodass index.html direkt im Hauptverzeichnis liegt. Nicht die ZIP-Datei hochladen. Alle Dateien müssen zusammenbleiben, einschließlich offline-shell.txt und service-worker.js.
3. Öffne im Repository Settings → Pages → Build and deployment. Wähle Source: Deploy from a branch, Branch: main (bzw. deinen Branch), Folder: / (root), dann Save.
4. Warte auf die von GitHub angezeigte Seitenadresse. Sie sieht bei einem Projekt etwa so aus: https://DEIN-NAME.github.io/DEIN-REPOSITORY/ . Nutze die Adresse der Seite, nicht die GitHub-Dateiansicht.
5. Aktiviere Enforce HTTPS, sobald GitHub die Option anbietet. Das Offline-System benötigt HTTPS. Es unterstützt auch den Unterordner eines Projekt-Repositorys.

GitHub Pages ist bei der hier beschriebenen öffentlichen Veröffentlichung ohne ChatGPT-Anmeldung erreichbar. Der Inhalt der veröffentlichten Seite ist öffentlich.

## Auf dem iPhone

Öffne deine GitHub-Pages-Adresse in Safari → Teilen → Zu Home-Bildschirm hinzufügen → gegebenenfalls Als Web-App öffnen → Hinzufügen. Starte anschließend die installierte App einmal online. Öffne unten „App & Offline“: Wenn dort „Offline bereit“ steht, ist die Einrichtung abgeschlossen. Der bestätigte Status wird nur hier angezeigt; Hinweise zu Einrichtung, Problemen oder einem verfügbaren Update bleiben oben sichtbar. Teste danach einen Neustart im Flugmodus.

## Darstellung

Der Schalter neben „Fächer“ aktiviert den Darkmode. Ohne gespeicherte Auswahl folgt das Design der Geräteeinstellung. Eine manuelle Auswahl bleibt auf diesem Gerät gespeichert und ändert keine Antworten oder Lernrunden.

Über „Deutsch / Italiano“ wechselst du die Bedienoberfläche. Die Sprachwahl bleibt auf diesem Gerät gespeichert. Fragen und Antwortoptionen bleiben auf Englisch; viele Multiple-Choice-Fragen bieten zusätzlich italienische Erklärungen, Hinweise zu den Antwortoptionen und Begründungen ihres Materialbezugs. Die vorhandenen deutschen und englischen Erklärungen bleiben verfügbar. Der Sprachwechsel verändert deinen Lernfortschritt nicht.

## Fortschritt und Updates

Antworten und Runden bleiben auf dem jeweiligen Gerät und sind nach Fach getrennt. Beim Fachwechsel bleibt eine laufende Runde erhalten. Fortschritt wird nicht über iCloud synchronisiert. Eine neue Internetadresse ist für den Browser ein neuer Speicherort; die bisherige ChatGPT-Seite oder lokale Datei überträgt ihren Fortschritt nicht automatisch zu GitHub Pages.

Für eine aktualisierte Version ersetzt du das vollständige Paket. Bei einem bereitstehenden Update alle Fenster dieser Lern-App schließen und online erneut öffnen. iOS kann lokale Website-Daten entfernen, etwa beim Löschen der Browserdaten.

## Dateien

- index.html: komplette Lernoberfläche und Fragen, auch mit Fächerauswahl
- offline-shell.txt: identische HTML-Daten für die geprüfte Offline-Speicherung
- pwa-client.js + service-worker.js: Offline-Einrichtung und Updates
- manifest.webmanifest + PNG-Dateien: iPhone-/Web-App-Darstellung
- .nojekyll: statische Veröffentlichung ohne Jekyll-Verarbeitung

Die separat gelieferte Lernraum.html ist eine Ein-Datei-Sicherung für den Browser. Für die installierbare iPhone-App veröffentliche dieses vollständige Paket.

Offizielle Hilfe: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
Apple: https://support.apple.com/de-de/guide/iphone/iphea86e5236/ios
