import React from 'react';
import classNames from 'classnames';

import fileDocIcon from '../../assets/icons/fileDoc.svg';
import videoIcon from '../../assets/icons/video.svg';
import imageIcon from '../../assets/icons/image.svg';

import styles from './File.module.scss';
import { getFormat } from './utils';

const TYPE_ICON = [
  {
    formats: ['jpeg', 'png', 'jpg', 'svg'],
    icon: imageIcon,
  },
  {
    formats: ['txt', 'doc'],
    icon: fileDocIcon,
  },
  {
    formats: ['mov'],
    icon: videoIcon,
  },
];

type TFileProps = {
  name?: string;
  format?: string;
  classname?: string;
};

const File = ({ name, classname }: TFileProps) => {
  const formatFile = getFormat(name);
  const iconSrc = TYPE_ICON.find((item) => item.formats.includes(formatFile))?.icon || fileDocIcon;

  return (
    <div className={classNames(styles.container, classname)}>
      <img src={iconSrc} alt="file" />
      {name}
    </div>
  );
};

export default File;
