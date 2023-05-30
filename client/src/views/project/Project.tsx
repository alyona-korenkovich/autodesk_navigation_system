import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import { useNavigate, useParams } from 'react-router-dom';

import {getProject, getUrnProject} from '../../store/selector';
import useFetch from '../../api/hooks/useFetch';
import useManifest from '../../api/hooks/useManifest';

import Viewer from '../../components/Viewer';
import styles from './Project.module.scss';

import {
  datalistSubscriber,
  pathfinderInitials,
  selectionSubscriber,
} from '../../store/subscriberServices';
import PageContainer from '../../components/PageContainer';

import { ETab } from '../../types';

import Button from '../../components/Button';
import { EPath } from '../../const/routes';

const Project = () => {
  const params = useParams();
  const urn = useSelector(getUrnProject) || params?.id;
  const { data } = useFetch('/api/forge/oauth/token');
  const { result } = useManifest(`api/forge/modelderivative/manifest/${urn}`);

  //const [needToShowViewer, setNeedToShowViewer] = useState(false);
  const [viewer, setViewer] = useState(null);

  const [modeIsChosen, setModeIsChosen] = useState(false);
  const [isEmergency, setIsEmergency] = useState(false);

  const [pointA, setPointA] = useState('');
  const [pointB, setPointB] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const lastFocus = useRef(null);

  const [findPath, setFindPath] = useState(false);

  const [options, setOptions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    console.log(urn, data, !viewer);
    if (urn && data && !viewer) {
      setViewer(<Viewer urn={urn} token={data} findPath={findPath} setFindPath={setFindPath} />);
      datalistSubscriber.subscribe((v: string[]) => {
        setOptions(v);
      });
    }

    //setNeedToShowViewer(data && !result.error && result.status == 'success');
  }, [data, //needToShowViewer,
    result, urn, viewer]);

  useEffect(() => {
    console.log('findPath', findPath);
    if (findPath) {
      setViewer(<Viewer urn={urn} token={data} findPath={findPath} setFindPath={setFindPath} />);
    }
  }, [findPath]);

  useEffect(() => {
    selectionSubscriber.subscribe((v) => {
      if (v === 'Model' || !lastFocus.current || !!!v) {
        return;
      }

      lastFocus.current.value = v;

      if (lastFocus.current.name === 'searchPointA') {
        setPointA(v);
      } else {
        setPointB(v);
      }
    });
  }, [lastFocus.current]);

  return (
    <PageContainer title={'Навигация'} activeTab={ETab.NAVIGATION}>
      { //needToShowViewer ? (
        <div className={styles.container}>
          <div className={styles.viewer} data-testid='viewer'>{viewer}</div>
          <div className={styles.controller} data-testid='controller'>
            <h1>Построить путь</h1>
            <div className={styles.forms}>
              <form
                onChange={() => {
                  setModeIsChosen(true);
                }}
              >
                <fieldset>
                  <legend>Выберите режим</legend>
                  <div className={styles.radioOption}>
                    <input
                      type="radio"
                      id="general"
                      name="mode"
                      value="general"
                      onChange={() => {
                        setIsEmergency(false);
                      }}
                    />
                    <label htmlFor="general">Обычный</label>
                  </div>
                  <div className={styles.radioOption}>
                    <input
                      type="radio"
                      id="emergency"
                      name="mode"
                      value="emergency"
                      onChange={() => {
                        setIsEmergency(true);
                      }}
                    />
                    <label htmlFor="emergency">Чрезвычайная ситуация</label>
                  </div>
                </fieldset>
              </form>
              {modeIsChosen && (
                <form
                  className={styles.form_points}
                  onInput={(e) => {
                    setErrors([]);

                    const input = e.target as HTMLInputElement;
                    if (input.name === 'searchPointA') {
                      document.getElementById('searchForPointA').style.border = '1px solid black';
                      setPointA(input.value);
                    } else {
                      document.getElementById('searchForPointB').style.border = '1px solid black';
                      setPointB(input.value);
                    }
                  }}
                >
                  <div className={styles.form_points_legend}>
                    <legend>Выберите начальные условия</legend>
                    <p>
                      Выделите на модели ближайший к Вам объект или введите его имя в поле ниже{' '}
                    </p>
                  </div>

                  <div className="pointA">
                    <input
                      list="objects"
                      type="search"
                      id="searchForPointA"
                      name="searchPointA"
                      placeholder="Откуда? (точка А)"
                      autoFocus={!pointA}
                      required
                      onBlur={(e) => {
                        lastFocus.current = e.target as HTMLInputElement;
                      }}
                    />
                    <datalist id="objects">
                      {options.map((opt, key) => (
                        <option key={key} value={opt} />
                      ))}
                    </datalist>
                  </div>
                  {!isEmergency && (
                    <div className="pointB">
                      <input
                        list="objects"
                        type="search"
                        id="searchForPointB"
                        name="searchPointB"
                        placeholder="Куда? (точка Б)"
                        required
                        autoFocus={!!pointA}
                        onBlur={(e) => {
                          lastFocus.current = e.target as HTMLInputElement;
                        }}
                      />
                    </div>
                  )}
                  <Button
                    classname={styles.startButton}
                    onClick={function formValidation() {
                      setErrors([]);

                      const pointAisValid = options.includes(pointA);
                      if (!pointAisValid) {
                        document.getElementById('searchForPointA').style.border = '1px solid red';
                        document.getElementById('searchForPointA').focus();
                        setErrors((prevState) => [...prevState, 'Выберите корректную точку А']);
                      }

                      if (!isEmergency) {
                        const pointBisValid = options.includes(pointB);
                        if (!pointBisValid) {
                          document.getElementById('searchForPointB').style.border = '1px solid red';
                          document.getElementById('searchForPointB').focus();
                          setErrors((prevState) => [...prevState, 'Выберите корректную точку Б']);
                        } else {
                          if (pointAisValid) {
                            pathfinderInitials.next({
                              start: pointA,
                              end: pointB,
                              mode: 'general',
                            });
                            console.log('BUTTON CLICKED');
                            navigate(`${EPath.Navigation}/${urn}/general/${pointA}/${pointB}`);
                            setFindPath(true);
                          }
                        }
                      } else {
                        if (pointAisValid) {
                          pathfinderInitials.next({ start: pointA, mode: 'emergency' });
                          navigate(`${EPath.Navigation}/${urn}/emergency/${pointA}`);
                          setFindPath(true);
                          console.log('BUTTON CLICKED');
                        }
                      }
                    }}
                    disabled={!((!isEmergency && pointA && pointB) || (isEmergency && pointA))}
                  >
                    Построить путь
                  </Button>
                  {errors &&
                    errors.map((error, key) => (
                      <p className={styles.form_error} key={key}>
                        {error}
                      </p>
                    ))}
                </form>
              )}
            </div>
          </div>
        </div>
      //) : (
      //  <div>
      //    <p>Progress: {result.progress}</p>
      //    <p>Status: {result.status}</p>
      //    {result.error && <p>Error: {result.error} </p>}
      //  </div>
      //)
        }
    </PageContainer>
  );
};

export default Project;
