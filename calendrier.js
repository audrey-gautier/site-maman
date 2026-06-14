// Logique partagée des calendriers (page publique + page admin).

var CAL_MOIS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet",
                "août", "septembre", "octobre", "novembre", "décembre"];
var CAL_JOURS = ["L", "M", "M", "J", "V", "S", "D"];

function calAaaammjj(d) {
  var m = ("0" + (d.getMonth() + 1)).slice(-2);
  var j = ("0" + d.getDate()).slice(-2);
  return d.getFullYear() + "-" + m + "-" + j;
}

// Construit un mois. estReserve(dateStr) -> booléen.
// onClick(dateStr) optionnel : rend les jours (non passés) cliquables.
function calConstruitMois(annee, mois, aujourdhui, estReserve, onClick) {
  var div = document.createElement("div");
  div.className = "mois";

  var titre = document.createElement("h3");
  titre.textContent = CAL_MOIS[mois] + " " + annee;
  div.appendChild(titre);

  var table = document.createElement("table");
  table.className = "cal";

  var thead = document.createElement("tr");
  for (var k = 0; k < 7; k++) {
    var th = document.createElement("th");
    th.textContent = CAL_JOURS[k];
    thead.appendChild(th);
  }
  table.appendChild(thead);

  var decalage = (new Date(annee, mois, 1).getDay() + 6) % 7;
  var nbJours = new Date(annee, mois + 1, 0).getDate();

  var jour = 1;
  for (var ligne = 0; ligne < 6 && jour <= nbJours; ligne++) {
    var tr = document.createElement("tr");
    for (var col = 0; col < 7; col++) {
      var td = document.createElement("td");
      if ((ligne === 0 && col < decalage) || jour > nbJours) {
        td.className = "vide";
      } else {
        var d = new Date(annee, mois, jour);
        var ds = calAaaammjj(d);
        td.textContent = jour;
        if (d < aujourdhui) {
          td.className = "passe";
        } else if (estReserve(ds)) {
          td.className = "reserve";
        } else {
          td.className = "libre";
        }
        if (onClick && d >= aujourdhui) {
          (function (dateStr, cellule) {
            cellule.style.cursor = "pointer";
            cellule.addEventListener("click", function () {
              onClick(dateStr);
            });
          })(ds, td);
        }
        jour++;
      }
      tr.appendChild(td);
    }
    table.appendChild(tr);
  }
  div.appendChild(table);
  return div;
}

// Remplit "conteneur" avec nbMois mois à partir du mois courant.
function calGenere(conteneur, nbMois, estReserve, onClick) {
  conteneur.innerHTML = "";
  var maintenant = new Date();
  var aujourdhui = new Date(maintenant.getFullYear(), maintenant.getMonth(), maintenant.getDate());
  var annee = maintenant.getFullYear();
  var mois = maintenant.getMonth();
  for (var n = 0; n < nbMois; n++) {
    conteneur.appendChild(calConstruitMois(annee, mois, aujourdhui, estReserve, onClick));
    mois++;
    if (mois > 11) { mois = 0; annee++; }
  }
}

// Réservations affichées : priorité aux modifications locales (navigateur du
// propriétaire), sinon les réservations publiées (RESERVATIONS).
function calChargeReservations() {
  try {
    var local = localStorage.getItem("reservations");
    if (local) return JSON.parse(local);
  } catch (e) {}
  var copie = { gite: [], chambre1: [], chambre2: [] };
  if (typeof RESERVATIONS !== "undefined") {
    copie.gite = (RESERVATIONS.gite || []).slice();
    copie.chambre1 = (RESERVATIONS.chambre1 || []).slice();
    copie.chambre2 = (RESERVATIONS.chambre2 || []).slice();
  }
  return copie;
}
