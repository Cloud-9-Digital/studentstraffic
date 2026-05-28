import { useEffect, useState } from "react";
import { Redirect } from "expo-router";

import { getToken } from "../src/api/tokenStore";

export default function Index() {
  const [target, setTarget] = useState<"/(tabs)" | "/(auth)/welcome" | null>(null);

  useEffect(() => {
    getToken().then(token => {
      setTarget(token ? "/(tabs)" : "/(auth)/welcome");
    });
  }, []);

  if (target === null) return null;
  return <Redirect href={target} />;
}
