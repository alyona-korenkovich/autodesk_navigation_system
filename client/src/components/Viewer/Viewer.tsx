import React from 'react';

import type { FC } from 'react';

import { VIEWER_ID } from './const';
import ViewerModel from './model/ViewerModel';

import { TTokenForge } from '../../types';
import useMetadata from '../../api/hooks/useManifest/useMetadata';

type TViewerProps = {
  urn: string;
  token: TTokenForge;
  findPath: boolean;
  setFindPath: React.Dispatch<React.SetStateAction<boolean>>;
};

const Viewer = ({ urn, token, findPath }: TViewerProps) => {
  let viewer: ViewerModel;
  const documentId = 'urn:' + urn;
  viewer = new ViewerModel();

  const metadata = useMetadata(`api/forge/modelderivative/metadata/${urn}`);
  viewer.searchForMasterView(metadata);
  viewer.launchViewer(VIEWER_ID, documentId, token, findPath);

  return <div id={VIEWER_ID} />;
};

export default Viewer;
