/*
 * Renderer "zuordnen" – Karten in Gruppen (Zielfelder) sortieren.
 *
 * Bedienung:
 *  - Standard (Tablet): Karte antippen, dann Zielfeld antippen.
 *  - Zusatz: Karte mit dem Finger/der Maus in ein Feld ziehen (Pointer Events, klappt auch auf iPad).
 *  - Eine Karte im Feld antippen und dann den Ablagebereich antippen = zurücklegen.
 * Wertung: siehe EE.KONFIG.zuordnenWertung in core.js.
 */
(function () {
  "use strict";
  var EE = window.EE, el = EE.el;

  var ZIEH_SCHWELLE = 10; // Pixel Bewegung, ab der aus Tippen ein Ziehen wird

  function punkteProKarte(seite) { return seite.punkte || 1; }

  EE.renderers["zuordnen"] = {
    bewertet: function () { return true; },
    maxPunkte: function (seite) {
      return EE.KONFIG.zuordnenWertung === "alles" ? (seite.punkte || 1) : seite.karten.length * punkteProKarte(seite);
    },

    render: function (c, seite, api) {
      var ort = seite.karten.map(function () { return null; }); // Kartenindex → Gruppenindex | null (= Ablage)
      var ausgewaehlt = null; // Kartenindex
      var gesperrt = false;
      var klickUnterdruecken = false;

      c.appendChild(api.ueberschrift(seite.anweisung));
      api.bild(c, seite);
      c.appendChild(el("p", { class: "hinweis", text: "Tippe eine Karte an und dann das passende Feld. Du kannst die Karten auch hinziehen." }));

      // --- Ablage (Startbereich der Karten) ---
      var ablageInhalt = el("div", { class: "zone-karten" });
      var ablageLeer = el("p", { class: "ablage-leer", text: "Alle Karten sind verteilt. Du kannst sie noch umsortieren." });
      var ablage = el("div", { class: "ablage" }, [ablageInhalt, ablageLeer]);
      ablage.dataset.ziel = "ablage";
      ablage.addEventListener("click", function (e) {
        if (klickUnterdruecken || gesperrt || ausgewaehlt === null || e.target.closest(".spielkarte")) return;
        if (ort[ausgewaehlt] !== null) platziere(ausgewaehlt, null);
      });
      c.appendChild(ablage);

      // --- Zielfelder ---
      var felderBox = el("div", { class: "zonen" + (seite.stil ? " " + seite.stil : "") });
      var zonen = seite.gruppen.map(function (name, gi) {
        var inhalt = el("div", { class: "zone-karten" });
        var kopf = el("button", { type: "button", class: "zone-kopf" }, [
          el("span", { class: "zone-punkt", "aria-hidden": "true" }),
          el("span", { text: name })
        ]);
        kopf.addEventListener("click", function () { tippeZone(gi); });
        var zone = el("div", { class: "zone zone-" + gi }, [kopf, inhalt]);
        zone.dataset.ziel = String(gi);
        zone.addEventListener("click", function (e) {
          if (e.target.closest(".spielkarte") || e.target.closest(".zone-kopf")) return;
          tippeZone(gi);
        });
        felderBox.appendChild(zone);
        return { zone: zone, inhalt: inhalt, kopf: kopf };
      });
      c.appendChild(felderBox);

      // --- Karten (gemischt) ---
      var karten = [];
      EE.mischen(seite.karten.map(function (_, i) { return i; })).forEach(function (ki) {
        var knopf = el("button", { type: "button", class: "spielkarte", "aria-pressed": "false" },
          [el("span", { class: "spielkarte-text", text: seite.karten[ki].text })]);
        knopf.addEventListener("click", function () {
          if (klickUnterdruecken || gesperrt) return;
          ausgewaehlt = ausgewaehlt === ki ? null : ki;
          aktualisiere();
        });
        ziehbar(knopf, ki);
        ablageInhalt.appendChild(knopf);
        karten[ki] = knopf;
      });

      function tippeZone(gi) {
        if (klickUnterdruecken || gesperrt || ausgewaehlt === null) return;
        platziere(ausgewaehlt, gi);
      }

      function platziere(ki, gi) {
        ort[ki] = gi;
        (gi === null ? ablageInhalt : zonen[gi].inhalt).appendChild(karten[ki]);
        ausgewaehlt = null;
        aktualisiere();
        karten[ki].focus({ preventScroll: true });
      }

      function aktualisiere() {
        karten.forEach(function (k, ki) {
          k.setAttribute("aria-pressed", ki === ausgewaehlt ? "true" : "false");
        });
        var waehlt = ausgewaehlt !== null;
        felderBox.classList.toggle("bereit", waehlt);
        ablage.classList.toggle("bereit", waehlt && ort[ausgewaehlt] !== null);
        zonen.forEach(function (z) {
          z.kopf.setAttribute("aria-label", z.kopf.textContent + (waehlt ? ", hier ablegen" : ""));
        });
        ablage.classList.toggle("ist-leer", ablageInhalt.children.length === 0);
      }

      // --- Ziehen per Pointer Events ---
      function ziehbar(knopf, ki) {
        var start = null, geist = null, ziel = null;

        // Während des Ziehens wird auf document gelauscht (nicht auf der Karte),
        // damit Bewegungen auch ankommen, wenn Finger/Maus die Karte verlassen.
        knopf.addEventListener("pointerdown", function (e) {
          if (gesperrt || start || (e.pointerType === "mouse" && e.button !== 0)) return;
          start = { x: e.clientX, y: e.clientY, id: e.pointerId };
          document.addEventListener("pointermove", bewege);
          document.addEventListener("pointerup", loslassen);
          document.addEventListener("pointercancel", abbrechen);
        });

        function bewege(e) {
          if (!start || e.pointerId !== start.id) return;
          if (!geist) {
            if (Math.abs(e.clientX - start.x) + Math.abs(e.clientY - start.y) < ZIEH_SCHWELLE) return;
            var r = knopf.getBoundingClientRect();
            geist = knopf.cloneNode(true);
            geist.classList.add("spielkarte-geist");
            geist.style.width = r.width + "px";
            geist.dataset.dx = String(start.x - r.left);
            geist.dataset.dy = String(start.y - r.top);
            document.body.appendChild(geist);
            knopf.classList.add("wird-gezogen");
            ausgewaehlt = ki;
            aktualisiere();
          }
          e.preventDefault();
          geist.style.left = (e.clientX - Number(geist.dataset.dx)) + "px";
          geist.style.top = (e.clientY - Number(geist.dataset.dy)) + "px";
          var neuesZiel = zielUnter(e.clientX, e.clientY);
          if (neuesZiel !== ziel) {
            if (ziel) ziel.classList.remove("drueber");
            ziel = neuesZiel;
            if (ziel) ziel.classList.add("drueber");
          }
        }

        function loslassen(e) { ende(e, false); }
        function abbrechen(e) { ende(e, true); }

        function ende(e, abgebrochen) {
          if (!start || e.pointerId !== start.id) return;
          start = null;
          document.removeEventListener("pointermove", bewege);
          document.removeEventListener("pointerup", loslassen);
          document.removeEventListener("pointercancel", abbrechen);
          if (!geist) return; // war ein Tippen → click-Ereignis übernimmt
          geist.remove();
          geist = null;
          knopf.classList.remove("wird-gezogen");
          if (ziel) ziel.classList.remove("drueber");
          if (!abgebrochen && ziel) {
            platziere(ki, ziel.dataset.ziel === "ablage" ? null : Number(ziel.dataset.ziel));
          } else {
            ausgewaehlt = null;
            aktualisiere();
          }
          ziel = null;
          // Das folgende click-Ereignis gehört noch zum Ziehen und soll nichts auswählen
          klickUnterdruecken = true;
          setTimeout(function () { klickUnterdruecken = false; }, 0);
        }
      }

      function zielUnter(x, y) {
        var unter = document.elementFromPoint(x, y);
        return unter ? unter.closest("[data-ziel]") : null;
      }

      aktualisiere();

      return {
        fehlt: function () {
          return ort.some(function (g) { return g === null; }) ? "Lege zuerst alle Karten in ein Feld." : null;
        },
        pruefen: function () {
          gesperrt = true;
          ausgewaehlt = null;
          aktualisiere();
          felderBox.classList.add("gesperrt");
          var anzahlRichtig = 0;
          seite.karten.forEach(function (karte, ki) {
            var knopf = karten[ki];
            knopf.disabled = true;
            if (ort[ki] === karte.gruppe) {
              anzahlRichtig++;
              knopf.classList.add("ist-richtig");
              knopf.appendChild(el("span", { class: "marke", text: "✓ richtig" }));
            } else {
              knopf.classList.add("ist-falsch");
              knopf.appendChild(el("span", { class: "marke", text: "✗ gehört zu: " + seite.gruppen[karte.gruppe] }));
              // Optionaler Hinweis, der nur bei falsch gelegter Karte erscheint
              if (karte.hinweis) knopf.appendChild(el("span", { class: "karten-hinweis", text: karte.hinweis }));
            }
          });
          var max = EE.renderers["zuordnen"].maxPunkte(seite);
          var erreicht = EE.KONFIG.zuordnenWertung === "alles"
            ? (anzahlRichtig === seite.karten.length ? max : 0)
            : anzahlRichtig * punkteProKarte(seite);
          return { erreicht: erreicht, max: max };
        }
      };
    }
  };
})();
