/*
 * Modul 12-III – Fotos von anderen: Gruppenfotos
 *
 * Quelle: Unterrichtsfolie „Du wirst auf einem Gruppenfoto bei einer Geburtstagsfeier fotografiert…“
 *
 * Ablauf (Absprache mit der Lehrkraft vom 12.11.2026):
 *   Fragen ohne Abmachung → Abmachung „nur untereinander teilen“ → Fragen mit Abmachung.
 *   Ziel: Ein Ja gilt nur für das, wozu man Ja gesagt hat.
 * TODO Lehrkraft prüfen: Intro-Text und Tipps (Entwurf), Ja/Nein-Lösungen.
 *
 * Bild: vorläufig aus der Folie ausgeschnitten (Quelle: Magnific; Original in besserer Auflösung wäre besser).
 */
registerBlatt({
  id: "fotos-gruppenfotos",
  nummer: "12-III",
  titel: "Fotos von anderen – Gruppenfotos",
  beschreibung: "Viele Menschen auf einem Foto: Wer darf mitbestimmen?",

  tipps: [
    "Jeder auf dem Foto darf mitbestimmen. Auch ich darf Nein sagen.",
    "Ein Gruppenfoto wird nur verschickt, wenn alle auf dem Foto Ja sagen.",
    "Ein Ja gilt nur für das, was abgemacht ist. Für alles andere frage ich alle neu."
  ],

  seiten: [

    // 1. Intro (Entwurf)
    {
      typ: "info",
      titel: "Gruppenfotos",
      text: "Auf einem Gruppenfoto sind viele Menschen zu sehen. Zum Beispiel deine ganze Klasse oder alle Kinder auf einer Geburtstagsfeier. Jeder auf dem Foto darf mitbestimmen, was damit passiert. Auch du!",
      abschnitte: [
        { symbol: "✋", titel: "Dein Nein gilt", farbe: "gelb",
          text: "Wenn du nicht aufs Foto willst, darfst du das sagen." },
        { symbol: "👥", titel: "Alle müssen Ja sagen", farbe: "gruen",
          text: "Bevor ein Gruppenfoto verschickt wird, müssen alle auf dem Foto einverstanden sein. Sagt einer Nein, wird es nicht verschickt." },
        { symbol: "🤝", titel: "Ein Ja gilt nur für die Abmachung", farbe: "blau",
          text: "Habt ihr abgemacht, das Foto nur untereinander zu teilen? Dann darf es nicht einfach an andere gehen." }
      ]
    },

    // 2. Szene
    {
      typ: "info",
      titel: "Ein Gruppenfoto auf der Feier",
      text: "Du bist auf einer Geburtstagsfeier. Jemand macht ein Gruppenfoto von allen Kindern. Du bist auch auf dem Foto.",
      bild: "bilder/geburtstag-gruppenfoto.jpg",
      bildQuelle: "Designed by Magnific"
    },

    // 3. Noch nichts abgemacht
    {
      typ: "ja-nein", thema: "Gruppenfotos", stufe: 2,
      frage: "Gruppenfoto auf der Feier: Ist das in Ordnung?",
      bild: "bilder/geburtstag-gruppenfoto.jpg",
      bildQuelle: "Designed by Magnific",
      aussagen: [
        { text: "Jemand macht auf der Feier ein Gruppenfoto von allen Kindern.", richtig: true,
          erklaerung: "Ein Foto machen ist meistens in Ordnung. Wenn du nicht aufs Foto willst, darfst du das sagen." },
        { text: "Ich sage: „Ich will nicht aufs Foto.“ Trotzdem fotografiert mich jemand.", richtig: false,
          erklaerung: "Dein Nein gilt. Wer es trotzdem macht, verhält sich nicht fair." },
        { text: "Ein Kind schickt das Foto an die anderen Kinder von der Feier, ohne zu fragen.", richtig: false,
          erklaerung: "Noch ist nichts abgemacht. Vor dem Verschicken fragt man, ob alle auf dem Foto einverstanden sind." }
      ],
      erklaerung: "Ein Foto machen ist meistens in Ordnung. Zum Verschicken braucht man das Okay von allen auf dem Foto."
    },

    // 4. Die Abmachung
    {
      typ: "info",
      titel: "Eine Abmachung",
      text: "Nach der Feier reden alle über das Gruppenfoto. Die Kinder und die Erwachsenen von der Feier machen etwas ab:",
      kasten: "Wir dürfen das Foto untereinander teilen.\nAlso nur mit den Kindern und Erwachsenen, die auf der Feier waren."
    },

    // 5. Was erlaubt die Abmachung, was nicht?
    {
      typ: "ja-nein", thema: "Gruppenfotos", stufe: 2,
      frage: "Mit dieser Abmachung: Ist das in Ordnung?",
      aussagen: [
        { text: "Ein Kind schickt das Foto an die anderen Kinder von der Feier.", richtig: true,
          erklaerung: "Genau das ist abgemacht: untereinander teilen ist erlaubt." },
        { text: "Ich schicke das Foto an Oma und Opa.", richtig: false,
          erklaerung: "Oma und Opa waren nicht auf der Feier. Abgemacht war nur: untereinander teilen. Für Oma und Opa musst du erst alle auf dem Foto fragen." },
        { text: "Ein Kind stellt das Foto in den Gruppenchat seiner Fußballmannschaft.", richtig: false,
          erklaerung: "Die Fußballmannschaft war nicht auf der Feier. Das gehört nicht zur Abmachung." },
        { text: "Ich frage alle Kinder auf dem Foto: „Darf ich das Foto an meine Oma schicken?“ Alle sagen Ja. Dann schicke ich es ihr.", richtig: true,
          erklaerung: "Jetzt haben alle genau dazu Ja gesagt: zum Schicken an deine Oma. Also ist das in Ordnung." },
        { text: "Ein Erwachsener von der Feier stellt das Foto öffentlich ins Internet (z. B. auf Instagram).", richtig: false,
          erklaerung: "Abgemacht war nur, untereinander zu teilen. Das gilt auch für Erwachsene. Im Internet kann das Foto jeder sehen, auch Fremde." }
      ],
      erklaerung: "Ein Ja gilt nur für das, was abgemacht ist. Für alles andere fragt man alle auf dem Foto neu."
    },

    // 6.–8. Vertiefung
    {
      typ: "wahr-falsch", thema: "Gruppenfotos", stufe: 1,
      aussage: "Wenn ich auf einem Foto bin, darf ich mitbestimmen, ob es geteilt wird.",
      richtig: true,
      erklaerung: "Das nennt man „Recht am eigenen Bild“. Jeder Mensch darf mitbestimmen, was mit Fotos von ihm passiert. Das gilt auch für Kinder."
    },

    {
      typ: "multiple-choice", thema: "Gruppenfotos", stufe: 2,
      frage: "Du fragst, ob du das Gruppenfoto an deine Oma schicken darfst. Ein Kind sagt Nein. Was ist richtig?",
      optionen: [
        "Das Foto wird nicht an Oma geschickt.",
        "Die anderen Kinder sind mehr. Also wird es trotzdem geschickt.",
        "Es wird geschickt, wenn das Kind es nicht merkt."
      ],
      richtig: 0,
      erklaerung: "Jedes Kind auf dem Foto darf mitbestimmen. Auch wenn nur ein Kind Nein sagt, bekommt Oma das Foto nicht."
    },

    {
      typ: "eintippen", thema: "Gruppenfotos", stufe: 2,
      frage: "Auf dem Gruppenfoto sind 6 Kinder. Eins davon bist du. Wie viele Kinder musst du fragen, bevor du das Foto an deine Oma schickst?",
      akzeptiert: ["5", "fünf", "fuenf", "5 kinder", "fünf kinder"],
      erklaerung: "Du fragst alle anderen Kinder auf dem Foto. 6 Kinder minus du selbst sind 5 Kinder."
    }
  ]
});
