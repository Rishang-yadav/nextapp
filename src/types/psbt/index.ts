import axios from "axios";
export interface AddressTxsUtxo {
    txid: string;
    vout: number;
    status: TxStatus;
    value: number;
}
export interface TxStatus {
    confirmed: boolean;
    block_height: number;
    block_hash: string;
    block_time: number;
}


export async function getUtxosByAddress(address: string) {
    const url =
      process.env.NEXT_PUBLIC_NETWORK === "testnet"
        ? `https://mempool.space/testnet/api/address/${address}/utxo`
        : `https://mempool-api.ordinalnovus.com/address/${address}/utxo`;
    const { data } = await axios.get(url);
    return data;
  }

  export interface UTXO {
    status: {
      block_hash: string;
      block_height: number;
      block_time: number;
      confirmed: boolean;
    };
    txid: string;
    value: number;
    vout: number;
    tx: bitcoin.Transaction;
  }