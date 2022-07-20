import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { desktop } from '../responsive';
import poubelle from '../assets/poubelle.png';
import search from '../assets/search.png';
import heartVide from '../assets/coeurVide.png';
import edit from '../assets/edit.png';
import heart from '../assets/coeur.png';
import { useApp } from '../context/AppProvider';

const Container = styled.div``;

const ContainerExercice = styled.div`
  background-color: white;
  padding: 1rem;
  margin: 1rem;
  border-radius: 2rem;
  ${desktop({ margin: '2rem' })}
`;

const Title = styled.h3`
  text-align: center;
  padding: 0.5rem;
  font-size: 1rem;
`;

const Time = styled.p`
  text-align: center;
  padding: 0.5rem;
`;

const Image = styled.img`
  width: 16rem;
  height: 10rem;
  ${desktop({ width: '20rem', height: '15rem' })}
`;

const IconContainer = styled.div`
  display: flex;
  justify-content: space-evenly;
`;

const Icon = styled.img`
  width: 2rem;
  cursor: pointer;
`;

const Exercice = ({ item, getExercices }) => {
  const navigator = useNavigate();
  const { coach, setCoach, favoritesExercicesList } = useApp();

  const onSearch = () => {
    navigator(`/exercices/${item._id}`);
  };

  const onEdit = () => {
    navigator(`/exercices/${item._id}/modifie`);
  };

  const handleReset = async (_id) => {
    await axios.delete(`${process.env.REACT_APP_API_URL}/api/exercice/${_id}`, [
      _id,
    ]);
    getExercices();
  };

  useEffect(() => {
    getExercices();
    console.log('favoritesExercicesList', favoritesExercicesList);
  }, []);

  const getCoachData = async () => {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/api/coach/${coach._id}`
    );
    setCoach(res.data);
  };

  const handleAddFavorite = async (itemId) => {
    console.log('favoritesExercicesList', favoritesExercicesList);
    try {
      await axios
        .post(
          `${process.env.REACT_APP_API_URL}/api/coach/favoritesExercices/${coach._id}`,
          {
            newFavoriteExId: itemId,
          }
        )
        .then(() => {
          getCoachData();
          favoritesExercicesList.push(itemId);
          localStorage.setItem(
            'favoritesExercicesList',
            JSON.stringify(favoritesExercicesList)
          );
          alert(`New Favorites Exercices added`);
        });
    } catch (err) {
      console.log(err);
    }
  };

  function onRemoveFavorites(itemId) {
    const getsetfavoritesExercicesList = localStorage.getItem('coach');
    const coachFavorites = getsetfavoritesExercicesList
      ? JSON.parse(getsetfavoritesExercicesList)
      : {};
    let index = coachFavorites.favorites.indexOf(itemId);
    coachFavorites.favorites.slice(index, 1);

    localStorage.setItem('coach', JSON.stringify(coachFavorites));
    alert(`exercices delete`);
  }

  return (
    <Container>
      <ContainerExercice>
        <Image src={item.img} />
        <Title> {item.name}</Title>
        <Time>Temps de l'exercice : {item.time} min</Time>
        <IconContainer>
          <Icon src={search} onClick={onSearch} />
          <Icon src={edit} onClick={onEdit} />
          {favoritesExercicesList?.includes(item._id) && (
            <Icon
              src={heart}
              onClick={(e) => {
                onRemoveFavorites(item._id);
                e.stopPropagation();
              }}
            />
          )}
          {!favoritesExercicesList?.includes(item._id) && (
            <Icon
              src={heartVide}
              onClick={(e) => {
                handleAddFavorite(item._id);
                e.stopPropagation();
              }}
            />
          )}
          <Icon src={poubelle} onClick={() => handleReset(item._id)} />
        </IconContainer>
      </ContainerExercice>
    </Container>
  );
};

export default Exercice;
