import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';
import Popover from '@mui/material/Popover';
import MenuList from '@mui/material/MenuList';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export type CreditProps = {
  idcredit: number;
  user: number;
  applicantperson: number;
  managingperson: number;
  debtamount: number;
  state: 1 | 2 | 3;
  faculty: number;
};

type Props = {
  row: CreditProps;
  selected: boolean;
  onSelectRow: () => void;
};

export function CreditoTableRow({ row, selected, onSelectRow }: Props) {
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const renderEstado = (estado: number) => {
    switch (estado) {
      case 1:
        return { text: 'Pendiente', color: 'error' };
      case 2:
        return { text: 'Parcial', color: 'warning' };
      case 3:
        return { text: 'Pagado', color: 'success' };
      default:
        return { text: 'Desconocido', color: 'default' };
    }
  };

  const estado = renderEstado(row.state);

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
        </TableCell>

        <TableCell>{row.idcredit}</TableCell>

        <TableCell>{`#${row.applicantperson}`}</TableCell>

        <TableCell>{`#${row.managingperson}`}</TableCell>

        <TableCell>{`$${row.debtamount.toLocaleString()}`}</TableCell>

        <TableCell align="center">
          <Label color={estado.color}>{estado.text}</Label>
        </TableCell>

        <TableCell>{`#${row.faculty}`}</TableCell>

        <TableCell align="right">
          <IconButton onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <Popover
        open={!!openPopover}
        anchorEl={openPopover}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuList
          disablePadding
          sx={{
            p: 0.5,
            gap: 0.5,
            width: 140,
            display: 'flex',
            flexDirection: 'column',
            [`& .${menuItemClasses.root}`]: {
              px: 1,
              gap: 2,
              borderRadius: 0.75,
              [`&.${menuItemClasses.selected}`]: { bgcolor: 'action.selected' },
            },
          }}
        >
          <MenuItem onClick={handleClosePopover}>
            <Iconify icon="solar:pen-bold" />
            Editar
          </MenuItem>

          <MenuItem onClick={handleClosePopover} sx={{ color: 'error.main' }}>
            <Iconify icon="solar:trash-bin-trash-bold" />
            Eliminar
          </MenuItem>
        </MenuList>
      </Popover>
    </>
  );
}
