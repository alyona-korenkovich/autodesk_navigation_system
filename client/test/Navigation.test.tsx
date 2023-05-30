import React from 'react';
import '@testing-library/jest-dom';
import {fireEvent, render} from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import Navigation from '../src/views/navigation/Navigation';

const mockStore = configureStore([]);

describe('Render navigation page', () => {
    let getByTextOuter: any,
        getByLabelTextOuter: any,
        getAllByTextOuter: any,
        getByTestIdOuter: any,
        queryByRoleOuter: any,
        queryByTextOuter: any,
        queryByPlaceholderTextOuter: any;
    const setState = jest.fn();

    beforeEach(() => {
        const store = mockStore({
            userName: '',
            userEmail: '',
            id: '',
            role: '',
            token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2MzQ2OTQzODFmZTQ1MDFkNDg1N2Y0ZjgiLCJlbWFpbCI6ImFseW9uYS5rb3JlbmtvdmljaEBiYW0uaW0iLCJpYXQiOjE2ODI5NjIyMDh9.HonsYwHRpbaGFDdxpmhNmkuKC3MMbCuO3FE-Wxlbq4c',
            isAuth: true,
            errorsRegisterValidation: null,
            project: {
                bucketKey: '',
                projectId: '',
                uploadError: '',
                status: 'success',
                urn: 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6emJnY2NhbHZicWdieXVqd21ia2tpZ2JyamFlcWc0eWYtYWR2YW5jZWRwcm9qZWN0bWFzdGVydmlld3MvcmFjYWR2YW5jZWRzYW1wbGVwcm9qZWN0LnJ2dA==',
            },
            errorsLoginValidation: null,
        });

        jest
            .spyOn(React, 'useState')
            .mockImplementationOnce(() => [true, setState]);

        const {
            getByText,
            getByLabelText,
            getAllByText,
            getByTestId,
            queryByRole,
            queryByText,
            queryByPlaceholderText,
        } = render(
            <BrowserRouter>
                <Provider store={store}>
                    <Navigation />
                </Provider>
            </BrowserRouter>
        );

        [
            getByTextOuter,
            getByLabelTextOuter,
            getAllByTextOuter,
            getByTestIdOuter,
            queryByPlaceholderTextOuter,
            queryByRoleOuter,
            queryByTextOuter,
        ] = [
            getByText,
            getByLabelText,
            getAllByText,
            getByTestId,
            queryByPlaceholderText,
            queryByRole,
            queryByText,
        ];
    });

    it('renders correctly', () => {
        expect(getAllByTextOuter('Навигация').length).toBe(2);
        expect(getByTextOuter('Доступные маршруты')).toBeInTheDocument();
        expect(getByTextOuter('Изменить маршрут')).toBeInTheDocument();
        expect(getByTestIdOuter('viewer')).toBeInTheDocument();
        expect(getByTestIdOuter('controller')).toBeInTheDocument();
    });

    it('should list available paths within controller', () => {
        const fakePaths = [{ path: [[25, 75, -16], [73, 63, -16]], length: 72.34 }, { path: [[25, 75, -16], [95, 8, -16]], length: 116.95 }];
        // Мокаем доступные маршруты
        jest
            .spyOn(React, 'useState')
            .mockImplementationOnce(() => [fakePaths, setState]);

        expect(getAllByTextOuter('Маршрут #').length).toBe(2);
    });

    it('should navigate away when clicking "Изменить маршрут"', () => {
        const button = queryByRoleOuter('button', { name: /изменить маршрут/i});
        fireEvent.click(button);

        expect(window.history.length).toBeGreaterThan(1);
    })
});