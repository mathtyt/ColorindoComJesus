// api/webhook.js
// Vercel Serverless Function — recebe webhook da BuckPay (pagamento confirmado)

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const payload = req.body;

  if (payload.event !== 'transaction.processed') {
    return res.status(200).json({ received: true });
  }

  const { status, buyer } = payload.data;

  if (status !== 'paid') {
    return res.status(200).json({ received: true });
  }

  console.log(`✅ Pagamento confirmado — ${buyer?.name} (${buyer?.email})`);

  // ================================================================
  // AUTOMAÇÃO FUTURA: envio automático via WhatsApp ou e-mail
  // Descomente quando quiser implementar:
  //
  // await fetch('https://api.z-api.io/instances/ID/token/TOKEN/send-text', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({
  //     phone: buyer.phone,
  //     message: 'Olá! Aqui está seu Pack de Livros Religiosos 🙏\nLink: https://...'
  //   })
  // });
  // ================================================================

  return res.status(200).json({ received: true });
};
