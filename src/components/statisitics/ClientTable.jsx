import { useEffect, useState } from "react";
import dayjs from "dayjs";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
  TablePagination,
  Skeleton,
} from "@mui/material";
import * as XLSX from "xlsx";
import { fetchTopClients } from "../../services/client";

export default function ClientTable({ onRowClick, timeRange }) {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const rowsPerPage = 5;

  const getTimeOptions = () => {
    const now = dayjs();
    switch (timeRange) {
      case "year":
        return { timeValue: now.subtract(1, "year").format("YYYY") };
      case "month":
        return { timeValue: now.subtract(1, "month").format("YYYY-MM") };
      case "week":
        return { timeValue: now.subtract(7, "day").format("YYYY-MM-DD") };
      default:
        return { timeValue: null };
    }
  };

  const { timeValue } = getTimeOptions();

  useEffect(() => {
    setLoading(true);
    fetchTopClients({ time_value: timeValue, limit: 40 })
      .then((data) => {
        const list = data.details || [];
        setClients(list);
        setLoading(false);
        if (list.length > 0) {
          setSelectedUserId(list[0].user_id);
          onRowClick?.(list[0].user_id);
        }
      })
      .catch(() => setLoading(false));
  }, [timeValue]);

  const paginatedClients = clients.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleChangePage = (_, newPage) => setPage(newPage);

  const handleExportExcel = () => {
    const wb = XLSX.utils.book_new();
    const data = [
      ["ID", "Name", "Email", "Revenue (DZD)"],
      ...clients.map((c) => [c.user_id, c.name, c.email, c.revenue || 0]),
    ];
    const ws = XLSX.utils.aoa_to_sheet(data);
    ws["!cols"] = [{ width: 10 }, { width: 25 }, { width: 30 }, { width: 15 }];
    XLSX.utils.book_append_sheet(wb, ws, "Top Clients");
    XLSX.writeFile(wb, `top-clients-${dayjs().format("YYYY-MM-DD")}.xlsx`);
  };

  return (
    <Box padding="10px">
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button
          variant="outlined"
          onClick={handleExportExcel}
          sx={{
            color: "var(--primary)",
            borderColor: "var(--primary)",
            "&:hover": {
              backgroundColor: "var(--primary)",
              color: "white",
            },
          }}
        >
          Export Excel
        </Button>
      </Box>

      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          border: "1px solid var(--primary)",
          backgroundColor: "var(--primBg)",
          color: "var(--textMain)",
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "var(--lightBlue)" }}>
              <TableCell sx={{ color: "var(--textMain)", fontWeight: 600 }}>
                Name
              </TableCell>
              <TableCell sx={{ color: "var(--textMain)", fontWeight: 600 }}>
                Email
              </TableCell>
              <TableCell sx={{ color: "var(--textMain)", fontWeight: 600 }}>
                Revenue
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading
              ? Array.from({ length: rowsPerPage }).map((_, idx) => (
                  <TableRow key={idx}>
                    <TableCell>
                      <Skeleton width="80%" />
                    </TableCell>
                    <TableCell>
                      <Skeleton width="80%" />
                    </TableCell>
                    <TableCell>
                      <Skeleton width="60%" />
                    </TableCell>
                  </TableRow>
                ))
              : paginatedClients.map((client) => (
                  <TableRow
                    key={client.user_id}
                    hover
                    selected={client.user_id === selectedUserId}
                    onClick={() => {
                      setSelectedUserId(client.user_id);
                      onRowClick?.(client.user_id);
                    }}
                    sx={{ cursor: "pointer" }}
                  >
                    <TableCell sx={{ color: "var(--textMain)" }}>
                      {client.name}
                    </TableCell>
                    <TableCell sx={{ color: "var(--textMain)" }}>
                      {client.email}
                    </TableCell>
                    <TableCell sx={{ color: "var(--textMain)" }}>
                      {client.revenue?.toLocaleString() || "0"} DZD
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
        {!loading && (
          <TablePagination
            component="div"
            count={clients.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[rowsPerPage]}
          />
        )}
      </TableContainer>
    </Box>
  );
}
