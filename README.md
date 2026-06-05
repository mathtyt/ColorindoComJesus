# 📦 Pack Livros para Colorir Religiosos — Deploy no Vercel

## Estrutura do projeto

```
projeto-livros/
├── api/
│   ├── criar-pix.js      ← cria transação na BuckPay
│   ├── status-pix.js     ← consulta status do pagamento
│   └── webhook.js        ← recebe confirmação automática da BuckPay
├── public/
│   ├── index.html        ← sua landing page
│   ├── pack.png
│   ├── 1.png … 5.png     ← capas dos módulos
│   ├── 10.png, 12.png, 17.png, 20.png  ← exemplos de atividades
│   └── img_1_js-removebg-preview.png   ← imagem do hero (coloque aqui)
├── .env.example
├── .gitignore
├── package.json
└── vercel.json
```

---

## Passo a passo para colocar no ar

### 1. Criar repositório no GitHub

1. Acesse https://github.com/new
2. Nome: `livros-religiosos` (ou qualquer nome)
3. Deixe **privado**
4. Clique em **Create repository**
5. Faça upload de todos os arquivos desta pasta

### 2. Fazer deploy no Vercel

1. Acesse https://vercel.com
2. Clique em **Add New → Project**
3. Conecte seu GitHub e selecione o repositório
4. Clique em **Deploy** (as configurações do vercel.json já cuidam de tudo)

### 3. Configurar variáveis de ambiente no Vercel

No painel do Vercel, vá em:
**Settings → Environment Variables** e adicione:

| Nome                  | Valor                                      |
|-----------------------|--------------------------------------------|
| `BUCKPAY_TOKEN`       | `sk_live_ff76ffb330a081d1d7a62d6a383a5bdc` |
| `BUCKPAY_USER_AGENT`  | (peça ao gerente de contas da BuckPay)     |

Depois clique em **Redeploy** para aplicar.

### 4. Configurar Webhook na BuckPay

Após o deploy, sua URL será algo como:
`https://livros-religiosos.vercel.app`

Configure o webhook no painel da BuckPay com:
```
https://livros-religiosos.vercel.app/api/webhook
```

---

## Fluxo de pagamento

```
Cliente clica "EU QUERO"
  → Preenche nome + e-mail
  → Frontend chama /api/criar-pix
  → BuckPay gera QR Code + código PIX real
  → Frontend exibe QR Code (vindo da BuckPay)
  → Cliente paga no banco
  → BuckPay envia webhook → /api/webhook (confirmação automática)
  → Frontend faz polling em /api/status-pix a cada 5s
  → Quando status = "paid": mostra tela de sucesso
  → Cliente clica "Receber no WhatsApp" → abre seu WhatsApp
```

---

## Próximo passo: automação de envio

No arquivo `api/webhook.js`, há um bloco comentado com as opções:
- **WhatsApp automático** via Z-API ou Evolution API
- **E-mail automático** via Resend

Quando quiser implementar, é só descomentar e configurar!
