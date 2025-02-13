import * as SQLite from 'expo-sqlite';
import { useSQLiteContext } from 'expo-sqlite';
import { View, Text } from 'react-native'
import React from 'react'


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



// const statement = await db.prepareAsync(
//     'INSERT OR IGNORE INTO Users (userName, email, password) VALUES  ($userName, $email, $password);'
//   );
//   try {
//     let result = await statement.executeAsync({ $userName: , $intValue: 101 });
//     console.log('bbb and 101:', result.lastInsertRowId, result.changes);
  
//     result = await statement.executeAsync({ $value: 'ccc', $intValue: 102 });
//     console.log('ccc and 102:', result.lastInsertRowId, result.changes);
  
//     result = await statement.executeAsync({ $value: 'ddd', $intValue: 103 });
//     console.log('ddd and 103:', result.lastInsertRowId, result.changes);
//   } finally {
//     await statement.finalizeAsync();
//   }