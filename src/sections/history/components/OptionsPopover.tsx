import { 
  Popover, 
  MenuList, 
  MenuItem,
  ListItemIcon,
  ListItemText 
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Credit } from '../../../types/credit';

interface OptionsPopoverProps {
  anchorEl: HTMLButtonElement | null;
  credit: Credit | null;
  onClose: () => void;
  onEditClick: (credit: Credit) => void;
  onDeleteClick: (credit: Credit) => void;  // Modificamos para recibir el crédito
}

export const OptionsPopover = ({
  anchorEl,
  credit,
  onClose,
  onEditClick,
  onDeleteClick
}: OptionsPopoverProps) => {
  const hasBill = credit?.bill !== null;

  const handleDeleteClick = () => {
    if (credit && !hasBill) {
      console.log('OptionsPopover - Enviando crédito a eliminar:', credit);
      onDeleteClick(credit);
    }
  };

  return (
    <Popover
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
    >
      <MenuList>
        <MenuItem 
          onClick={() => credit && onEditClick(credit)}
          sx={{ 
            color: 'primary.main',
            '&:hover': {
              backgroundColor: 'primary.lighter',
            }
          }}
        >
          <ListItemIcon>
            <EditIcon fontSize="small" color="primary" />
          </ListItemIcon>
          <ListItemText>Editar</ListItemText>
        </MenuItem>
        
        <MenuItem 
          onClick={handleDeleteClick}
          disabled={hasBill}
          sx={{ 
            color: hasBill ? 'text.disabled' : 'error.main',
            '&:hover': {
              backgroundColor: hasBill ? 'inherit' : 'error.lighter',
            }
          }}
        >
          <ListItemIcon>
            <DeleteIcon 
              fontSize="small" 
              sx={{ color: hasBill ? 'text.disabled' : 'error.main' }} 
            />
          </ListItemIcon>
          <ListItemText>
            {hasBill ? 'No se puede eliminar' : 'Eliminar'}
          </ListItemText>
        </MenuItem>
      </MenuList>
    </Popover>
  );
};