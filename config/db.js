const mongoose = require("mongoose");

// تعريف كائن لحفظ حالة الاتصال (يتم الاحتفاظ به بين استدعاءات الدالة)
const connection = {}; 

async function connectToDb() {
  // 1. فحص الاتصال الحالي
  if (connection.isConnected) {
    console.log("Using existing database connection.");
    return; // إذا كان متصلاً بالفعل، لا تفعل شيئاً وعد
  }
  
  // 2. محاولة الاتصال إذا لم يكن متصلاً
  try {
    const db = await mongoose.connect(process.env.MONGO_URI, {
       // يُفضل إزالة أي خيارات تخص الـ poolSize لأن Vercel تديرها
    });
    
    // 3. تحديث الحالة
    connection.isConnected = db.connections[0].readyState;
    console.log("Connected to database successfully.");

  } catch (error) {
    console.error("Connection failed to MongoDB!", error);
    // قد تحتاج إلى رمي الخطأ لتعالجه Express
    // throw error; 
  }
}

module.exports = connectToDb;