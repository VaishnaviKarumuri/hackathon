import sqlite3

# Connect to SQLite database (creates it if not exists)
conn = sqlite3.connect("products.db")
cursor = conn.cursor()

# Create Products Table
cursor.execute("""
CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    price REAL NOT NULL
)
""")

# Insert Sample Products
products = [
    ("Wireless Mouse", "Ergonomic wireless mouse", 29.99),
    ("Laptop", "15-inch laptop with Intel Core i7", 899.99),
    ("Bluetooth Headphones", "Noise-canceling over-ear headphones", 79.99),
    ("Smartphone", "Latest smartphone with OLED display", 999.99),
    ("Mechanical Keyboard", "RGB backlit mechanical keyboard", 129.99),
    ("Gaming Monitor", "27-inch 144Hz gaming monitor", 299.99),
    ("Smartwatch", "Waterproof smartwatch with heart rate monitor", 199.99),
    ("External Hard Drive", "1TB external HDD for backups", 59.99),
    ("Wireless Charger", "Fast wireless charging pad", 39.99),
    ("Portable Speaker", "Bluetooth speaker with deep bass", 49.99),

    ("Sunscreen SPF 50", "Broad spectrum UV protection sunscreen", 15.99),
    ("Facewash", "Gentle foaming face cleanser for all skin types", 8.99),
    ("Moisturizer", "Hydrating daily moisturizer with hyaluronic acid", 12.99),
    ("Vitamin C Serum", "Brightening serum with vitamin C & hyaluronic acid", 18.99),
    ("Anti-aging Night Cream", "Retinol-based night cream for skin renewal", 22.99),
    ("Lip Balm", "Moisturizing lip balm with shea butter", 4.99),
    ("BB Cream", "Lightweight BB cream with SPF", 14.99),
    ("Clay Mask", "Detoxifying face mask with natural clay", 10.99),
    ("Exfoliating Scrub", "Gentle face scrub with microbeads", 9.99),
    ("Toner", "Alcohol-free facial toner with rose water", 7.99),

    ("Men's T-Shirt", "Cotton crew neck t-shirt", 9.99),
    ("Men's Polo Shirt", "Classic polo shirt with embroidered logo", 15.99),
    ("Men's Jeans", "Slim fit stretch denim jeans", 39.99),
    ("Men's Formal Shirt", "Long sleeve button-down formal shirt", 24.99),
    ("Men's Hoodie", "Casual fleece hoodie with front pocket", 29.99),
    ("Men's Jacket", "Water-resistant bomber jacket", 49.99),
    ("Men's Shorts", "Cotton casual shorts with pockets", 19.99),
    ("Men's Sweatpants", "Comfortable athletic sweatpants", 25.99),
    ("Men's Blazer", "Slim fit casual blazer", 59.99),
    ("Men's Sweater", "Wool blend crew neck sweater", 34.99),


    ("Women's T-Shirt", "Soft cotton fitted t-shirt", 12.99),
    ("Women's Blouse", "Chiffon long sleeve blouse", 22.99),
    ("Women's Jeans", "High-waisted skinny jeans", 42.99),
    ("Women's Dress", "Elegant evening dress with lace", 49.99),
    ("Women's Hoodie", "Oversized hoodie with front pocket", 29.99),
    ("Women's Jacket", "Stylish leather biker jacket", 59.99),
    ("Women's Skirt", "Flared midi skirt with floral print", 19.99),
    ("Women's Sweatpants", "Casual jogger pants with elastic waist", 24.99),
    ("Women's Blazer", "Tailored office blazer", 54.99),
    ("Women's Sweater", "Cable knit turtleneck sweater", 39.99),

    ("Men's Sneakers", "Casual lightweight sneakers", 49.99),
    ("Men's Loafers", "Classic leather loafers", 59.99),
    ("Men's Running Shoes", "High-performance running shoes", 79.99),
    ("Men's Sandals", "Comfortable slip-on sandals", 29.99),
    ("Men's Boots", "Waterproof hiking boots", 89.99),

    ("Women's Sneakers", "Fashionable white sneakers", 44.99),
    ("Women's Heels", "Elegant high heels for formal events", 69.99),
    ("Women's Sandals", "Stylish summer sandals", 29.99),
    ("Women's Flats", "Ballet flats with cushioned sole", 39.99),
    ("Women's Boots", "Knee-high leather boots", 99.99)

]

cursor.executemany("INSERT INTO products (name, description, price) VALUES (?, ?, ?)", products)
conn.commit()
conn.close()

print("Database initialized with 10 products!")

