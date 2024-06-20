// export interface ICollection{
//     file_type:string,
//     dataUrl: string,
//     cardinal_address: string
//     cardinal_pubkey: string
//     ordinal_address: string
//     ordinal_pubkey: string
//     wallet: string
//     order_id: string
//     status: string
// }


export interface ICreateInscription extends IDoc {
    order_id: string;
    privkey: string;
    ordinal_address: string;
    type: string;
    dataUrl: string;
    size: number;
    inscription_address: string;
    txid: string;
    leaf: string;
    tapkey: string;
    cblock: string;
    inscription_fee: number;
    inscription_id: string;
    network: "testnet" | "mainnet";
    status: string;
    fee_rate: number;
  }

 interface FileDataType{
    fileName: string;
    type:string,
    size:number
    dataUrl: string,
   
  }
  
  export interface IDoc {
    fileData:FileDataType;
    cardinal_address: string;
    cardinal_pubkey: string;
    ordinal_address: string;
    ordinal_pubkey: string;
    wallet: string;
    order_id: string;
    status: string;
    fee_rate: number;
    inscription_fee?:number
  }
  

  export interface IInscribeOrder {
    _id?: string;
    order_id: string;
    receive_address: string;
    chain_fee: number;
    service_fee: number;
    txid: string;
    psbt: string;
    status: "payment pending" | "payment received" | "inscribed" | "cancelled";
    inscriptionCount?: number;
    referrer?: string;
    referral_fee?: number;
    createdAt?: Date;
    updatedAt?: Date;
  }
  