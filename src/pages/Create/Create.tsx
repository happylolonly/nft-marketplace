import { useState } from "react";

import { create as ipfsHttpClient } from "ipfs-http-client";
import { ethers } from "ethers";

const client = ipfsHttpClient({
  url: "https://ipfs.infura.io:5001/api/v0",
});

function Create({ marketplace, nft }) {
  const [form, setForm] = useState({
    title: "title",
    description: "desct",
    image: "",
    price: 2,
  });

  const [image, setImage] = useState(null);
  async function uploadToIpfs(file) {
    const result = await client.add(file);
    console.log(result);
    setImage(`https://ipfs.infura.io/ipfs/${result.path}`);

    return result;
  }

  function handleChange(value, name) {
    setForm({
      ...form,
      [name]: value,
    });
  }

  return (
    <div className="flex flex-col">
      <h1>create and list</h1>
      <input
        // value={form.image}
        type="file"
        onChange={(e) => handleChange(e.target.files[0], "image")}
      />
      <input
        value={form.title}
        type="text"
        onChange={(e) => handleChange(e.target.value, "title")}
      />
      <textarea
        value={form.description}
        name=""
        id=""
        onChange={(e) => handleChange(e.target.value, "description")}
      ></textarea>
      <input
        value={form.price}
        type="number"
        onChange={(e) => handleChange(e.target.value, "price")}
      />

      <button
        onClick={async () => {
          const { image, title, description, price } = form;

          if (!image || !title || !description || !price) {
            return;
          }

          try {
            const ipfsImage = await uploadToIpfs(image);

            debugger;
            // @ts-ignore
            const uri = `https://ipfs.infura.io/ipfs/${ipfsImage.path}`;

            await (await nft.mint(uri)).wait();
            // get tokenId of new nft
            const id = await nft.tokenCount();
            // approve marketplace to spend nft
            await (
              await nft.setApprovalForAll(marketplace.address, true)
            ).wait();
            // add nft to marketplace
            const listingPrice = ethers.utils.parseEther(price.toString());
            await (
              await marketplace.makeItem(nft.address, id, listingPrice)
            ).wait();
          } catch (error) {
            console.error(error);
          }
        }}
      >
        Create
      </button>
    </div>
  );
}

export default Create;
