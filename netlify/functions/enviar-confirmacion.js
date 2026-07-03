

export default async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  const { pedido } = await req.json()

  if (!pedido?.clienteEmail || !pedido?.items?.length) {
    return new Response(JSON.stringify({ error: 'Pedido inválido' }), { status: 400 })
  }

  const filasItems = pedido.items
    .map(
      (item) =>
        `<tr><td style="padding:4px 0">${item.cantidad} × ${item.nombre}</td><td style="padding:4px 0;text-align:right">$${item.precio * item.cantidad}</td></tr>`
    )
    .join('')

  const html = `
    <div style="font-family:sans-serif;color:#1f2937;max-width:480px">
      <h2 style="color:#2d6a4f">¡Gracias por tu compra, ${pedido.clienteNombre}!</h2>
      <p>Tu pedido fue recibido y está <strong>${pedido.estado}</strong>. Pronto nos pondremos en contacto para coordinar la entrega.</p>
      <table style="width:100%;border-collapse:collapse;margin:16px 0">
        ${filasItems}
        <tr><td style="padding-top:8px;font-weight:bold;border-top:1px solid #e5e7eb">Total</td><td style="padding-top:8px;font-weight:bold;text-align:right;border-top:1px solid #e5e7eb">$${pedido.total}</td></tr>
      </table>
      <p style="color:#6b7280;font-size:13px">Vivero Takumi · ${pedido.fecha}</p>
    </div>
  `

  const filasItemsTexto = pedido.items
    .map((item) => `- ${item.cantidad} x ${item.nombre}: $${item.precio * item.cantidad}`)
    .join('\n')
  const texto = `Gracias por tu compra, ${pedido.clienteNombre}.\n\nTu pedido fue recibido y está ${pedido.estado}. Pronto nos pondremos en contacto para coordinar la entrega.\n\n${filasItemsTexto}\n\nTotal: $${pedido.total}\n\nVivero Takumi · ${pedido.fecha}`

  const respuesta = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: process.env.RESEND_FROM || 'Vivero Takumi <pedidos@viverotakumi.kensiweb.com>',
      to: pedido.clienteEmail,
      subject: 'Confirmación de tu pedido — Vivero Takumi',
      html,
      text: texto,
    }),
  })

  if (!respuesta.ok) {
    const error = await respuesta.text()
    return new Response(JSON.stringify({ error }), { status: 502 })
  }

  return new Response(JSON.stringify({ ok: true }), { status: 200 })
}
