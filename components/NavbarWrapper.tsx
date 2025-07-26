import { headers } from "next/headers";
import Navbar from "./Navbar";

export default function NavbarWrapper() {
  const headersList = headers();
  const isLoggedIn = headersList.has("X-current-user-id");

  return <Navbar isLoggedIn={isLoggedIn} />;
}
