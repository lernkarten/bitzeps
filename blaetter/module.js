/*
 * Module – fassen die Übungen (Blätter) zu Themen zusammen.
 *
 * Ein Blatt landet automatisch im Modul, dessen Nummer vor dem Bindestrich steht:
 *   Blatt nummer: "12-IV"  →  Modul nummer: "12"
 * Neues Modul: einfach eine weitere registerModul(...)-Zeile ergänzen.
 * Blätter ohne passendes Modul erscheinen unter „Weitere Übungen“.
 */
registerModul({
  nummer: "12",
  titel: "Fotos von anderen",
  beschreibung: "Darf ich das Foto teilen? Das entscheidest du nicht allein."
});
