import { createRequire } from "module";
const require = createRequire(import.meta.url);
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// .env se DATABASE_URL padho
let DB_URL = process.env.DATABASE_URL;
if (!DB_URL) {
  try {
    const env = readFileSync(resolve(__dirname, "artifacts/api-server/.env"), "utf8");
    const m = env.match(/DATABASE_URL=(.+)/);
    if (m) DB_URL = m[1].trim();
  } catch (e) {
    console.error("artifacts/api-server/.env file nahi mili:", e.message);
    process.exit(1);
  }
}

if (!DB_URL) {
  console.error("DATABASE_URL nahi mila! artifacts/api-server/.env check karo.");
  process.exit(1);
}

console.log("Neon se connect ho raha hoon...");

const pg = require(".pnpm/pg@8.21.0/node_modules/pg");
const client = new pg.Client({ connectionString: DB_URL });

await client.connect();
console.log("Connected!");

await client.query(`
  CREATE TABLE IF NOT EXISTS main_categories (
    id            SERIAL PRIMARY KEY,
    name          TEXT NOT NULL,
    slug          TEXT UNIQUE NOT NULL,
    description   TEXT,
    image_url     TEXT,
    product_count INTEGER DEFAULT 0,
    created_at    TIMESTAMPTZ DEFAULT NOW()
  );
  CREATE TABLE IF NOT EXISTS sub_categories (
    id               SERIAL PRIMARY KEY,
    name             TEXT NOT NULL,
    slug             TEXT UNIQUE NOT NULL,
    description      TEXT,
    image_url        TEXT,
    main_category_id INTEGER NOT NULL,
    created_at       TIMESTAMPTZ DEFAULT NOW()
  );
  CREATE TABLE IF NOT EXISTS child_categories (
    id              SERIAL PRIMARY KEY,
    name            TEXT NOT NULL,
    slug            TEXT UNIQUE NOT NULL,
    description     TEXT,
    image_url       TEXT,
    sub_category_id INTEGER NOT NULL,
    created_at      TIMESTAMPTZ DEFAULT NOW()
  );
  CREATE TABLE IF NOT EXISTS products (
    id             SERIAL PRIMARY KEY,
    name           TEXT NOT NULL,
    description    TEXT NOT NULL DEFAULT '',
    price          NUMERIC(10,2) NOT NULL,
    original_price NUMERIC(10,2),
    category_id    INTEGER DEFAULT 1,
    image_url      TEXT DEFAULT '',
    slug           TEXT DEFAULT '',
    images         TEXT[] DEFAULT '{}',
    stock          INTEGER DEFAULT 0,
    rating         NUMERIC(3,2) DEFAULT 0,
    review_count   INTEGER DEFAULT 0,
    featured       BOOLEAN DEFAULT FALSE,
    artisan        TEXT,
    origin         TEXT,
    tags           TEXT[] DEFAULT '{}',
    created_at     TIMESTAMPTZ DEFAULT NOW(),
    updated_at     TIMESTAMPTZ DEFAULT NOW()
  );
  CREATE TABLE IF NOT EXISTS cart_items (
    id         SERIAL PRIMARY KEY,
    session_id TEXT NOT NULL,
    product_id INTEGER NOT NULL,
    quantity   INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  );
  CREATE TABLE IF NOT EXISTS wishlist_items (
    id         SERIAL PRIMARY KEY,
    session_id TEXT NOT NULL,
    product_id INTEGER NOT NULL,
    added_at   TIMESTAMPTZ DEFAULT NOW()
  );
  CREATE TABLE IF NOT EXISTS orders (
    id               SERIAL PRIMARY KEY,
    order_number     TEXT UNIQUE NOT NULL,
    customer_name    TEXT NOT NULL,
    customer_email   TEXT NOT NULL,
    customer_phone   TEXT NOT NULL,
    shipping_address TEXT NOT NULL,
    shipping_city    TEXT NOT NULL,
    shipping_state   TEXT DEFAULT 'Assam',
    shipping_pincode TEXT NOT NULL,
    items            JSONB DEFAULT '[]',
    subtotal         NUMERIC(10,2) DEFAULT 0,
    shipping_fee     NUMERIC(10,2) DEFAULT 0,
    total            NUMERIC(10,2) DEFAULT 0,
    status           TEXT DEFAULT 'pending',
    payment_method   TEXT DEFAULT 'cod',
    payment_status   TEXT DEFAULT 'pending',
    notes            TEXT,
    session_id       TEXT,
    created_at       TIMESTAMPTZ DEFAULT NOW(),
    updated_at       TIMESTAMPTZ DEFAULT NOW()
  );
`);
console.log("Tables ban gayi!");

