import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import MainNavigation from "./config/Navigation";

export default function App() {
  return (
    <View style={styles.container}>
      <MainNavigation />
      <StatusBar style="auto" backgroundColor="gray" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
