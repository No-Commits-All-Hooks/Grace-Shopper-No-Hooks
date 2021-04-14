import React from "react";
import Carousel from "react-material-ui-carousel";
import { Paper, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  img: {
    height: 600,
  },
  container: {
    textAlign: "center",
  },
}));

export default function Hompage(props) {
  const classes = useStyles();

  let photots = [
    {
      name: "FSC Promo Logo",
      imgSrc: "https://miro.medium.com/max/1000/1*i0rG0owbE0lDeD0dsIaw4Q.jpeg",
    },
    {
        name: "Random Name #2",
        imgSrc: "/computer.png",
    },
  ];

  return (
    <Carousel className={classes.container}>
      {photots.map((photo, i) => (
        <img key={i} className={classes.img} src={photo.imgSrc} />
      ))}
    </Carousel>
  );
}
