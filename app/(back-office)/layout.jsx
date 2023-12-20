import Header from "@/components/common/Header";

const BackOfficeLayout = ({ children }) => {
  return (
    <div className="flex h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      {/* <Footer /> */}
    </div>
  );
};

export default BackOfficeLayout;
