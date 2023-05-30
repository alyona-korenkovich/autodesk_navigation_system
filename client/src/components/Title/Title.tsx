import React from 'react';

import styles from './Title.module.scss';

type TTitle = {
  text: string;
};

const Title = ({ text }: TTitle) => {
  return (
    <div className={styles.textContainer}>
      <span>{text}</span>
    </div>
  );
};

export default Title;
