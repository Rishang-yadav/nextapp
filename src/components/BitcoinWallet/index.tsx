"use client";
import React from "react";
import { ConnectMultiButton } from "bitcoin-wallet-adapter";
import InnerMenu from "@/components/InnerMenu";

const BitcoinWallet = () => {
  return (
    <div>
      <ConnectMultiButton
        walletImageClass="w-[30px] rounded-xl"
        walletLabelClass="text-lg text-white capitalize tracking-wider "
        walletItemClass=" w-full bg-accent_dark cursor-pointer border-transparent rounded-xl mb-4 hover:border-green-500 transition-all"
        headingClass="text-white text-3xl pb-12 font-bold text-center bwa-flex bwa-flex-wrap bwa-items-center bwa-justify-around"
        buttonClassname=" text-white rounded-md flex items-center px-6 mx-7 h-[40px] py-1  font-light bg-accent_dark hover:bg-green-400  flex items-center mx-3 py-1 font-bold"
        InnerMenu={InnerMenu } // component to show a menu when wallet is connected
        icon="https://ordinalnovus.com/logo_default.png"
        iconClass="w-[100px] pb-2"
        // balance={1000}
       // ClassName=" border border-accent_dark"
      />
    </div>
  );
};

export default BitcoinWallet;
