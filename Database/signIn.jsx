export async function addUser(db, email, userName, hashedPassword) {   
    console.log("Adding user to the database...");
  
    try {
  
      const result = await db.runAsync(
        `INSERT OR IGNORE INTO Users (userName, email, password) VALUES (?, ?, ?);`,
        [userName, email, hashedPassword]  // Pass values as an array
        );
  
        console.log('User Added:', result.lastInsertRowId, result.changes);
    } catch (err) {
        console.error("Error adding user to database:", err);
    } 
  }