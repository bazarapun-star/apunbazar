export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary text-primary-foreground py-16 px-4 text-center">
        <h1 className="font-serif text-4xl font-bold mb-4">Refund Policy</h1>
        <p className="text-primary-foreground/80">Last updated: May 2026</p>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">

        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
          <h2 className="font-semibold text-green-800 text-lg mb-2">✅ Hamara Promise</h2>
          <p className="text-green-700">
            Agar aap apni purchase se khush nahi hain, hum 7 din ke andar full refund denge — koi sawaal nahi!
          </p>
        </div>

        {[
          {
            title: "1. Return Eligibility",
            content: [
              "Product delivery ke 7 din ke andar return request karni hogi.",
              "Product unused, unwashed aur original packaging mein hona chahiye.",
              "Damaged ya defective product mile toh hum poora refund denge.",
              "Sale items aur customized products return nahi honge.",
            ]
          },
          {
            title: "2. Return Process",
            content: [
              "Step 1: support@apunbazar.in pe email karein ya WhatsApp karein.",
              "Step 2: Order ID aur product photo bhejein.",
              "Step 3: Hum pickup arrange karenge (free of cost).",
              "Step 4: Product receive hone ke baad 5-7 business days mein refund process hoga.",
            ]
          },
          {
            title: "3. Refund Methods",
            content: [
              "Online payment: Original payment method pe refund hoga.",
              "COD orders: Bank transfer ya UPI ke through refund hoga.",
              "Refund amount: Original price + shipping charges (agar product defective ho).",
            ]
          },
          {
            title: "4. Non-Refundable Items",
            content: [
              "Perishable items (fresh tea, organic food) jo khul chuke hon.",
              "Customized ya personalized products.",
              "Products jo 7 din baad return kiye gaye hon.",
              "Products jo use ho chuke hon ya damage ho chuke hon.",
            ]
          },
          {
            title: "5. Exchange Policy",
            content: [
              "Wrong size mila? Hum free exchange karenge.",
              "Exchange request 7 din ke andar karni hogi.",
              "Subject to availability of the required size/variant.",
            ]
          },
        ].map((section) => (
          <section key={section.title} className="bg-card border rounded-xl p-6">
            <h2 className="font-serif text-xl font-bold text-primary mb-4">{section.title}</h2>
            <ul className="space-y-2">
              {section.content.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-muted-foreground">
                  <span className="text-primary mt-1">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}

        <div className="bg-primary/5 rounded-xl p-6 text-center">
          <p className="text-muted-foreground">Koi aur sawaal? <a href="/contact" className="text-primary font-medium hover:underline">Hamse contact karein</a></p>
        </div>
      </div>
    </div>
  );
}