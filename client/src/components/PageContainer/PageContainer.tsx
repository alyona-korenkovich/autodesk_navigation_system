import React, { ReactElement } from 'react';

import Menu from '../Menu';

import { ETab } from '../../types';
import TitleWithBack from '../TitleWithBack';

import styles from './PageContainer.module.scss';

type TPageContainerProps = {
  children: ReactElement;
  title?: string;
  activeTab?: ETab;
};

const PageContainer = ({ title, children, activeTab }: TPageContainerProps) => {
  return (
    <div className={styles.container}>
      <Menu activeTab={activeTab} />
      <div className={styles.main}>
        <div className={styles.titleContainer}>{title && <TitleWithBack title={title} />}</div>
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
};

export default PageContainer;