await client.query(`
  INSERT INTO main_categories (name, slug, image_url) VALUES
    ('Tea',          'tea',          'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400'),
    ('Handloom',     'handloom',     'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=400'),
    ('Handicrafts',  'handicrafts',  'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=400'),
    ('Organic Food', 'organic',      'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400'),
    ('Bamboo',       'bamboo',       'https://images.unsplash.com/photo-1580196969807-cc6de06c05be?w=400')
  ON CONFLICT (slug) DO NOTHING;
`);

await client.query(`
  INSERT INTO products (name, description, price, original_price, category_id, image_url, stock, rating, review_count, featured, artisan, origin) VALUES
    ('Premium Assam CTC Tea 500g',  'Rich malty CTC tea from Upper Assam. Perfect morning brew.',       299,  399,  1, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600', 150, 4.8, 234, true,  'Rajgarh Estate',       'Dibrugarh, Assam'),
    ('Mekhela Chador Blue',         'Handwoven traditional Assamese Mekhela Chador in deep blue.',      2499, 3200, 2, 'https://images.unsplash.com/photo-1594938298603-c8148c4b4d5e?w=600', 25,  4.9, 89,  true,  'Malati Devi',          'Sualkuchi, Assam'),
    ('Decorative Jaapi',            'Traditional bamboo and palm leaf Jaapi. Authentic handmade.',      899,  1200, 3, 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600', 40,  4.7, 156, true,  'Ramesh Kalita',        'Nagaon, Assam'),
    ('Organic Black Rice 1kg',      'Rare nutritious Assamese black rice. Direct from farmers.',        349,  450,  4, 'https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?w=600', 80,  4.6, 67,  true,  'Farmer Collective',    'Bodoland, Assam'),
    ('Bamboo Water Bottle',         'Eco-friendly handcrafted bamboo bottle. 750ml capacity.',          449,  599,  5, 'https://images.unsplash.com/photo-1580196969807-cc6de06c05be?w=600', 60,  4.5, 43,  false, 'Green Assam Crafts',   'Jorhat, Assam'),
    ('Golden Tips Tea 100g',        'Rare golden tips tea - the champagne of Assam teas.',              799,  999,  1, 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600',   30,  4.9, 112, true,  'Manohari Gold Estate', 'Golaghat, Assam'),
    ('Silk Gamosa',                 'Pure silk traditional Gamosa. Perfect for Bihu celebrations.',     1299, 1599, 2, 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600',   20,  4.8, 78,  false, 'Sualkuchi Weavers',    'Sualkuchi, Assam'),
    ('Cane Basket Set 3pcs',        'Handwoven cane baskets in 3 different sizes. Great for storage.',  699,  899,  3, 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=600', 45,  4.6, 92,  false, 'Dipak Nath',           'Barpeta, Assam'),
    ('Assam Orthodox Tea 250g',     'Single estate orthodox tea with floral notes.',                    549,  699,  1, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600',   50,  4.7, 88,  false, 'Halmari Tea Estate',   'Golaghat, Assam'),
    ('Brass Bell Metal Thali',      'Traditional bell metal thali handcrafted by skilled artisans.',    1899, 2400, 3, 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=600', 15,  4.8, 54,  true,  'Sarthebari Crafts',    'Sarthebari, Assam')
  ON CONFLICT DO NOTHING;
`);

const { rows: cats  } = await client.query("SELECT count(*) FROM main_categories");
const { rows: prods } = await client.query("SELECT count(*) FROM products");

console.log("");
console.log("Setup complete!");
console.log("Categories: " + cats[0].count);
console.log("Products:   " + prods[0].count);
console.log("");
console.log("Ab API server chala sakte ho:");
console.log("  cd artifacts/api-server && pnpm run dev:build");

await client.end();
