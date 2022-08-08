import { useState, useEffect } from "react";

import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

function List({ marketplace, nft }) {
  const [items, setItems] = useState([]);
  const loadMarketplaceItems = async () => {
    // Load all unsold items
    const itemCount = await marketplace.itemCount();

    let items = [];

    console.log(items);

    for (let i = 1; i <= itemCount; i++) {
      const item = await marketplace.items(i);
      if (!item.sold) {
        // get uri url from nft contract

        try {
          const uri = await nft.tokenURI(item.tokenId);
          // use uri to fetch the nft metadata stored on ipfs
          const response = await fetch(uri);
          console.log(response);

          debugger;
          const metadata = await response.json();
          // get total price of item (item price + fee)

          // const metadata = {
          //   name: "123",
          //   description: "123",
          //   image: "",
          // };
          const totalPrice = await marketplace.getTotalPrice(item.itemId);
          // Add item to items array
          items.push({
            totalPrice,
            itemId: item.itemId,
            seller: item.seller,
            name: metadata.name,
            description: metadata.description,
            image: metadata.image,
          });
        } catch (error) {
          console.log(error);
        }
      }
    }
    //   setLoading(false)
    setItems(items);
  };

  useEffect(() => {
    loadMarketplaceItems();
  }, []);

  return (
    <div>
      {items.map(({ description, name, image }) => {
        return (
          <Card sx={{ maxWidth: 345 }}>
            <CardMedia
              component="img"
              height="140"
              image={image}
              alt="green iguana"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {description}
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small">Buy</Button>
            </CardActions>
          </Card>
        );
      })}
    </div>
  );
}

export default List;
