require("dotenv").config();
const connectDB = require("./config/db");
const Tenant = require("./Models/tenant.model");

async function seedTenants() {
  try {
    await connectDB();

    await Tenant.create([
      { name: "Acme ", slug: "acme", subscription: "free" },
      { name: "Globex ", slug: "globex", subscription: "free" },
    ]);

    console.log("Tenants created!");
    process.exit();
  } catch (error) {
    console.error("Error seeding tenants:", error);
    process.exit(1);
  }
}

seedTenants();
