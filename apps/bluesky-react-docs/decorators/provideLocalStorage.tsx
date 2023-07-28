import { createContext, useEffect, useState } from "react";

const SERVICE_KEY = "bluesky-react/service";

export const LocalStorageContext = createContext({
  service: "https://bsky.social",
  setService(_: string) {},
});

export function provideLocalStorage(story: React.ReactNode) {
  const [service, setService] = useState(
    localStorage.getItem(SERVICE_KEY) ?? "https://bsky.social"
  );

  useEffect(() => {
    localStorage.setItem(SERVICE_KEY, service);
  }, [service]);

  return (
    <LocalStorageContext.Provider value={{ service, setService }}>
      {story}
    </LocalStorageContext.Provider>
  );
}
