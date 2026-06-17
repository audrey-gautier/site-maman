// Compteur de visites (discret, côté admin uniquement).
// Incrémente au plus une fois par navigateur et par jour, via la fonction
// Supabase "increment_visites". Nécessite supabase-config.js chargé avant.
(function () {
  if (typeof SUPABASE_URL === "undefined") return;
  try {
    var aujourdhui = new Date().toISOString().slice(0, 10);
    if (localStorage.getItem("visite_jour") === aujourdhui) return;
    localStorage.setItem("visite_jour", aujourdhui);
  } catch (e) {}
  fetch(SUPABASE_URL + "/rest/v1/rpc/increment_visites", {
    method: "POST",
    headers: {
      "apikey": SUPABASE_ANON_KEY,
      "Authorization": "Bearer " + SUPABASE_ANON_KEY,
      "Content-Type": "application/json",
    },
    body: "{}",
  }).catch(function () {});
})();
