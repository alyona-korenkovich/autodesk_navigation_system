import React, { useEffect, useState } from 'react';
import Viewer from '../../components/Viewer';
import { useSelector } from 'react-redux';

import { getUrnProject } from '../../store/selector';
import useFetch from '../../api/hooks/useFetch';
import useManifest from '../../api/hooks/useManifest';

import { useNavigate, useParams } from 'react-router-dom';
import { ETab } from '../../types';
import styles from '../navigation/Navigation.module.scss';

import PageContainer from '../../components/PageContainer';

import Button from '../../components/Button';
import { EPath } from '../../const/routes';

import {
  pathfinderInitials,
  pathsSubscriber,
  visualizePathIndex,
} from '../../store/subscriberServices';
import { TPath } from '../../components/Viewer/path-finder/types';

const Navigation = () => {
  const params = useParams();
  let end: string;

  const start = params?.pointA;
  const mode = params?.mode;
  if (mode === 'general') {
    end = params?.pointB;
  }

  const urn = useSelector(getUrnProject) || params?.id;
  //const [needToShowViewer, setNeedToShowViewer] = useState(false);
  const { data } = useFetch('/api/forge/oauth/token');
  const { result } = useManifest(`api/forge/modelderivative/manifest/${urn}`);
  const [paths, setPaths] = useState([]);
  const [viewer, setViewer] = useState(null);
  const [activePath, setActivePath] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    visualizePathIndex.next(activePath);
  }, [activePath]);

  useEffect(() => {
    pathfinderInitials.next({
      start: start,
      end: end,
      mode: mode,
    });
    console.log(start, mode, end);
  }, [params]);

  useEffect(() => {
    pathsSubscriber.subscribe((v: TPath[]) => {
      console.log(v);

      if (v) {
        setPaths(v);
      }
    });
  });

  useEffect(() => {
    if (urn && data && !viewer) {
      setViewer(<Viewer urn={urn} token={data} findPath={true} setFindPath={() => {}} />);
    }
    //setNeedToShowViewer(data && !result.error && result.status == 'success');
  }, [data, //needToShowViewer,
  result, urn, viewer]);

  return (
    <PageContainer title={'Навигация'} activeTab={ETab.NAVIGATION}>
      {//needToShowViewer ? (
        <div className={styles.container}>
          <div className={styles.viewer} data-testid='viewer'>{viewer}</div>
          <div className={styles.info} data-testid='controller'>
            <h2>Доступные маршруты</h2>
            <div className={styles.paths}>
              {paths.map((path: TPath, index) => (
                <div
                  className={styles.path}
                  style={activePath == index ? { border: '1px solid black' } : { border: 'none' }}
                  onClick={() => {
                    setActivePath(index);
                  }}
                >
                  <h3>Маршрут #{index + 1}</h3>
                  <p>Длина: {path.length}</p>
                </div>
              ))}
            </div>
            <Button
              onClick={() => {
                navigate(`${EPath.Project}/${urn}`);
              }}
            >
              {' '}
              Изменить маршрут
            </Button>
          </div>
        </div>
      /*) : (
        <div>
          <p>Progress: {result.progress}</p>
          <p>Status: {result.status}</p>
          {result.error && <p>Error: {result.error} </p>}
        </div>
      )*/}
    </PageContainer>
  );
};

export default Navigation;
