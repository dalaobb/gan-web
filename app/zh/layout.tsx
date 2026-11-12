import Header from '@/components/layouts/Header';
import Footer from '@/components/layouts/Footer';

export default function ChineseLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header lang="zh" />
      <main>{children}</main>
      <Footer />
    </>
  );
}
