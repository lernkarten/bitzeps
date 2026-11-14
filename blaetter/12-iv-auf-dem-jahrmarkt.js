/*
 * Modul 12-IV – Fotos von anderen: Auf dem Jahrmarkt
 *
 * Quelle: Unterrichtsfolie „Du machst ein Bild einer Attraktion…“ (6 Fragen)
 * plus Lehrer-Hinweis:
 *   Kein Problem, weil: die Personen nicht das Wichtigste im Bild sind (wie die Sängerin
 *   auf der Bühne) und sie Teil einer öffentlichen Situation sind (wie Passanten auf der Straße).
 *   → Bühne/Straße kommen erst mit späteren Folien; hier nur das Riesenrad.
 *   Aber Achtung: Wenn jemand deutlich zu erkennen ist (z. B. Nahaufnahme eines Gesichts),
 *   musst du fragen.
 *
 * Aufbau (mit der Lehrkraft abgestimmt, 13.11.2026):
 *   1. Tipps kompakt erklären  2. Jahrmarkt-Foto  3.–4. Einstiegsfragen  5. Zuordnung
 *   Kein „Merke dir“ am Ende: Die Tipps sind jederzeit über den Knopf „💡 Tipps“ abrufbar.
 *
 * TODO Lehrkraft prüfen: Einstiegsfragen (Seite 3–4).
 *
 * Bild: vorläufig aus der Folie ausgeschnitten (Freepik-Original wäre besser).
 */
registerBlatt({
  id: "fotos-auf-dem-jahrmarkt",
  nummer: "12-IV",
  titel: "Fotos von anderen – Auf dem Jahrmarkt",
  beschreibung: "Wenn Menschen aus Versehen mit aufs Foto kommen",

  // Erscheinen auf Seite 1 und jederzeit hinter dem Knopf „💡 Tipps“ oben
  // Kompakt. Fremde Menschen werden NICHT gefragt, sondern unkenntlich gemacht (Absprache 13.11.2026).
  tipps: [
    "Menschen sind nur zufällig mit auf dem Foto? Das ist meistens kein Problem. Wichtig ist: Die Hauptsache auf dem Foto ist keine Person, sondern zum Beispiel das Riesenrad.",
    "Trotzdem bin ich vorsichtig, bevor ich das Foto teile. Ich schaue genau hin: Kann man jemanden gut erkennen, zum Beispiel das ganze Gesicht?",
    "Dann mache ich die Person unkenntlich, zum Beispiel durch Weichzeichnen."
  ],

  seiten: [

    // 1. Ausführliche Erklärung (die Tipps oben sind die Kurzfassung davon)
    {
      typ: "info",
      titel: "Aus Versehen mit auf dem Foto",
      text: "Manchmal lässt es sich nicht vermeiden, dass Menschen aus Versehen mit aufs Foto kommen. Stell dir vor, du bist in der Stadt und möchtest Sehenswürdigkeiten fotografieren, zum Beispiel einen Brunnen oder eine alte Kirche. Dann sind oft viele Gesichter mit auf dem Bild. Du kannst ja nicht alle vorher fragen!",
      abschnitte: [
        { symbol: "✅", titel: "Das musst du auch nicht", farbe: "gruen",
          text: "Ist die Hauptsache auf deinem Foto der Brunnen, und die Menschen sind nur zufällig mit drauf? Dann ist das meistens in Ordnung." },
        { symbol: "🔍", titel: "Trotzdem genau hinschauen", farbe: "gelb",
          text: "Bevor du das Foto teilst: Kann man ein Gesicht gut erkennen? Dann mach die Person unkenntlich. Zum Beispiel machst du das Gesicht verschwommen. Das nennt man weichzeichnen." }
      ]
    },

    // 2. Das Jahrmarkt-Foto
    {
      typ: "info",
      titel: "Auf dem Jahrmarkt",
      text: "Du bist abends auf dem Jahrmarkt. Das Riesenrad leuchtet bunt. Das sieht toll aus! Du machst ein Foto davon.\nAuf dem Foto sind auch viele Menschen zu sehen.",
      bild: "bilder/jahrmarkt-riesenrad.jpg",
      bildQuelle: "Designed by Freepik"
    },

    // 3.–4. Einstieg: einfache Fragen zum Bild
    {
      typ: "multiple-choice", thema: "Menschen im Hintergrund", stufe: 1,
      frage: "Was ist das Wichtigste auf diesem Foto?",
      bild: "bilder/jahrmarkt-riesenrad.jpg",
      bildQuelle: "Designed by Freepik",
      optionen: [
        "Das Riesenrad",
        "Die Frau vorne links",
        "Der Mann mit dem Rucksack"
      ],
      richtig: 0,
      erklaerung: "Du wolltest das Riesenrad fotografieren. Die Menschen sind nur nebenbei auf dem Foto."
    },

    {
      typ: "wahr-falsch", thema: "Menschen im Hintergrund", stufe: 1,
      aussage: "Auf dem Foto kann man die Gesichter der Menschen gut erkennen.",
      bild: "bilder/jahrmarkt-riesenrad.jpg",
      bildQuelle: "Designed by Freepik",
      richtig: false,
      erklaerung: "Die Menschen sind klein, weit weg oder von hinten zu sehen. Man erkennt sie kaum."
    },

    // 5. Zuordnung (mit der Lehrkraft abgestimmt): Fotografieren ok, vor dem Teilen auf
    // erkennbare Personen achten. Bewusst KEINE pauschale Aussage „Teilen ist erlaubt“.
    {
      typ: "zuordnen", thema: "Menschen im Hintergrund", stufe: 2, stil: "gruen-rot",
      anweisung: "Das ist dein Foto vom Jahrmarkt. Was stimmt? Zieh jede Karte in das passende Feld.",
      bild: "bilder/jahrmarkt-riesenrad.jpg",
      bildQuelle: "Designed by Freepik",
      gruppen: ["Stimmt", "Stimmt nicht"],
      karten: [
        { text: "Ich darf das Riesenrad fotografieren, auch wenn Menschen mit auf dem Foto sind.", gruppe: 0 },
        { text: "Ich darf das Foto für mich behalten.", gruppe: 0 },
        { text: "Bevor ich das Foto teile, schaue ich genau hin: Kann man jemanden deutlich erkennen? Dann mache ich sein Gesicht unkenntlich (z. B. weichzeichnen).", gruppe: 0 },
        { text: "Ich darf das Riesenrad nicht fotografieren, weil Menschen davor stehen.", gruppe: 1 },
        { text: "Bevor ich das Foto teile, muss ich alle Menschen auf dem Jahrmarkt fragen.", gruppe: 1 },
        { text: "Ganz vorne kann man eine Person deutlich erkennen. Das ist egal, ich teile das Foto einfach so.", gruppe: 1 }
      ],
      erklaerung: "Auf dem Jahrmarkt darfst du fotografieren, auch wenn Menschen mit drauf sind. Für dich behalten darfst du das Foto auch. Bevor du es teilst, schaust du genau hin: Ist jemand deutlich zu erkennen, machst du sein Gesicht unkenntlich (z. B. weichzeichnen). Alle Menschen auf dem Jahrmarkt musst du aber nicht fragen."
    }
  ]
});
