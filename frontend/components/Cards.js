import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector} from 'react-redux';
import { getUserCards } from '../redux/action';
import { View,  Text } from 'react-native';
import CreditCardDisplay from 'react-native-credit-card-display';
import Carousel from 'react-native-snap-carousel';

const Cards = () => {
  const dispatch = useDispatch();

  const cards = useSelector(state => state.card);

  useEffect(() => { 
    dispatch(getUserCards());
  }, [cards]);

  const [activeSlide, setActiveSlide] = useState(0);

  const handleSnapToItem = index => {
    setActiveSlide(index);
  };

  return (
    <View>
    <Carousel
      data={cards.card}
      renderItem={({ item }) => (
        <View>
          <CreditCardDisplay
            number={item.number}
            cvc={item.cvc}
            expiration={item.expiry}
            name={item.cardholder}
          />
        </View>
      )}
      sliderWidth={400}
      itemWidth={300}
      layout="default"
      onSnapToItem={handleSnapToItem}
    />
    <View>
        {/* <Text>Active slide: {activeSlide}</Text>
        <Text>Number: {cards.card[activeSlide]?.number}</Text>
        <Text>CVC: {cards.card[activeSlide]?.cvc}</Text>
        <Text>Expiration: {cards.card[activeSlide]?.expiry}</Text>
        <Text>Cardholder: {cards.card[activeSlide]?.cardholder}</Text> */}
      </View>
    </View>
  );
};

export default Cards;
