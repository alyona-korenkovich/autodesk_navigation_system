import React from 'react';
import { useNavigate } from 'react-router-dom';

import ArrowIcon from '../../assets/icons/Arrow.svg';

import Title from '../Title';

import styles from './TitleWithBack.module.scss';

type TBackProps = {
  title: string;
};

const TitleWithBack = ({ title }: TBackProps) => {
  const navigate = useNavigate();

  return (
    <div className={styles.back}>
      <img src={ArrowIcon} onClick={() => navigate(-1)} alt="back" />
      <Title text={title} />
    </div>
  );
};

export default TitleWithBack;
