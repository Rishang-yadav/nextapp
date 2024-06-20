import Uploadfile from "@/components/Uploadfile";

import BitcoinWallet from "@/components/BitcoinWallet";

// import BitcoinWallet from "../components/BitcoinWallet";
export default function Home() {
  return (
    <div>
      <h1>Bitcoin Wallet Adapter </h1>

      <div className="flex justify-evenly">
        <BitcoinWallet/>
        <Uploadfile/>
       
      </div>
    </div>
  );
}
