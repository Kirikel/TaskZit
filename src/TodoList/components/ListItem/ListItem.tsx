import { ExpandLess, ExpandMore } from '@mui/icons-material';
import {
  ListItemButton,
  ListItemText,
  Collapse,
  List,
  ListItemIcon,
  Checkbox,
} from '@mui/material';
import { memo, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectFirstLayerSubtasks, selectSubtasksByTaskId } from '../../state';
import styled from 'styled-components';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { IconWrapper } from '../UI';
import { Todo } from '../../../models';

const Root = styled.div`
  padding-left: 10px;
`;

interface Props {
  item: Todo;
  checked: number[];
  handleCreateEmptyTask: (parentId?: number) => void;
  setChecked: React.Dispatch<React.SetStateAction<number[]>>;
  setModalTodoId: React.Dispatch<React.SetStateAction<number | null>>;
}

const ListItem = memo((props: Props) => {
  const { item, checked, setChecked, handleCreateEmptyTask, setModalTodoId } =
    props;

  const [expand, setExpand] = useState(false);

  const childTasks = useSelector((state) =>
    selectFirstLayerSubtasks(state, item.id)
  );

  const allChildTasks = useSelector((state) =>
    selectSubtasksByTaskId(state, item.id)
  );

  const toggleExpand = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    setExpand(!expand);
  };

  const handleClick = () => {
    setModalTodoId(item.id);
  };

  const handleOpenModal = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    e.stopPropagation();
    handleCreateEmptyTask(item.id);
  };

  const toggleChecked = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    const requiredIdxValue = checked[item.id] === 0 ? 1 : 0;

    setChecked(
      checked.map((c, idx) => {
        if (idx === item.id || allChildTasks.some((t) => t.id === idx)) {
          return requiredIdxValue;
        } else return c;
      })
    );
  };

  return (
    <Root>
      <ListItemButton onClick={handleClick}>
        <ListItemIcon onClick={(e) => toggleChecked(e)}>
          <Checkbox
            edge='start'
            checked={Boolean(checked[item.id])}
            tabIndex={-1}
            disableRipple
          />
        </ListItemIcon>
        <ListItemText primary={item.title} />

        <div style={{ display: 'flex', width: '50px' }}>
          <IconWrapper>
            <AddCircleOutlineIcon onClick={(e) => handleOpenModal(e)} />
          </IconWrapper>

          {item.subtaskIds?.length > 0 && (
            <IconWrapper onClick={(e) => toggleExpand(e)}>
              {expand ? <ExpandLess /> : <ExpandMore />}
            </IconWrapper>
          )}
        </div>
      </ListItemButton>

      {childTasks.length > 0 && (
        <Collapse in={expand} timeout='auto' unmountOnExit>
          <List component='div' disablePadding>
            {childTasks.map((t) => (
              <ListItem
                item={t}
                key={t.id}
                checked={checked}
                setChecked={setChecked}
                setModalTodoId={setModalTodoId}
                handleCreateEmptyTask={handleCreateEmptyTask}
              />
            ))}
          </List>
        </Collapse>
      )}
    </Root>
  );
});

export { ListItem };
