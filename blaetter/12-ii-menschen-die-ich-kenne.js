/*
 * Modul 12-II – Fotos von anderen: Menschen, die ich kenne
 *
 * Quelle: Unterrichtsfolie „Du machst ein Bild von deiner Schwester und deinem Papa…“ (6 Fragen)
 *
 * Aufgaben mit der Lehrkraft abgestimmt (12.11.2026): Fotografieren ist meistens in Ordnung,
 * Verschicken/Veröffentlichen nur, wenn alle auf dem Foto Ja sagen.
 * TODO Lehrkraft prüfen: Intro-Text und Tipps (Entwurf, gemeinsam überarbeiten).
 *
 * Bild: vorläufig aus der Folie ausgeschnitten (Quelle: Magnific; Original in besserer Auflösung wäre besser).
 */
registerBlatt({
  id: "fotos-menschen-die-ich-kenne",
  nummer: "12-II",
  titel: "Fotos von anderen – Menschen, die ich kenne",
  beschreibung: "Fotos von Familie und Freunden: Was darf ich damit machen?",

  tipps: [
    "Fotos von Familie und Freunden darf ich meistens einfach so machen. Sagt jemand „Bitte nicht!“ oder „Lösch das bitte!“, dann mache ich das.",
    "Bevor ich ein Foto verschicke, frage ich alle, die drauf sind. Alle müssen Ja sagen.",
    "Ich schicke Fotos nur an Menschen, denen ich vertraue.",
    "Auch ein Foto, das ich bekommen habe, schicke ich nur mit Erlaubnis weiter."
  ],

  seiten: [

    // 1. Intro (Entwurf)
    {
      typ: "info",
      titel: "Fotos von Menschen, die du kennst",
      text: "Fotos von deiner Familie oder deinen Freunden machst du bestimmt oft. Das ist schön! Aber auch Menschen, die du gut kennst, bestimmen selbst, was mit einem Foto von ihnen passiert.",
      abschnitte: [
        { symbol: "📸", titel: "Fotografieren ist meistens okay", farbe: "gruen",
          text: "Fotos von Familie und Freunden machst du oft einfach so. Das ist okay. Aber sagt jemand „Bitte nicht!“ oder „Lösch das bitte!“, dann machst du das. Du möchtest ja auch nicht, dass ein peinliches Foto von dir bleibt." },
        { symbol: "💬", titel: "Vor dem Verschicken fragen", farbe: "gelb",
          text: "Bevor du das Foto jemandem schickst, fragst du alle, die drauf sind. Alle müssen Ja sagen." },
        { symbol: "🔁", titel: "Auch beim Weiterschicken", farbe: "blau",
          text: "Hast du ein Foto bekommen? Auch dann fragst du, bevor du es weiterschickst." }
      ]
    },

    // 2. Szene
    {
      typ: "info",
      titel: "Du machst ein Foto …",
      text: "Du machst ein Bild von deiner Schwester und deinem Papa. Was darfst du damit machen?",
      bild: "bilder/schwester-papa.jpg",
      bildQuelle: "Designed by Magnific"
    },

    // 3.–6. Aufgaben
    {
      typ: "ja-nein", thema: "Recht am eigenen Bild", stufe: 1,
      frage: "Foto von Schwester und Papa: Ist das in Ordnung?",
      bild: "bilder/schwester-papa.jpg",
      bildQuelle: "Designed by Magnific",
      aussagen: [
        { text: "Ich fotografiere die beiden, ohne zu fragen.", richtig: true,
          erklaerung: "Fotos von deiner Familie machst du oft einfach so. Das ist okay." },
        { text: "Ich fotografiere die beiden, obwohl meine Schwester Nein gesagt hat.", richtig: false,
          erklaerung: "Wenn jemand Nein sagt, hörst du auf. So geht man nett miteinander um. Du möchtest ja auch, dass andere auf dich hören." },
        { text: "Ich behalte das Foto nur für mich.", richtig: true,
          erklaerung: "Für dich behalten ist in Ordnung. Dann sieht es niemand sonst." },
        { text: "Ich schicke das Foto per Messenger (z. B. WhatsApp) an meine Freundin, ohne zu fragen.", richtig: false,
          erklaerung: "Bevor du ein Foto verschickst, fragst du alle, die drauf sind: Papa und deine Schwester." },
        { text: "Ich frage Papa und meine Schwester: „Darf ich das Foto an Oma schicken?“ Beide sagen Ja. Dann schicke ich es per Messenger an Oma.", richtig: true,
          erklaerung: "Beide haben genau dazu Ja gesagt: zum Schicken an Oma. Also darfst du das." },
        { text: "Ich frage: „Darf ich das Foto in den Familien-Gruppenchat stellen?“ Papa sagt Ja, meine Schwester sagt Nein. Ich stelle es trotzdem rein.", richtig: false,
          erklaerung: "Alle auf dem Foto müssen Ja sagen. Wenn eine Person Nein sagt, wird das Foto nicht verschickt." },
        { text: "Ich stelle das Foto öffentlich auf meinen Social-Media-Kanal (z. B. Instagram), ohne die beiden zu fragen.", richtig: false,
          erklaerung: "Papa und deine Schwester entscheiden, ob das Foto ins Internet kommt. Dort kann es jeder sehen, auch Fremde. Zurückholen kann man es kaum." }
      ],
      erklaerung: "Fotografieren ist meistens in Ordnung. Verschicken oder posten nur, wenn alle auf dem Foto Ja sagen."
    },

    {
      typ: "multiple-choice", thema: "Recht am eigenen Bild", stufe: 1,
      frage: "Du möchtest das Foto deiner Freundin schicken. Wen musst du vorher fragen?",
      optionen: [
        "Deinen Papa und deine Schwester",
        "Nur deinen Papa, weil er erwachsen ist",
        "Nur deine Schwester, weil sie ein Kind ist",
        "Niemanden, du hast das Foto ja gemacht"
      ],
      richtig: 0,
      erklaerung: "Jeder auf dem Foto darf mitbestimmen. Auf dem Foto sind dein Papa und deine Schwester. Also fragst du beide. Wenn einer Nein sagt, schickst du das Foto nicht."
    },

    {
      typ: "multiple-choice", thema: "Fotos teilen", stufe: 2,
      frage: "Papa und deine Schwester haben Ja gesagt. Du schickst das Foto nur an deine Freundin. Warum solltest du trotzdem vorsichtig sein?",
      optionen: [
        "Weil ich nicht weiß, wie meine Freundin damit umgeht. Vielleicht schickt sie es weiter.",
        "Weil das Foto dann automatisch im Internet für alle zu sehen ist."
      ],
      richtig: 0,
      erklaerung: "Im Messenger sieht das Foto erst mal nur deine Freundin. Aber sie könnte es weiterschicken oder einen Screenshot machen. Das darf sie nicht ohne Erlaubnis. Wenn sie es trotzdem tut, kannst du es nicht mehr aufhalten. Darum schickst du Fotos nur an Menschen, denen du vertraust."
    },

    // Perspektivwechsel: Wer ein Foto weiterschickt, ist selbst verantwortlich.
    {
      typ: "wahr-falsch", thema: "Fotos teilen", stufe: 2,
      aussage: "Meine Freundin hat mir ein Foto von ihrer Familie geschickt. Dann muss sie damit rechnen, dass ich es weiterschicke. Also darf ich das.",
      richtig: false,
      erklaerung: "Wer ein Foto weiterschickt, ist selbst dafür verantwortlich. Auch du musst vorher fragen, ob alle auf dem Foto einverstanden sind. Frag deine Freundin, ob ihre Familie einverstanden ist, dass du es weiterschickst."
    }
  ]
});
