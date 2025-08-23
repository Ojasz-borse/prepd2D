import { Redirect } from "expo-router";

export default function Index() {
  // By default go to mobile-number screen
  return <Redirect href="/mobile-number" />;
}
