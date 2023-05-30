import { createAction, createAsyncThunk } from '@reduxjs/toolkit';
import { APIFetch } from '../api/utils/APIFetch/APIFetch';
import { E_HTTP_METHODS } from '../types';
import { ETypeBody } from '../api/const';
import { views } from '../const/views';

type TUploadProject = {
  nameProject: string;
  files: FileList;
};

export const uploadProject = createAsyncThunk(
  views.createProject,
  async ({ nameProject, files }: TUploadProject, { rejectWithValue }) => {
    try {
      const resBucket = await APIFetch(
        '/api/forge/oss/buckets',
        E_HTTP_METHODS.POST,
        {},
        {
          body: {
            bucketKey: nameProject,
          },
        },
      );
      const bucketKey = resBucket?.bucketKey;
      if (bucketKey) {
        const formData = new FormData();
        formData.append('fileToUpload', files[0]);
        formData.append('bucketKey', bucketKey);
        const objectRes = await APIFetch(
          '/api/forge/oss/objects',
          E_HTTP_METHODS.POST,
          {},
          { body: formData },
          ETypeBody.File,
        );
        const urn = objectRes?.urn;
        if (urn) {
          const project = await APIFetch(
            '/api/project/create',
            E_HTTP_METHODS.POST,
            {},
            {
              body: {
                name: nameProject,
                urn,
                bucket_key: bucketKey,
                version: 1,
                date: new Date(),
              },
            },
          );
          return {
            bucketKey,
            urn,
            projectId: project._id,
          };
        }
      }
    } catch (e) {
      throw rejectWithValue(e);
    }
  },
);

export const clearErrorsUploadProject = createAction(
  `${views.createProject}/CLEAR_ERRORS_UPLOAD_PROJECT`,
);

export const initElementsInProject = createAsyncThunk(
  `${views.createProject}/init`,
  async ({ urn, projectId }: { urn: string; projectId: string }, { rejectWithValue }) => {
    try {
      await APIFetch(
        `/api/items/init`,
        E_HTTP_METHODS.POST,
        {},
        {
          body: {
            urn,
            projectId,
          },
        },
      );
    } catch (e) {
      throw rejectWithValue(e);
    }
  },
);
