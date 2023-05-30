import React from 'react';
import classNames from 'classnames';

import { EPath } from '../../const/routes';
import { ETab } from '../../types';
import digitalAssetIcon from '../../assets/icons/digitalAsset.svg';
import documentIcon from '../../assets/icons/document.svg';
import exploitationIcon from '../../assets/icons/exploitation.svg';
import logo from '../../assets/images/logo-white.svg';
import navigationIcon from '../../assets/icons/navigation.svg';
import spaceIcon from '../../assets/icons/space.svg';
import styles from './Menu.module.scss';
import taskIcon from '../../assets/icons/task.svg';

const TABS = [
  {
    name: ETab.TASKS,
    icon: taskIcon,
    link: EPath.Project,
  },
  {
    name: ETab.DIGITAL_ASSET,
    icon: digitalAssetIcon,
    link: EPath.Project,
  },
  {
    name: ETab.SPACE,
    icon: spaceIcon,
    link: EPath.Project,
  },
  {
    name: ETab.DOCUMENTS,
    icon: documentIcon,
    link: EPath.Project,
  },
  {
    name: ETab.UTILITIES,
    icon: documentIcon,
    link: EPath.Project,
  },
  {
    name: ETab.EXPLOITATION,
    icon: exploitationIcon,
    link: EPath.Project,
  },
  {
    name: ETab.NAVIGATION,
    icon: navigationIcon,
    link: EPath.Project,
  },
];

type TMenuProps = {
  activeTab: ETab;
};

const Menu = ({ activeTab }: TMenuProps) => {
  return (
    <div className={styles.menu}>
      <a href={EPath.Main}>
        <img src={logo} alt="logo" className={styles.logo} />
      </a>
      {TABS.map((item) => (
        <a
          key={item.name}
          className={classNames(styles.menuItem, {
            [styles.menuItemActive]: item.name === activeTab,
          })}
          href={item.link}
        >
          <img src={item.icon} alt="icon" />
          {item.name}
        </a>
      ))}
    </div>
  );
};

export default Menu;
