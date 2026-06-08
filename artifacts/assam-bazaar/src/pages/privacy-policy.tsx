export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary text-primary-foreground py-16 px-4 text-center">
        <h1 className="font-serif text-4xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-primary-foreground/80">Last updated: May 2026</p>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">

        <div className="bg-card border rounded-xl p-6">
          <p className="text-muted-foreground leading-relaxed">
            ApunBazar ("hum", "hamara") aapki privacy ki parwah karta hai. Yeh Privacy Policy batati hai
            ki hum aapka data kaise collect, use aur protect karte hain jab aap apunbazar.in use karte hain.
          </p>
        </div>

        {[
          {
            title: "1. Data Jo Hum Collect Karte Hain",
            items: [
              "Personal info: Naam, email, phone number, delivery address.",
              "Order info: Aapke orders, payment method (encrypted), order history.",
              "Device info: IP address, browser type, pages visited (analytics ke liye).",
              "Cookies: Shopping cart, preferences aur session data ke liye.",
            ]
          },
          {
            title: "2. Data Ka Use",
            items: [
              "Orders process karna aur delivery confirm karna.",
              "Customer support dena.",
              "Order updates aur shipping notifications bhejana.",
              "Website improve karna aur technical issues fix karna.",
              "Promotions aur offers ke baare mein inform karna (sirf aapki permission se).",
            ]
          },
          {
            title: "3. Data Sharing",
            items: [
              "Hum aapka personal data kabhi bhi third parties ko bechte nahi hain.",
              "Delivery partners (shipping companies) ko sirf delivery ke liye address share hota hai.",
              "Payment gateway (Razorpay) ke saath secure transaction ke liye data share hota hai.",
              "Legal requirement hone par government authorities ke saath share kiya ja sakta hai.",
            ]
          },
          {
            title: "4. Data Security",
            items: [
              "SSL encryption se aapka data secure hai.",
              "Payment info kabhi bhi hamare servers pe store nahi hota.",
              "Regular security audits kiye jate hain.",
              "Data breach hone par aapko turant inform kiya jayega.",
            ]
          },
          {
            title: "5. Aapke Rights",
            items: [
              "Aap apna data access kar sakte hain — bas email karein.",
              "Aap apna account aur data delete karwa sakte hain.",
              "Aap marketing emails se unsubscribe kar sakte hain.",
              "Aap apni information update kar sakte hain.",
            ]
          },
          {
            title: "6. Cookies Policy",
            items: [
              "Essential cookies: Website ke kaam karne ke liye zaroori.",
              "Analytics cookies: Hum Google Analytics use karte hain website improve karne ke liye.",
              "Aap browser settings se cookies disable kar sakte hain.",
            ]
          },
        ].map((section) => (
          <section key={section.title} className="bg-card border rounded-xl p-6">
            <h2 className="font-serif text-xl font-bold text-primary mb-4">{section.title}</h2>
            <ul className="space-y-2">
              {section.items.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-muted-foreground">
                  <span className="text-primary mt-1">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}

        <div className="bg-primary/5 rounded-xl p-6">
          <h3 className="font-semibold mb-2">Contact — Privacy Related</h3>
          <p className="text-muted-foreground text-sm">
            Privacy concerns ke liye: <a href="mailto:privacy@apunbazar.in" className="text-primary hover:underline">privacy@apunbazar.in</a>
          </p>
        </div>
      </div>
    </div>
  );
}