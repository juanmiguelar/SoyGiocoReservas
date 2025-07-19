import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Menu,
  MenuItem,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Typography,
  Collapse,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import MoreVertIcon from '@mui/icons-material/MoreVert';

export interface AttendanceRecord {
  id: number;
  clientName: string;
  workshopName: string;
  date?: string;
  notes?: string;
  [key: string]: any;
}

const initialRecords: AttendanceRecord[] = [
  {
    id: 1,
    clientName: 'John Doe',
    workshopName: 'React Basics',
    date: '2024-04-01',
    notes: 'Completed project',
  },
  {
    id: 2,
    clientName: 'Jane Smith',
    workshopName: 'Advanced Vue',
    date: '2024-04-05',
    notes: 'Needs follow up',
  },
];

const AttendanceTable: React.FC = () => {
  const [records, setRecords] = useState<AttendanceRecord[]>(initialRecords);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const handleExpand = (id: number) => {
    setExpanded(expanded === id ? null : id);
  };

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLButtonElement>,
    id: number
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedId(id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedId(null);
  };

  const handleDelete = () => {
    if (selectedId !== null) {
      setRecords(records.filter((r) => r.id !== selectedId));
    }
    handleMenuClose();
  };

  return (
    <TableContainer component={Paper} sx={{ width: '100%', overflowX: 'auto' }}>
      <Table size="small" aria-label="attendance table">
        <TableHead>
          <TableRow>
            <TableCell>Client</TableCell>
            <TableCell>Workshop</TableCell>
            <TableCell align="right"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {records.map((record) => (
            <React.Fragment key={record.id}>
              <TableRow>
                <TableCell>{record.clientName}</TableCell>
                <TableCell>{record.workshopName}</TableCell>
                <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                  <IconButton
                    aria-label="view details"
                    size="small"
                    onClick={() => handleExpand(record.id)}
                  >
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton
                    aria-label="options"
                    size="small"
                    onClick={(e) => handleMenuOpen(e, record.id)}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={3}>
                  <Collapse in={expanded === record.id} timeout="auto" unmountOnExit>
                    <Accordion
                      elevation={0}
                      expanded={expanded === record.id}
                      sx={{
                        p: 0,
                        '&:before': { display: 'none' },
                      }}
                    >
                      <AccordionSummary
                        sx={{ display: 'none' }}
                      />
                      <AccordionDetails>
                        <Box sx={{ display: 'flex', flexDirection: 'column', rowGap: 0.5 }}>
                          {Object.entries(record).map(([key, value]) => {
                            if (key === 'id' || key === 'clientName' || key === 'workshopName') {
                              return null;
                            }
                            return (
                              <Typography variant="body2" key={key}>
                                <strong>{key}:</strong> {String(value)}
                              </Typography>
                            );
                          })}
                        </Box>
                      </AccordionDetails>
                    </Accordion>
                  </Collapse>
                </TableCell>
              </TableRow>
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleDelete}>Delete</MenuItem>
      </Menu>
    </TableContainer>
  );
};

export default AttendanceTable;

