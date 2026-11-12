import ScrollTop from '@/components/ScrollTop';
import Header from '@/components/layouts/Header';
import Footer from '@/components/layouts/Footer';

export default function EnglishLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header lang="en" />
      <main>{children}</main>
      <Footer lang="en" />
      <ScrollTop lang="en" />
    </>
  );
}
