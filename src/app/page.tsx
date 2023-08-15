import ClientInfo from "~/components/client-info";
import Footer from "~/components/footer";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <ClientInfo />
      <Footer />
    </main>
  );
}
