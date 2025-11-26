import User from "../models/User.js";
import bcrypt from "bcryptjs";

export const createSuperAdmin = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      console.log("⚠️  ADMIN_EMAIL or ADMIN_PASSWORD not set in .env - skipping superadmin creation");
      return;
    }

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminEmail.toLowerCase() });
    
    if (existingAdmin) {
      console.log("✅ Superadmin already exists");
      return;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(adminPassword, salt);

    // Create admin
    const admin = new User({
      name: "Super Admin",
      email: adminEmail.toLowerCase(),
      passwordHash,
      role: "admin"
    });

    await admin.save();
    console.log("✅ Superadmin created successfully");
    console.log(`   Email: ${adminEmail}`);
  } catch (error) {
    console.error("❌ Error creating superadmin:", error.message);
  }
};

