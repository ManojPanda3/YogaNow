import { headers } from "next/headers";
import Navbar from "./Navbar";

export default async function NavbarWrapper() {
  const headersList = await headers();
  const isLoggedIn = headersList.has("X-current-user-id");

  return (
    <Navbar isLoggedIn={isLoggedIn} />

  );
}
