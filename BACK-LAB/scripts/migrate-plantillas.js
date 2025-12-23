// Migration script to fix plantillas field name from "parámetros" to "parametros"
const mongoose = require('mongoose');
require('dotenv').config();

async function migratePlantillas() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✅ Connected to MongoDB');

        const db = mongoose.connection.db;
        const plantillasCollection = db.collection('plantillas');

        // Find all documents that have "parámetros" field
        const cursor = plantillasCollection.find({ 'parámetros': { $exists: true } });
        const docsToUpdate = await cursor.toArray();

        console.log(`\n📊 Found ${docsToUpdate.length} documents with "parámetros" field\n`);

        let updatedCount = 0;

        for (const doc of docsToUpdate) {
            console.log(`Migrating: ${doc.nombre}`);
            console.log(`  - parámetros items: ${doc['parámetros']?.length || 0}`);
            console.log(`  - parametros items: ${doc.parametros?.length || 0}`);

            // Update: rename field from "parámetros" to "parametros"
            const result = await plantillasCollection.updateOne(
                { _id: doc._id },
                {
                    $set: { parametros: doc['parámetros'] },
                    $unset: { 'parámetros': '' }
                }
            );

            if (result.modifiedCount > 0) {
                updatedCount++;
                console.log(`  ✅ Migrated successfully\n`);
            } else {
                console.log(`  ⚠️  No changes made\n`);
            }
        }

        console.log(`\n🎉 Migration complete!`);
        console.log(`   Updated ${updatedCount} documents`);

        // Verify the migration
        console.log('\n🔍 Verification:');
        const withAccent = await plantillasCollection.countDocuments({ 'parámetros': { $exists: true } });
        const withoutAccent = await plantillasCollection.countDocuments({ 'parametros': { $exists: true } });

        console.log(`   Documents with "parámetros": ${withAccent}`);
        console.log(`   Documents with "parametros": ${withoutAccent}`);

        await mongoose.connection.close();
        console.log('\n✅ MongoDB connection closed');

    } catch (error) {
        console.error('❌ Error during migration:', error);
        process.exit(1);
    }
}

// Run the migration
migratePlantillas();
