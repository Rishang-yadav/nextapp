import { NextRequest, NextResponse } from "next/server";
import dbConnect from '@/lib/dbConnect';
import FileData from '@/models/FileData';
import * as cryptoTools from '@cmdcode/crypto-tools';
import { bytesToHex } from "@/utils/Inscribe";
import { Tap, Script, Address, Signer, Tx } from "@cmdcode/tapscript";
import { ICreateInscription, IDoc } from "@/types";
import mime from "mime-types";
import { generateUnsignedPsbtForInscription } from "@/utils/psbt";


export async function POST(req: NextRequest) {
  console.log("************upload api called********");
  try {
      const body = await req.json();
      console.log(body,"hero");

     

      const {
        fileData,
        cardinal_address,
        cardinal_pubkey,
        ordinal_address,
        ordinal_pubkey,
        wallet,
        order_id,
        status
      } = body;


      if (
        !fileData ||
        !cardinal_address ||
        !cardinal_pubkey ||
        !ordinal_address ||
        !ordinal_pubkey ||
        !wallet ||
        !order_id
      ) {
        throw Error("Items missing");
      }
       
      let doc = {
        fileData,
        cardinal_address,
        cardinal_pubkey,
        ordinal_address,
        ordinal_pubkey,
        wallet,
        order_id,
        status,
        fee_rate: 265, 
        txid:"",
      };

      console.log({ doc });

      

      const inscriptions = await processInscriptions( doc,"testnet");
      
      console.log(inscriptions,"Inscriptions");
  
      await dbConnect();
      console.log("Database connected");


      console.log("Zero");

      const data : Record<string, any> = {
        ...inscriptions
      };

      // console.log("hello",data,"All data  stored in one variable data");



      console.log("dataaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa:::::::::::::::::::", data)


  

      const inscription: Record<string, any> = data; // doc

      const { psbt } = await generateUnsignedPsbtForInscription(
         cardinal_address,
         cardinal_pubkey,
         265,
         wallet,
         [inscription],
       );
       console.log({ psbt });
       data.psbt = psbt;
       await dbConnect();
      const response = await FileData.create(data);


      
      console.log("Image saved to database:", response);
      return NextResponse.json({ message: 'Image uploaded successfully' });
  } catch (error: any) {
      console.error('Error uploading image:', error);
      return NextResponse.json({ message: 'Failed to upload image', error: error.message }, { status: 500 });
  }
}



async function generatePrivateKey() {
  let isValid = false;
  let privkey;
  while (!isValid) {
    privkey = bytesToHex(cryptoTools.noble.secp.utils.randomPrivateKey());
    let seckey = cryptoTools.keys.get_seckey(privkey);
    let pubkey = cryptoTools.keys.get_pubkey(seckey);
    const init_script = [pubkey, "OP_CHECKSIG"];
    let init_leaf = await Tap.tree.getLeaf(Script.encode(init_script));
    let [init_tapkey, init_cblock] = await Tap.getPubKey(pubkey, { target: init_leaf });
    
    const test_redeemtx = Tx.create({
      vin: [
        {
          txid: "a99d1112bcb35845fd44e703ef2c611f0360dd2bb28927625dbc13eab58cd968",
          vout: 0,
          prevout: {
            value: 10000,
            scriptPubKey: ["OP_1", init_tapkey],
          },
        },
      ],
      vout: [
        {
          value: 8000,
          scriptPubKey: ["OP_1", init_tapkey],
        },
      ],
    });
    const test_sig = await Signer.taproot.sign(seckey.raw, test_redeemtx, 0, {
      extension: init_leaf,
    });
    test_redeemtx.vin[0].witness = [test_sig.hex, init_script, init_cblock];
    isValid = await Signer.taproot.verify(test_redeemtx, 0, { pubkey });
    if (!isValid) {
      console.log("Invalid key generated, retrying...");
    } else {
      console.log({ privkey });
    }
  }
  if (!privkey) {
    throw Error("No privkey was generated");
  }
  return privkey;
}

// async function processInscriptions( doc:IDoc, network: "testnet" | "mainnet") {
//   const ec = new TextEncoder();
  
//   const privkey = await generatePrivateKey();
//   const seckey = cryptoTools.keys.get_seckey(privkey);
//   const pubkey = cryptoTools.keys.get_pubkey(seckey);
  
  
  
//   const mimetype = doc.fileData.type || "text/plain;charset=utf-8";
//   const base64data = doc.fileData.dataUrl.split(",")[1];
//   const data = Buffer.from(base64data, "base64");
  
//   const script = [
//     pubkey,
//     "OP_CHECKSIG",
//     "OP_0",
//     "OP_IF",
//     ec.encode("ord"),
//     "01",
//     ec.encode(mimetype),
//     "OP_0",
//     data,
//     "OP_ENDIF",
//   ];
  
//   const leaf = Tap.tree.getLeaf(Script.encode(script));
//   const [tapkey, cblock] = Tap.getPubKey(pubkey, { target: leaf });
  
//  const inscriptionAddress = Address.p2tr.encode(tapkey, ); // Assuming mainnet
  
//  console.debug("Inscription address: ", inscriptionAddress);
//   console.debug("Tapkey:", tapkey);
//   console.log(doc.fileData.type);
  
//   let txsize = 100 + Math.floor(data.length / 4); // PREFIX replaced with a constant value (100 as an example)
//   let inscription_fee = doc.fee_rate * txsize;
//   doc.inscription_fee = inscription_fee;
  
//   console.log({ txsize, inscription_fee });
  
//   const inscriptions = {
//     ...doc,
//     privkey,
//     leaf: leaf,
//     tapkey: tapkey,
//     cblock: cblock,
//     inscription_fee:inscription_fee,
//     inscription_address: inscriptionAddress,
//     txsize: txsize,
//     fee_rate: doc.fee_rate,
//     network
//   };

//   return inscriptions;
// }


async function processInscriptions(doc: IDoc, network: "testnet" | "mainnet") {
  const ec = new TextEncoder();
  
  const privkey = await generatePrivateKey();
  const seckey = cryptoTools.keys.get_seckey(privkey);
  const pubkey = cryptoTools.keys.get_pubkey(seckey);

  const mimetype = doc.fileData.type || "text/plain;charset=utf-8";
  const base64data = doc.fileData.dataUrl;
  const data = Buffer.from(base64data, "base64");

  const script = [
    pubkey,
    "OP_CHECKSIG",
    "OP_0",
    "OP_IF",
    ec.encode("ord"),
    "01",
    ec.encode(mimetype),
    "OP_0",
    data,
    "OP_ENDIF",
  ];

  const leaf = Tap.tree.getLeaf(Script.encode(script));
  const [tapkey, cblock] = Tap.getPubKey(pubkey, { target: leaf });

  // @ts-ignore
  const inscriptionAddress = Address.p2tr.encode(tapkey,network); 

  let txsize = 100 + Math.floor(data.length / 4); // PREFIX replaced with a constant value (100 as an example)
  let inscription_fee = doc.fee_rate * txsize;
  doc.inscription_fee = inscription_fee;

  const inscriptions = {
    ...doc,
    privkey,
    leaf: leaf,
    tapkey: tapkey,
    cblock: cblock,
    inscription_fee: inscription_fee,
    inscription_address: inscriptionAddress,
    txsize: txsize,
    fee_rate: doc.fee_rate,
    network,
    fileName: doc.fileData.fileName,
    type: doc.fileData.type,
    size: doc.fileData.size,
    dataUrl: doc.fileData.dataUrl
    
  };

  return inscriptions;
}
