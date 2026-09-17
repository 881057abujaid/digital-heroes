import prisma from "../src/lib/prisma.js";

const charities = [
    {
        name: "Hope Foundation",
        description:
            "Supporting education, healthcare, and community development.",
        imageUrl:
            "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b",
        websiteUrl: "https://example.com",
        isFeatured: true,
        isActive: true,
    },
    {
        name: "Green Earth Initiative",
        description:
            "Working to create a cleaner, greener, and more sustainable future.",
        imageUrl:
            "https://images.unsplash.com/photo-1497250681960-ef046c08a56e",
        websiteUrl: "https://example.com",
        isFeatured: true,
        isActive: true,
    },
    {
        name: "Bright Futures",
        description:
            "Helping young people access education and opportunities for a better future.",
        imageUrl:
            "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c",
        websiteUrl: "https://example.com",
        isFeatured: false,
        isActive: true,
    },
];

async function main() {
    console.log("🌱 Seeding charities...");

    for (const charity of charities) {
        await prisma.charity.create({
            data: charity,
        });
    }

    console.log("✅ Charities seeded successfully");
}

main()
    .catch((error) => {
        console.error("❌ Seed failed:", error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });