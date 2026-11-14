/*
 * Modul 12-V – Fotos von anderen: Auf der Bühne
 *
 * Thema: Menschen, die sich freiwillig öffentlich zeigen (Sängerinnen, Sportler, Stars).
 * Auf der Bühne/im Stadion gehört Fotografieren dazu; privat haben auch sie eine Privatsphäre.
 * Einführungstext mit der Lehrkraft abgestimmt (13.11.2026).
 *
 * TODO Lehrkraft prüfen: Konzert-Aufgabe (erster Wurf), Tipps (Entwurf).
 * Bild: vorläufig aus der Folie ausgeschnitten (Freepik-Original in besserer Auflösung wäre besser).
 */
registerBlatt({
  id: "fotos-auf-der-buehne",
  nummer: "12-V",
  titel: "Fotos von anderen – Auf der Bühne",
  beschreibung: "Wenn Menschen sich zeigen wollen: Sänger, Sportler und Stars",

  tipps: [
    "Berühmte Menschen auf der Bühne oder im Stadion darf ich meistens fotografieren und das Foto zeigen.",
    "Privat haben auch berühmte Menschen eine Privatsphäre. Dann gelten dieselben Regeln wie für alle.",
    "Manchmal sind Fotos bei einem Konzert oder Auftritt verboten. Dann halte ich mich daran."
  ],

  seiten: [

    // 1. Einführung
    {
      typ: "info",
      titel: "Auf der Bühne",
      text: "Bestimmt siehst du oft Fotos von berühmten Menschen, zum Beispiel von Sängerinnen oder Sportlern. Viele fotografieren sie, ohne zu fragen, und stellen die Fotos online. Wie kann das sein?\nBerühmte Menschen zeigen sich freiwillig vor vielen Leuten. Auf der Bühne oder im Stadion gehört Fotografieren dazu. Dort darfst du sie meistens fotografieren und das Foto zeigen.\nAber privat, zum Beispiel beim Einkaufen oder beim Essen mit der Familie, gelten für sie dieselben Regeln wie für alle. Deine Lieblingssängerin darfst du also nicht heimlich beim Abendessen fotografieren und das Foto online stellen.",
      merksatz: {
        symbol: "🎤",
        begriff: "Berühmte Menschen",
        text: "Auf der Bühne zeigen sie sich freiwillig. Privat haben sie eine Privatsphäre wie alle anderen."
      }
    },

    // 2. Szene (erster Wurf, 13.11.2026). „Fotos erlaubt“ steht dabei, weil Veranstalter
    // Fotos verbieten können – so bleibt die Aufgabe eindeutig.
    {
      typ: "info",
      titel: "Beim Konzert",
      text: "Du bist auf dem Konzert von Lina und ihrer Band. Die Band ist in ganz Deutschland bekannt. Lina ist deine Lieblingssängerin!\n",
      bild: "bilder/konzert.jpg",
      bildQuelle: "Designed by Freepik"
    },

    // 3. Was darf ich mit dem Konzertfoto machen?
    {
      typ: "ja-nein", thema: "Berühmte Menschen", stufe: 1,
      frage: "Foto vom Konzert: Ist das in Ordnung?",
      antworten: ["In Ordnung", "Nicht in Ordnung"],
      bild: "bilder/konzert.jpg",
      bildQuelle: "Designed by Freepik",
      aussagen: [
        { text: "Ich fotografiere Lina und die Band auf der Bühne.", richtig: true,
          erklaerung: "Auf der Bühne zeigt sich Lina freiwillig. Fotografieren gehört beim Konzert dazu." },
        { text: "Ich schicke das Foto per Messenger (z. B. WhatsApp) an meine Freundin.", richtig: true,
          erklaerung: "Das ist in Ordnung. Man sieht, dass das Foto beim Konzert entstanden ist." },
        { text: "Ich stelle das Foto auf meinen Social-Media-Kanal (z. B. Instagram).", richtig: true,
          erklaerung: "Auch das ist meistens in Ordnung. Die Band ist bekannt, und auf dem Foto sieht man die Bühne. Lina zeigt sich dort freiwillig vor vielen Leuten." },
        { text: "Auf einem anderen Foto zieht Lina beim Singen eine lustige Grimasse. Ich stelle es online, damit alle über sie lachen.", richtig: false,
          erklaerung: "Auch berühmte Menschen darf man nicht bloßstellen. Über jemanden lachen ist nicht fair, auch nicht bei einem Star." }
      ],
      erklaerung: "Auf der Bühne zeigen sich berühmte Menschen freiwillig. Fotos davon darfst du meistens zeigen. Aber du stellst niemanden bloß."
    },

    // 4. Szene: dieselbe Sängerin privat im Urlaub (Absprache Lehrkraft 13.11.2026).
    // Bewusst nicht bewertet: das heimliche Fotografieren selbst (am Strand meist nicht verboten).
    {
      typ: "info",
      titel: "Im Urlaub",
      text: "Ein paar Wochen später machst du Urlaub am Meer. Plötzlich siehst du Lina am Strand! Sie macht dort auch Urlaub. Sie hat dich nicht bemerkt. Schnell machst du ein Foto.",
      bild: "bilder/lina-urlaub.jpg",
      bildQuelle: "Designed by Magnific"
    },

    // 5. Privat gelten dieselben Regeln wie für alle – auch wenn man das Gesicht nicht sieht.
    {
      typ: "ja-nein", thema: "Berühmte Menschen", stufe: 2,
      frage: "Lina im Urlaub: Ist das in Ordnung?",
      antworten: ["In Ordnung", "Nicht in Ordnung"],
      bild: "bilder/lina-urlaub.jpg",
      bildQuelle: "Designed by Magnific",
      aussagen: [
        { text: "Ich stelle das Foto online und schreibe dazu: „Lina macht hier Urlaub!“", richtig: false,
          erklaerung: "Im Urlaub ist Lina privat. Und alle wüssten, wo sie gerade ist." },
        { text: "Ich schicke das Foto in den Klassenchat: „Schaut mal, wen ich am Strand gesehen habe!“", richtig: false,
          erklaerung: "Im Urlaub ist Lina privat. Bevor du ein Foto von ihr teilst, fragst du sie. Das gilt auch für den Klassenchat." },
        { text: "Ich behalte das Foto nur für mich.", richtig: true,
          erklaerung: "Dann sieht es niemand sonst. Das ist in Ordnung." },
        { text: "Ich gehe zu Lina und frage höflich: „Darf ich ein Foto mit dir machen und es online stellen?“ Sie sagt Ja.", richtig: true,
          erklaerung: "Sie hat genau dazu Ja gesagt. Dann ist es in Ordnung." }
      ],
      erklaerung: "Im Urlaub ist Lina nicht auf der Bühne. Dann hat sie eine Privatsphäre wie alle anderen. Bevor du ein Foto von ihr teilst, fragst du sie."
    },

    // 6. Quiz: je eine Aufgabe zu jedem Tipp (Reihenfolge wie in „tipps“)
    {
      typ: "quiz", thema: "Berühmte Menschen", stufe: 1,
      titel: "Kurzes Quiz",
      aufgaben: [
        // zu Tipp 1
        { typ: "multiple-choice",
          frage: "Lina steht auf der Bühne. Fotos sind bei dem Konzert erlaubt. Was stimmt?",
          optionen: [
            "Ich darf sie fotografieren und das Foto meistens auch zeigen.",
            "Ich muss sie vorher fragen, sonst darf ich kein Foto machen.",
            "Berühmte Menschen darf man nie fotografieren."
          ],
          richtig: 0,
          erklaerung: "Auf der Bühne zeigt sich Lina freiwillig vor vielen Leuten. Fotografieren gehört dazu." },

        // zu Tipp 2
        { typ: "wahr-falsch",
          aussage: "Berühmte Menschen haben keine Privatsphäre. Man darf sie überall fotografieren und die Fotos online stellen.",
          richtig: false,
          erklaerung: "Auch berühmte Menschen haben eine Privatsphäre. Privat, zum Beispiel im Urlaub, gelten für sie dieselben Regeln wie für alle." },

        // zu Tipp 3
        { typ: "wahr-falsch",
          aussage: "Am Eingang steht: „Fotografieren verboten“. Lina ist berühmt, darum darf ich trotzdem fotografieren.",
          richtig: false,
          erklaerung: "Wer das Konzert veranstaltet, darf Fotos verbieten. Daran hältst du dich, auch wenn Lina berühmt ist." }
      ]
    }
  ]
});
