import React from 'react';
import '@testing-library/jest-dom';
import {fireEvent, render} from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import Project from '../src/views/project/Project';

const mockStore = configureStore([]);

describe('Render project page', () => {
    let getByTextOuter: any,
        getByLabelTextOuter: any,
        getAllByTextOuter: any,
        getByTestIdOuter: any,
        queryByRoleOuter: any,
        queryByTextOuter: any,
        queryByPlaceholderTextOuter: any;
    let generalRadio: any,
        emergencyRadio: any;
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
                    <Project />
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

    it('renders correctly', async () => {
        expect(getAllByTextOuter('Навигация').length).toBe(2);
        expect(getByTextOuter('Построить путь')).toBeInTheDocument();
        expect(getByTestIdOuter('viewer')).toBeInTheDocument();
        expect(getByTestIdOuter('controller')).toBeInTheDocument();

        generalRadio = getByLabelTextOuter('Обычный');
        emergencyRadio = getByLabelTextOuter('Чрезвычайная ситуация');

        expect(generalRadio).toBeInTheDocument();
        expect(emergencyRadio).toBeInTheDocument();
    });

    it('should correctly respond to user actions', () => {
        generalRadio = getByLabelTextOuter('Обычный');
        emergencyRadio = getByLabelTextOuter('Чрезвычайная ситуация');

        expect(generalRadio).toBeInTheDocument();
        expect(emergencyRadio).toBeInTheDocument();

        let fromInput = queryByPlaceholderTextOuter('Откуда? (точка А)');
        let toInput = queryByPlaceholderTextOuter('Куда? (точка B)');
        let findPathButton = queryByRoleOuter('button', { name: /построить путь/i});

        // До выбора режима нельзя ввести элементы и построить путь
        expect(fromInput).toBeNull();
        expect(toInput).toBeNull();
        expect(findPathButton).toBeNull();

        fireEvent.click(generalRadio);
        expect(generalRadio).toBeChecked();

        // Теперь доступно заполнение двух полей, кнопка "построить путь" есть, но некликабельна
        expect(getByTextOuter('Выберите начальные условия')).toBeInTheDocument();
        expect(getByTextOuter('Выделите на модели ближайший к Вам объект или введите его имя в поле ниже')).toBeInTheDocument();

        fromInput = queryByPlaceholderTextOuter('Откуда? (точка А)');
        toInput = queryByPlaceholderTextOuter('Куда? (точка Б)');
        findPathButton = queryByRoleOuter('button', { name: /построить путь/i});

        expect(fromInput).toBeInTheDocument();
        expect(toInput).toBeInTheDocument();
        expect(findPathButton).toBeInTheDocument();
        expect(findPathButton).toHaveAttribute('disabled');

        // Заполняем поля и проверяем их заполнение
        fireEvent.change(fromInput, { target: { value: 'testPointA' } });
        expect(fromInput).toHaveValue('testPointA');
        fireEvent.change(toInput, { target: { value: 'testPointB' } });
        expect(toInput).toHaveValue('testPointB');

        // Мокаем доступные опции
        jest
            .spyOn(React, 'useState')
            .mockImplementationOnce(() => [['testPointA', 'testPointB'], setState]);

        // Теперь кнопка должна быть активна
        expect(findPathButton).toHaveAttribute('disabled', '');

        /* То же, но для режима ЧС */
        fireEvent.click(emergencyRadio);
        expect(emergencyRadio).toBeChecked();

        // Теперь доступно заполнение двух полей, кнопка "построить путь" есть, но некликабельна
        expect(getByTextOuter('Выберите начальные условия')).toBeInTheDocument();
        expect(getByTextOuter('Выделите на модели ближайший к Вам объект или введите его имя в поле ниже')).toBeInTheDocument();

        fromInput = queryByPlaceholderTextOuter('Откуда? (точка А)');
        toInput = queryByPlaceholderTextOuter('Куда? (точка Б)');
        findPathButton = queryByRoleOuter('button', { name: /построить путь/i});

        // В режиме моделирования ЧС нет точки Б
        expect(fromInput).toBeInTheDocument();
        expect(toInput).toBeNull();
        expect(findPathButton).toBeInTheDocument();
        expect(findPathButton).toHaveAttribute('disabled');

        // Заполняем поля и проверяем их заполнение
        fireEvent.change(fromInput, { target: { value: 'testPointA' } });
        expect(fromInput).toHaveValue('testPointA');

        // Мокаем доступные опции
        jest
            .spyOn(React, 'useState')
            .mockImplementationOnce(() => [['testPointA'], setState]);

        // Теперь кнопка должна быть активна
        expect(findPathButton).toHaveAttribute('disabled', '');
    })
});
