import dbConnect from "@/lib/dbConnect";
import FileData from "@/models/FileData";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

async function fetchBalance(inscription_address: string) {
  try {
    const response = await axios.get(
      `https://mempool.space/testnet/api/address/${inscription_address}`
    );
    const { data: responseData } = response;
    // console.log("dataaaaaaaaaaaaaa from mempoooooollllll",)
    return {
      confirmedBalance:
        responseData.chain_stats.funded_txo_sum -
        responseData.chain_stats.spent_txo_sum,

      mempoolBalance:
        responseData.mempool_stats.funded_txo_sum -
        responseData.mempool_stats.spent_txo_sum,
    };
  } catch (err: any) {
    console.log(
      "Error occured while fetching balance from mempool api",
      err.message || err
    );
    throw new Error("Error occured while fetching balance from mempool api");
  }
}

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    await dbConnect();

    // check krenge whether a pending incscription is present or not
    const fetchedPendingInscription = await FileData.findOne({
      status: "pending",
    });

    if (!fetchedPendingInscription)
      return NextResponse.json(
        { message: "No pending inscription found" },
        { status: 404 }
      );

    // mempool api se data fetch krenge
    const fetchedBalance = await fetchBalance(
      fetchedPendingInscription.inscription_address
    );

    console.log("fetcheeeeeddddddddd", fetchedBalance);

    // fetched balance jo h wo inscription_fee ke ya toh equal ho ya phir jyada, tabhi toh inscription succeed hoga
    if (
      fetchedBalance.confirmedBalance <
        fetchedPendingInscription.inscription_fee &&
      fetchedBalance.mempoolBalance < fetchedPendingInscription.inscription_fee
    ) {
      return NextResponse.json(
        { message: "Insufficient balance to proceed" },
        { status: 400 }
      );
    }

    // agr success hota h, then update the status
    fetchedPendingInscription.status = "payment received";
    await fetchedPendingInscription.save();

    return NextResponse.json(
      { message: "Payment received successfully" },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { message: "Error while fetching balance" },
      { status: 500 }
    );
  }
}









