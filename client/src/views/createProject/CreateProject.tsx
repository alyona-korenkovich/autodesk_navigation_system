import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import {
  clearErrorsUploadProject,
  initElementsInProject,
  uploadProject,
} from '../../store/actions';
import { getProject, getStatusProject, getUploadError, getUrnProject } from '../../store/selector';

import Input from '../../components/Input';
import Button from '../../components/Button';
import TextField from '../../components/TextField';
import Title from '../../components/Title';

import {
  DOWNLOAD_LABEL_BUTTON,
  INFO_INITIATE_ITEM,
  INIT_ITEMS,
  PROJECT_NAME,
  SUCCESS_MESSAGE,
  TITLE_NAME,
} from './const';
import { EStatusRequest } from '../../store/const';
import { EPath } from '../../const/routes';

import styles from './CreateProject.module.scss';

const CreateProject = () => {
  const [files, setFiles] = useState<FileList>();
  const [nameProject, setNameProject] = useState('');

  const dispatch = useDispatch();

  const error = useSelector(getUploadError);
  const statusProject = useSelector(getStatusProject);
  const urn = useSelector(getUrnProject);
  const { projectId } = useSelector(getProject);

  const navigate = useNavigate();

  const onChange = (target: HTMLInputElement) => {
    dispatch(clearErrorsUploadProject());
    setFiles(target.files);
  };

  const onClick = async () => {
    dispatch(uploadProject({ nameProject, files }) as any);
  };

  const onInitItems = async () => {
    dispatch(initElementsInProject({ urn, projectId }) as any);
  };

  const handleChangeProject = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(clearErrorsUploadProject());
    setNameProject(target?.value);
  };

  const displayStatus = () => {
    switch (statusProject) {
      case EStatusRequest.LOADING: {
        return <span>loading...</span>;
      }
      case EStatusRequest.SUCCESS: {
        return <span className={styles.successMessage}>{INFO_INITIATE_ITEM}</span>;
      }
      case EStatusRequest.SUCCESS_INIT: {
        setTimeout(() => {
          navigate(`${EPath.Project}/${urn}`);
        }, 5000);
        return <span className={styles.successMessage}>{SUCCESS_MESSAGE}</span>;
      }
      default:
        return null;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <div className={styles.form}>
          <Title text={TITLE_NAME} />
          <TextField
            classNameContainer={styles.projectName}
            onChange={handleChangeProject}
            label={PROJECT_NAME}
          />
          <Input type="file" onChange={onChange} multiple />
          <Button onClick={onClick} classname={styles.buttonContainer}>
            {DOWNLOAD_LABEL_BUTTON}
          </Button>
          {error && <span className={styles.error}>{error}</span>}
          {urn && (
            <Button
              onClick={onInitItems}
              classname={styles.buttonInit}
              disabled={statusProject === EStatusRequest.LOADING}
            >
              {INIT_ITEMS}
            </Button>
          )}
          {displayStatus()}
        </div>
      </div>
    </div>
  );
};

export default CreateProject;
