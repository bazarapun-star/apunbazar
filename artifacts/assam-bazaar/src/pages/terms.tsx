export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary text-primary-foreground py-16 px-4 text-center">
        <h1 className="font-serif text-4xl font-bold mb-4">Terms & Conditions</h1>
        <p className="text-primary-foreground/80">Last updated: May 2026</p>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">

        <div className="bg-card border rounded-xl p-6">
          <p className="text-muted-foreground leading-relaxed">
            ApunBazar.in use karke aap in Terms & Conditions se agree karte hain. Kripya inhe dhyan se padhein.
            Agar aap agree nahi karte toh website use na karein.
          </p>
        </div>

        {[
          {
            title: "1. Hamari Services",
            items: [
              "ApunBazar ek e-commerce platform hai jo Assamese handloom, tea, handicrafts aur organic products bechta hai.",
              "Hum Assam ke local artisans aur farmers ko direct buyers se connect karte hain.",
              "Products ki quality ensure karna hamari zimmedari hai.",
              "Hum service kisi bhi waqt modify kar sakte hain — aapko inform kiya jayega.",
            ]
          },
          {
            title: "2. Account aur Orders",
            items: [
              "Account banana aur shopping ke liye aapki age 18+ honi chahiye.",
              "Aap apni account info ke liye responsible hain.",
              "Order place karne ke baad ek confirmation email milega.",
              "Stock unavailability hone par hum order cancel kar sakte hain — full refund milega.",
            ]
          },
          {
            title: "3. Pricing aur Payment",
            items: [
              "Sabhi prices INR mein hain aur GST inclusive hain.",
              "Hum prices bina notice ke change kar sakte hain.",
              "Payment Razorpay ke through secure tarike se process hoti hai.",
              "COD (Cash on Delivery) select cities mein available hai.",
              "Fraudulent transactions ke liye hum legal action le sakte hain.",
            ]
          },
          {
            title: "4. Shipping",
            items: [
              "Delivery 5-10 business days mein hoti hai (location ke hisaab se).",
              "Free shipping ₹999 se upar ke orders pe milti hai.",
              "Remote areas mein delivery time zyada ho sakta hai.",
              "Shipping address galat hone par hum responsible nahi honge.",
            ]
          },
          {
            title: "5. Intellectual Property",
            items: [
              "ApunBazar ka naam, logo, aur content hamare hain.",
              "Bina permission ke copy ya use karna prohibited hai.",
              "Artisans ke products ka copyright unke paas hai.",
            ]
          },
          {
            title: "6. Limitation of Liability",
            items: [
              "Hum natural disasters ya courier delays ke liye responsible nahi hain.",
              "Maximum liability aapke order value se zyada nahi hogi.",
              "Third-party websites ke content ke liye hum responsible nahi hain.",
            ]
          },
          {
            title: "7. Governing Law",
            items: [
              "Yeh terms Assam, India ke laws ke under hain.",
              "Koi bhi dispute Guwahati courts mein resolve hoga.",
              "Consumer disputes ke liye aap Consumer Forum bhi ja sakte hain.",
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
          <h3 className="font-semibold mb-2">Sawaal hain?</h3>
          <p className="text-muted-foreground text-sm">
            <a href="mailto:legal@apunbazar.in" className="text-primary hover:underline">legal@apunbazar.in</a> pe email karein ya{" "}
            <a href="/contact" className="text-primary hover:underline">Contact Us</a> page visit karein.
          </p>
        </div>
      </div>
    </div>
  );
}