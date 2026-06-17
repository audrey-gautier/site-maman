// Fonction Supabase : envoie un email à chaque nouveau message du formulaire.
// Appelée directement par le formulaire de contact (contact.html) après l'envoi.
// La clé Resend est stockée en secret (RESEND_API_KEY), jamais dans le code du site.

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: cors });
  }

  try {
    const payload = await req.json();
    const d = (payload && payload.record) || {};

    const cle = Deno.env.get("RESEND_API_KEY");
    if (!cle) {
      return new Response(JSON.stringify({ erreur: "RESEND_API_KEY manquante" }), {
        status: 500,
        headers: { ...cors, "Content-Type": "application/json" },
      });
    }

    const echappe = (t) => String(t || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

    const html =
      "<h2>Nouveau message sur le site</h2>" +
      "<p><strong>Nom :</strong> " + echappe(d.nom) + "</p>" +
      "<p><strong>Email :</strong> " + echappe(d.email) + "</p>" +
      "<p><strong>Téléphone :</strong> " + echappe(d.telephone) + "</p>" +
      "<p><strong>Dates souhaitées :</strong> " + echappe(d.dates) + "</p>" +
      "<p><strong>Message :</strong><br>" + echappe(d.message) + "</p>";

    const reponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + cle,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Lou Pitchou Prats <onboarding@resend.dev>",
        to: ["mesange40@hotmail.fr"],
        subject: "Nouveau message — site Lou Pitchou Prats",
        html: html,
      }),
    });

    const resultat = await reponse.json();
    return new Response(JSON.stringify({ ok: reponse.ok, resultat }), {
      headers: { ...cors, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ erreur: String(e) }), {
      status: 500,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  }
});
