import { Props } from "next/script";
import { Header } from "./header";
import { Footer } from "./footer";
type props = {
    children: React.ReactNode;
}
const MarketingLayout = ({children}: Props) => {
    return(
        <div className="min-h-screen flex flex-col">
            <Header/>
            <main className="flex-1 flex flex-col items-center justify-center">
                {children}
            </main>
            <Footer/>
        </div>
    );
};
export default MarketingLayout;