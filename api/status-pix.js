// api/status-pix.js
// Vercel Serverless Function — consulta status da transação

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { external_id } = req.query;

  if (!external_id) {
    return res.status(400).json({ error: 'external_id é obrigatório.' });
  }

  try {
    const response = await fetch(
      `https://api.realtechdev.com.br/v1/transactions/external_id/${external_id}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${process.env.BUCKPAY_TOKEN}`,
          'User-Agent': 'Buckpay API',
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.error?.message || 'Não encontrada.' });
    }

    return res.status(200).json({ status: data.data.status });

  } catch (err) {
    console.error('Erro ao consultar status:', err);
    return res.status(500).json({ error: 'Erro interno.' });
  }
};
