import { StatusBar } from 'expo-status-bar';
import * as SQLite from 'expo-sqlite'
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';
import { Platform, StyleSheet, Text, View } from 'react-native';
const DB_NAME = "test.db";

const DB = SQLite.openDatabase(DB_NAME)

export async function openDatabase() {
  if (Platform.OS === "web") {
    return {
      transaction: () => {
        return {
          executeSql: () => {},
        };
      },
    };
  }
  
  const sqlDir = FileSystem.documentDirectory + 'SQLite'
  // await FileSystem.deleteAsync(sqlDir);
  if (!(await FileSystem.getInfoAsync(sqlDir)).exists) {
    await FileSystem.makeDirectoryAsync(sqlDir, { intermediates: false });
  }
  
  const asset = Asset.fromModule(require('../assets/hazelvision.db'));
  await FileSystem.downloadAsync(asset.uri, sqlDir + DB_NAME);
  return SQLite.openDatabase(DB_NAME);
}

const dbtest = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    DB.transactionAsync( async (tx) => {
        try {
            let { rows }  = await tx.executeSqlAsync(
                "SELECT id FROM test_table",
                []
            )
            
            resolve(rows)

        } catch (err) {
            console.log(err, 'my channel error')
            reject(err)
        }

    })
})
}

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Open up App.tsx to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
