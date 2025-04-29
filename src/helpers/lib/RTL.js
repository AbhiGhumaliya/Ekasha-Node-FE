import React from 'react';
import { createMemoryHistory } from 'history';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { fireEvent, render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { TimeFilContext, IdelTimerContext } from '../../modules/containers/TimeFilterContext';
import { mockStore } from '../../setupTests';

export const getById = (id) => document.querySelector(`#${id}`);

export const selectOption = (id, option, index = 0) => {
  fireEvent.mouseDown(getById(id));
  const options = screen.getAllByText(option);
  fireEvent.click(options[index]);
};

export const renderComponent = (
  Component,
  props = {},
  initialState = {},
  contextValue = {},
  appContextValue = {},
) => {
  const store = mockStore(initialState);
  const history = createMemoryHistory();

  const component = render(
    <DndProvider backend={HTML5Backend}>
      <Router>
        <Provider store={store}>
          <IdelTimerContext.Provider value={appContextValue}>
            <TimeFilContext.Provider value={contextValue}>
              <Component {...props} history={history} />
            </TimeFilContext.Provider>
          </IdelTimerContext.Provider>
        </Provider>
      </Router>
      ,
    </DndProvider>,
  );
  return component;
};
