import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useGetOffers } from 'src/api/user';
// ----------------------------------------------------------------------
export default function TourItem() {
  const { data } = useGetOffers();
  
  return (
    <>
      {data.map((info, i) => (
        <Card key={i} sx={{ maxWidth: 345 }}>
          <CardMedia
            sx={{ height: 140 }}
            image="/static/images/cards/contemplative-reptile.jpg"
            title="offer img"
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {info.Offer_name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {info.Offer_price}
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small">Share</Button>
            <Button size="small">Learn More</Button>
          </CardActions>
        </Card>
      ))}
    </>
  );
}

