export default function AboutUs() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="bg-primary text-primary-foreground py-16 px-4 text-center">
        <h1 className="font-serif text-4xl font-bold mb-4">ApunBazar ke Baare Mein</h1>
        <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
          Assam ki dharti se, aapke ghar tak — handcrafted products jo humare artisans ki mehnat ka pramann hain.
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">

        {/* Our Story */}
        <section>
          <h2 className="font-serif text-2xl font-bold text-primary mb-4">Hamari Kahani</h2>
          <p className="text-muted-foreground leading-relaxed">
            ApunBazar ki shuruaat ek chhoti si sapne se hui — Assam ke local artisans aur farmers ki
            mehnat ko ek global manch dena. Hamare founders ne dekha ki Assam ki behad khoobsurat
            handloom, chai, aur handicrafts sirf local bazaaron tak seemit hain. Isliye humne ApunBazar
            banaya — ek aisa platform jahan Assam ki sanskriti aur shilpakala duniya ke kone-kone tak
            pahunch sake.
          </p>
        </section>

        {/* Mission */}
        <section className="bg-primary/5 rounded-2xl p-8">
          <h2 className="font-serif text-2xl font-bold text-primary mb-4">Hamara Mission</h2>
          <p className="text-muted-foreground leading-relaxed">
            Hum believe karte hain ki har haath se bani cheez mein ek kahani hai. Hamare artisans
            generationon se yeh kala apne haathon mein samete hue hain. Hamara mission hai unhe
            sahi daam aur sahi manch dena, taaki yeh kala zinda rahe aur aage badhe.
          </p>
        </section>

        {/* Values */}
        <section>
          <h2 className="font-serif text-2xl font-bold text-primary mb-6">Hamare Mool Mulya</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "Authenticity", desc: "Har product 100% asli aur handmade hai — koi compromise nahi.", emoji: "🤝" },
              { title: "Sustainability", desc: "Hum eco-friendly practices ko support karte hain aur local farmers ko seedha fayda pahunchate hain.", emoji: "🌿" },
              { title: "Community", desc: "Assam ke artisans aur weavers ki community ko strong banana hamara pehla lakshya hai.", emoji: "🏡" },
            ].map((v) => (
              <div key={v.title} className="bg-card border rounded-xl p-6 text-center">
                <div className="text-4xl mb-3">{v.emoji}</div>
                <h3 className="font-semibold text-lg mb-2">{v.title}</h3>
                <p className="text-muted-foreground text-sm">{v.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Stats */}
        <section className="bg-primary text-primary-foreground rounded-2xl p-8">
          <h2 className="font-serif text-2xl font-bold mb-6 text-center">Hamare Saath</h2>
          <div className="grid grid-cols-3 gap-6 text-center">
            {[
              { num: "500+", label: "Artisans" },
              { num: "2000+", label: "Products" },
              { num: "10,000+", label: "Khush Customers" },
            ].map((s) => (
              <div key={s.label}>
                <div className="font-serif text-3xl font-bold">{s.num}</div>
                <div className="text-primary-foreground/70 text-sm mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Team */}
        <section>
          <h2 className="font-serif text-2xl font-bold text-primary mb-4">Assam se, Pyaar se</h2>
          <p className="text-muted-foreground leading-relaxed">
            Hamare founders Assam ke hi hain. Wo chahte hain ki Muga silk ki chamak, Assam Orthodox
            chai ki khushboo, aur Bamboo craft ki sundarata poori duniya tak pahunche. Har order ke
            saath aap ek Assamese artisan ki zindagi ko behtar bana rahe hain.
          </p>
        </section>

      </div>
    </div>
  );
}