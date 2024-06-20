"use client";
import React, { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { useWalletAddress } from "bitcoin-wallet-adapter";

export default function UploadImage() {
  const walletDetails = useWalletAddress();
  const [imageSrc, setImageSrc] = useState<{ type: string; size: number; dataUrl: string } | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string>("");

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        const fileData = {
          fileName:file.name,
          type: file.type,
          size: file.size,
          dataUrl: reader.result as string,
        };
        console.log(fileData, "fileData5");
        setImageSrc(fileData);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedFile || !walletDetails || !imageSrc) return;

    const { cardinal_address, cardinal_pubkey, ordinal_address, ordinal_pubkey, wallet } = walletDetails;
    // const{type,size,dataUrl} = imageSrc;
    // console.log(type,"imageSrc");



    const body = {
      
      fileData:imageSrc,
      cardinal_address,
      cardinal_pubkey,
      ordinal_address,
      ordinal_pubkey,
      wallet,
      order_id: uuidv4(),
      status: "pending",
    };
    console.log(body,"index body")

    try {
      const res = await axios.post("/api/upload", body);
      console.log("Super", res.data);
      setMessage(res.data.message);
    } catch (error) {
      console.error("Error uploading image:", error);
      setMessage("Failed to upload image");
    }
  };

  return (
   <div className="">
    {walletDetails ? (
       <div>
       <h2>Upload Image</h2>
       <form onSubmit={handleSubmit}>
         <input type="file" accept="image/*" onChange={onChangeHandler} required />
         <br /><br />
         {imageSrc && <img src={imageSrc.dataUrl} alt="Image Preview" style={{ maxWidth: "300px" }} />}
         <br /><br />
         <button
           className="text-white rounded-md  px-6 h-[40px]  bg-accent_dark hover:bg-green-400 flex items-center mx-3 py-1 font-bold"
           type="submit"
         >
           Upload
         </button>
       </form>
       {message && <p>{message}</p>}
     </div>
    ):(
      <div>
        <h2>Wallet not connected</h2>
      </div>
    )}
   </div>
  );
}
