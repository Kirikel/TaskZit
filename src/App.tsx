import { TodoList } from './TodoList';
import styled from 'styled-components';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectTasks } from './TodoList/state';

const Root = styled.div`
  height: 100%;
  width: 100%;

  display: flex;
  justify-content: center;

  padding: 20px;
`;

function App() {
  const listState = useSelector(selectTasks);

  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.setItem(
        'todo-spectrum-exit-data',
        JSON.stringify(listState.entities)
      );
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [listState]);

  return (
    <Root>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <TodoList />
      </LocalizationProvider>
    </Root>
  );
}

export default App;
