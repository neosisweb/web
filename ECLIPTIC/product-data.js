// product-data.js

// Helper function to create a URL-friendly slug from a name
function createSlug(name) {
    return name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
}

const products = [
    {
        id: "winter-look-1",
        name: "Obsidian Flow Cape",
        price: 475.00,
        category: "unisex", // Example: Could be men or women too
        images: [`img/${createSlug("Obsidian Flow Cape")}.jpg`],
        sizes: ["One Size"],
        description: "A dramatic, flowing cape in deep obsidian black, crafted from a luxurious wool blend. Features a minimalist closure and an asymmetric hemline for a modern silhouette.",
        deliveryReturns: "Enjoy complimentary standard shipping on all orders. Express shipping options are available at checkout. Returns are accepted within 30 days of receipt, provided the item is in its original condition with all tags attached. Please visit our returns portal for more details.",
        fabricStructure: "Main: 70% Wool, 30% Polyester. Lining: 100% Viscose. Trim: 100% Genuine Leather. Care: Dry clean only.",
        sku: "ECC-001-BLK"
    },
    {
        id: "modern-trench",
        name: "Neo-Noir Trench Coat",
        price: 299.95,
        category: "men",
        images: [`img/${createSlug("Neo-Noir Trench Coat")}.jpg`],
        sizes: ["XS", "S", "M", "L", "XL"],
        description: "A contemporary take on the classic trench, featuring sharp lines, an oversized collar, and a deconstructed belt. Water-resistant fabric makes it as functional as it is stylish.",
        deliveryReturns: "Complimentary shipping. 30-day returns. See policy for details.",
        fabricStructure: "Main: 80% Virgin Wool, 20% Polyamide. Lining: 100% Cupro. Care: Specialist dry clean.",
        sku: "ECT-002-BLK"
    },
    {
        id: "silk-blouse-dark",
        name: "Midnight Silk Blouse",
        price: 180.00,
        category: "women", // Added for completeness, can be filtered out if not needed
        images: [`img/${createSlug("Midnight Silk Blouse")}.jpg`],
        sizes: ["S", "M", "L"],
        description: "An elegant blouse cut from pure mulberry silk, dyed in a deep midnight hue. Features a concealed placket and subtle bishop sleeves.",
        deliveryReturns: "Standard shipping applies. 30-day returns.",
        fabricStructure: "100% Organic Cotton. Care: Machine wash cold, tumble dry low.",
        sku: "ECB-003-MID"
    },
    {
        id: "tailored-trousers-charcoal",
        name: "Charcoal Tailored Trousers",
        price: 220.00,
        category: "men",
        images: [`img/${createSlug("Charcoal Tailored Trousers")}.jpg`],
        sizes: ["28", "30", "32", "34", "36"],
        description: "Expertly tailored trousers in a rich charcoal wool, offering a slim, modern fit. Perfect for elevating both formal and smart-casual looks.",
        deliveryReturns: "Complimentary shipping. 30-day returns. See policy for details.",
        fabricStructure: "Main: 80% Virgin Wool, 20% Polyamide. Lining: 100% Cupro. Care: Specialist dry clean.",
        sku: "ECP-004-CHR"
    },
    {
        id: "eclipse-overcoat",
        name: "The Eclipse Overcoat",
        price: 650.00,
        category: "men",
        images: [`img/${createSlug("The Eclipse Overcoat")}.jpg`],
        sizes: ["M", "L", "XL"],
        description: "A limited edition overcoat with a striking silhouette and premium detailing.",
        deliveryReturns: "Complimentary shipping. 30-day returns. See policy for details.",
        fabricStructure: "Main: 90% Wool, 10% Cashmere. Lining: 100% Silk. Care: Specialist dry clean only.",
        sku: "ECL-001-LTD"
    },
    {
        id: "leather-detail-jacket",
        name: "Jacket with Leather Trim and Embroidery",
        price: 259.95,
        category: "men", // Assuming men's, adjust if needed
        images: [
            `img/${createSlug("Jacket Leather Trim Embroidery")}-1.jpg`,
            `img/${createSlug("Jacket Leather Trim Embroidery")}-2.jpg`,
            `img/${createSlug("Jacket Leather Trim Embroidery")}-detail.jpg`,
            `img/${createSlug("Jacket Leather Trim Embroidery")}-back.jpg`
        ],
        sizes: ["XS", "S", "M", "L", "XL"],
        description: "This meticulously crafted jacket features premium leather trim and intricate embroidery on the back.",
        deliveryReturns: "Complimentary standard shipping. 30-day returns.",
        fabricStructure: "Main: 70% Wool, 30% Polyester. Lining: 100% Viscose. Trim: 100% Genuine Leather. Care: Dry clean only.",
        sku: "ECJ-001-BLK"
    },
    // Adding some Kids products
    {
        id: "kids-graphic-tee",
        name: "Cosmic Explorer Tee",
        price: 29.99,
        category: "kids",
        images: [`img/${createSlug("Kids Cosmic Explorer Tee")}.jpg`],
        sizes: ["2T", "3T", "4T", "5", "6"],
        description: "Soft organic cotton tee with a vibrant cosmic explorer graphic. Perfect for little adventurers.",
        deliveryReturns: "Standard shipping. 30-day returns.",
        fabricStructure: "100% Organic Cotton. Machine washable.",
        sku: "ECK-001-BLU"
    },
    {
        id: "kids-denim-jacket",
        name: "Mini Rebel Denim Jacket",
        price: 59.50,
        category: "kids",
        images: [`img/${createSlug("Kids Mini Rebel Denim Jacket")}.jpg`],
        sizes: ["2T", "4T", "6", "8"],
        description: "A classic denim jacket, scaled down for kids. Durable and stylish with easy snap buttons.",
        deliveryReturns: "Standard shipping. 30-day returns.",
        fabricStructure: "98% Cotton, 2% Elastane. Machine washable.",
        sku: "ECK-002-DEN"
    },
    {
        id: "kids-cargo-pants",
        name: "Adventure Cargo Pants",
        price: 45.00,
        category: "kids",
        images: [`img/${createSlug("Kids Adventure Cargo Pants")}.jpg`],
        sizes: ["4T", "5", "6", "7", "8"],
        description: "Comfortable and rugged cargo pants with plenty of pockets for treasures. Elastic waistband for a great fit.",
        deliveryReturns: "Standard shipping. 30-day returns.",
        fabricStructure: "100% Cotton Twill. Machine washable.",
        sku: "ECK-003-KHK"
    },
    {
        id: "kids-hoodie-dino",
        name: "Dino Spike Hoodie",
        price: 39.99,
        category: "kids",
        images: [`img/${createSlug("Kids Dino Spike Hoodie")}.jpg`],
        sizes: ["2T", "3T", "4T", "5"],
        description: "Fun and cozy hoodie with playful dino spikes on the hood and back. Made from soft fleece.",
        deliveryReturns: "Standard shipping. 30-day returns.",
        fabricStructure: "80% Cotton, 20% Polyester Fleece. Machine washable.",
        sku: "ECK-004-GRN"
    },
    // For "You May Also Like" section, ensure these also have local paths and categories
    {
        id: "leather-trim-dress", name: "Leather Trim Midi Dress", price: 350.00, category: "women", images: [`img/${createSlug("Leather Trim Midi Dress")}.jpg`], sku: "ECD-004-BLK", sizes: ["S", "M", "L"], description: "Elegant midi dress with subtle leather trim detailing.", deliveryReturns: "Complimentary shipping. 30-day returns.", fabricStructure: "Main: 60% Viscose, 40% Silk. Trim: Lambskin Leather."
    },
    {
        id: "structured-shoulder-top", name: "Structured Shoulder Top", price: 180.00, category: "women", images: [`img/${createSlug("Structured Shoulder Top")}.jpg`], sku: "ECT-005-BLK", sizes: ["XS", "S", "M"], description: "Modern top with defined, structured shoulders for a powerful silhouette.", deliveryReturns: "Standard shipping. 30-day returns.", fabricStructure: "95% Cotton, 5% Elastane."
    },
    {
        id: "tailored-wool-trousers-pdp", name: "Fine Wool Tailored Trousers", price: 290.00, category: "men", images: [`img/${createSlug("Fine Wool Tailored Trousers")}.jpg`], sku: "ECP-006-BLK", sizes: ["28", "30", "32", "34"], description: "Impeccably tailored trousers crafted from fine Italian wool.", deliveryReturns: "Complimentary shipping. 30-day returns.", fabricStructure: "100% Virgin Wool. Lining: 100% Cupro."
    },
    {
        id: "asymmetric-drape-skirt", name: "Asymmetric Drape Skirt", price: 220.00, category: "women", images: [`img/${createSlug("Asymmetric Drape Skirt")}.jpg`], sku: "ECS-007-BLK", sizes: ["S", "M", "L"], description: "A chic skirt featuring an asymmetric drape and a fluid silhouette.", deliveryReturns: "Standard shipping. 30-day returns.", fabricStructure: "70% Triacetate, 30% Polyester."
    }
];

function getRelatedProducts(currentProductId, count = 4) {
    const related = [];
    for (const product of products) {
        if (product.id !== currentProductId && related.length < count) {
            related.push(product);
        }
        if (related.length >= count) break;
    }
    return related;
}
