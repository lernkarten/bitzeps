/*
 * Modul 12-I – Fotos von anderen: Fremde Menschen
 *
 * Quelle: Unterrichtsfolie „Du fotografierst eine Verkäuferin im Café…“ (6 Fragen)
 *
 * TODO Lehrkraft prüfen: Intro-Text und Tipps (Entwurf, gemeinsam überarbeiten);
 * Ampel-Zuordnung im Café.
 *
 * Bild: vorläufig aus der Folie ausgeschnitten (Quelle: Magnific; Original in besserer Auflösung wäre besser).
 */
registerBlatt({
  id: "fotos-fremde-menschen",
  nummer: "12-I",
  titel: "Fotos von anderen – Fremde Menschen",
  beschreibung: "Darf ich Menschen fotografieren, die ich nicht kenne?",

  tipps: [
    "Jeder Mensch bestimmt selbst, was mit Fotos von ihm passiert. Egal, ob ich ihn kenne oder nicht.",
    "Fotografieren ist erlaubt. Höflich ist es, die Person trotzdem zu fragen.",
    "Bevor ich ein Foto von einer Person teile, frage ich sie.",
    "Sagt sie Nein, gilt das. Dann schicke ich das Foto nicht an Freunde oder Bekannte und stelle es nicht ins Internet."
  ],

  seiten: [

    // 1. Intro (Entwurf)
    {
      typ: "info",
      titel: "Deine Privatsphäre",
      text: "Jeder darf selbst bestimmen, was mit Fotos, Videos oder Infos über sich passiert. Das gehört zur Privatsphäre. Privatsphäre heißt: Manches gehört nur dir. Zum Beispiel deine Fotos, deine Geheimnisse oder dein Tagebuch. Du entscheidest, wer davon etwas sehen oder wissen darf.",
      merksatz: {
        symbol: "🔒",
        begriff: "Privatsphäre",
        text: "Was von dir gezeigt wird, entscheidest du."
      },
      textDanach: "Das gilt für alle Menschen. Auch für Menschen, die du gar nicht kennst.\nWas heißt das für dich, wenn du jemanden fotografierst oder ein Video machst? Dann bestimmt die andere Person mit, was mit dem Foto oder Video passiert.\nDas schauen wir uns jetzt an zwei Beispielen an."
    },

    // 2. Szene
    {
      typ: "info",
      titel: "Im Café",
      text: "Du bist mit deiner Familie im Café. Die Verkäuferin macht gerade einen Kaffee mit Milchschaum. Das sieht toll aus! Du möchtest ein Foto machen.\nDie Verkäuferin kennst du nicht. Sie ist eine fremde Person.",
      bild: "bilder/cafe-verkaeuferin.jpg",
      bildQuelle: "Designed by Magnific"
    },

    // 3. Zuordnung. „Fotografieren ohne fragen“ = grün (Absprache Lehrkraft 13.11.2026),
    // mit Hinweis bei falscher Zuordnung: unhöflich, also trotzdem fragen.
    {
      typ: "zuordnen", thema: "Fotos von Fremden", stufe: 1, stil: "ampel",
      anweisung: "Foto von der Verkäuferin: Was ist in Ordnung? Zieh jede Karte in das passende Feld.",
      bild: "bilder/cafe-verkaeuferin.jpg",
      bildQuelle: "Designed by Magnific",
      gruppen: ["Grün: In Ordnung", "Gelb: Nur, wenn die Verkäuferin dazu Ja sagt", "Rot: Nicht in Ordnung"],
      karten: [
        { text: "Ich fotografiere nur den Kaffee. Die Verkäuferin ist nicht auf dem Foto.", gruppe: 0 },
        { text: "Ich behalte das Foto von der Verkäuferin nur für mich.", gruppe: 0 },
        { text: "Ich schicke das Foto per Messenger (z. B. WhatsApp) an meine Freundin.", gruppe: 1 },
        { text: "Ich schicke das Foto per Messenger (z. B. WhatsApp) an meine Oma.", gruppe: 1 },
        { text: "Ich stelle das Foto per Messenger (z. B. WhatsApp) in den Gruppenchat meiner Familie.", gruppe: 1 },
        { text: "Ich stelle das Foto öffentlich auf meinen Social-Media-Kanal (z. B. Instagram), ohne sie zu fragen.", gruppe: 2 },
        { text: "Ich fotografiere die Verkäuferin, ohne zu fragen.", gruppe: 0,
          hinweis: "Fotografieren ist erlaubt. Aber es ist sehr unhöflich, nicht zu fragen. Darum fragst du sie trotzdem vorher." }
      ],
      erklaerung: "Auch eine fremde Person bestimmt selbst, was mit Fotos von ihr passiert. Fotografieren ist erlaubt, aber frag sie lieber vorher. Das ist höflich. Bevor du ein Foto von ihr verschickst, musst du sie fragen. Und wenn sie Nein sagt, gilt das."
    },

    // 4. Zweiter Fall: Surferin am Meer (Absprache Lehrkraft 13.11.2026)
    {
      typ: "info",
      titel: "Am Meer",
      text: "Du bist im Urlaub am Meer. Eine Surferin reitet gerade auf einer großen Welle. Das sieht toll aus! Du machst ein Foto.\nDie Surferin kennst du nicht.",
      bild: "bilder/surferin.jpg",
      bildQuelle: "Designed by Magnific"
    },

    {
      typ: "ja-nein", thema: "Fotos von Fremden", stufe: 1,
      frage: "Foto von der Surferin: Ist das in Ordnung?",
      antworten: ["In Ordnung", "Nicht in Ordnung"],
      bild: "bilder/surferin.jpg",
      bildQuelle: "Designed by Magnific",
      aussagen: [
        { text: "Ich fotografiere die Surferin, während sie surft.", richtig: true,
          erklaerung: "Fotografieren ist erlaubt. Aus Höflichkeit könntest du sie nach dem Surfen fragen, ob das okay war und ob du das Foto behalten darfst." },
        { text: "Ich behalte das Foto nur für mich.", richtig: true,
          erklaerung: "Für dich behalten ist in Ordnung. Dann sieht es niemand sonst." },
        { text: "Ich schicke das Foto per Messenger (z. B. WhatsApp) an meine Freundinnen und Freunde, ohne sie zu fragen.", richtig: false,
          erklaerung: "Die Surferin entscheidet, was mit ihrem Bild passiert. Bevor du es verschickst, fragst du sie." },
        { text: "Die Surferin kommt aus dem Wasser. Ich zeige ihr das Foto und frage: „Darf ich es meiner Oma schicken?“ Sie sagt Ja. Dann schicke ich es meiner Oma.", richtig: true,
          erklaerung: "Sie hat genau dazu Ja gesagt: zum Schicken an deine Oma. Also ist das in Ordnung." },
        { text: "Ich stelle das Foto öffentlich auf meinen Social-Media-Kanal (z. B. Instagram), weil sie darauf so cool aussieht.", richtig: false,
          erklaerung: "Auch wenn das Foto toll ist: Ob es ins Internet kommt, entscheidet die Surferin. Ohne ihr Ja stellst du es nicht online." },
        { text: "Ich filme die Surferin auf der Welle und stelle das Video online, ohne sie zu fragen.", richtig: false,
          erklaerung: "Für Videos gelten dieselben Regeln wie für Fotos. Ob das Video online kommt, entscheidet die Surferin." }
      ],
      erklaerung: "Fotografieren ist erlaubt. Bevor du ein Foto von einer fremden Person verschickst, fragst du sie. Und wenn sie Nein sagt, gilt das."
    },

    // 6.–7. Quiz zu den Tipps (Reihenfolge wie in „tipps“)

    // zu Tipp 1–3: drei Aufgaben untereinander auf einer Seite
    {
      typ: "quiz", thema: "Fotos von Fremden", stufe: 1,
      titel: "Kurzes Quiz",
      aufgaben: [
        // zu Tipp 1
        { typ: "wahr-falsch",
          aussage: "Ich kenne die Person auf dem Foto nicht. Dann darf ich selbst entscheiden, was mit dem Foto passiert.",
          richtig: false,
          erklaerung: "Jeder Mensch bestimmt selbst, was mit Fotos von ihm passiert. Das gilt auch für Menschen, die du nicht kennst." },

        // zu Tipp 2
        { typ: "multiple-choice",
          frage: "Du möchtest eine fremde Person fotografieren. Was stimmt?",
          optionen: [
            "Fotografieren ist erlaubt. Höflich ist es, sie vorher zu fragen.",
            "Fotografieren ist verboten.",
            "Ich darf sie nur fotografieren, wenn ein Erwachsener dabei ist."
          ],
          richtig: 0,
          erklaerung: "Fotografieren ist erlaubt. Aber fragen ist höflich. So geht man nett miteinander um." },

        // zu Tipp 3
        { typ: "multiple-choice",
          frage: "Du möchtest ein Foto von einer Person an deine Freundin schicken. Was machst du zuerst?",
          optionen: [
            "Ich frage die Person auf dem Foto.",
            "Ich frage meine Freundin, ob sie das Foto haben möchte.",
            "Ich schicke es einfach. Die Person merkt es ja nicht."
          ],
          richtig: 0,
          erklaerung: "Die Person auf dem Foto entscheidet. Darum fragst du sie, bevor du das Foto teilst." }
      ]
    },

    // zu Tipp 4
    {
      typ: "ja-nein", thema: "Fotos von Fremden", stufe: 1,
      frage: "Die Person auf dem Foto sagt dir: „Bitte gib das Foto nicht weiter.“ Was darfst du jetzt noch mit dem Foto machen?",
      antworten: ["In Ordnung", "Nicht in Ordnung"],
      aussagen: [
        { text: "Ich behalte das Foto nur für mich.", richtig: true,
          erklaerung: "Genau richtig. Für dich behalten ist in Ordnung. Weitergeben tust du es nicht." },
        { text: "Ich schicke es nur an meine beste Freundin.", richtig: false,
          erklaerung: "Sie möchte nicht, dass das Foto weitergegeben wird. Das gilt auch für Freunde und Bekannte." },
        { text: "Ich stelle es ins Internet, aber ohne ihren Namen.", richtig: false,
          erklaerung: "Man erkennt sie trotzdem. Sie möchte nicht, dass das Foto weitergegeben wird. Das gilt auch fürs Internet." }
      ],
      erklaerung: "Möchte die Person nicht, dass ihr Foto weitergegeben wird, gilt das. Dann schickst du das Foto an niemanden und stellst es nicht ins Internet."
    }
  ]
});
