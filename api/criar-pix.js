// api/criar-pix.js
// Vercel Serverless Function — cria transação PIX na BuckPay

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { nome, email, telefone, cpf } = req.body;

  if (!nome || !email) {
    return res.status(400).json({ error: 'Nome e e-mail são obrigatórios.' });
  }

  const externalId = `livros-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

  const baseUrl = process.env.BASE_URL || `https://${process.env.VERCEL_URL}`;

  const body = {
    external_id: externalId,
    payment_method: 'pix',
    amount: 1500,
    buyer: {
      name: nome,
      email: email,
      ...(telefone && { phone: telefone.replace(/\D/g, '') }),
      ...(cpf && { document: cpf.replace(/\D/g, '') }),
    },
    product: {
      id: 'pack-livros-religiosos',
      name: 'Pack Livros para Colorir Religiosos',
    },
    offer: {
      id: 'oferta-1',
      name: 'Pack Completo 5 Livros',
      quantity: 1,
    },
    postbackUrl: `${baseUrl}/api/webhook`,
  };

  try {
    const response = await fetch('https://api.realtechdev.com.br/v1/transactions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.BUCKPAY_TOKEN}`,
        'User-Agent': 'Buckpay API',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('BuckPay erro:', data);
      return res.status(response.status).json({ error: data.error?.message || 'Erro ao criar PIX.' });
    }

    return res.status(201).json({
      external_id: externalId,
      pix_code: data.data.pix.code,
      qrcode_base64: data.data.pix.qrcode_base64,
      status: data.data.status,
    });

  } catch (err) {
    console.error('Erro interno:', err);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};
