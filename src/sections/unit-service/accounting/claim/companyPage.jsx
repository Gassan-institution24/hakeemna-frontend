import { useState, useEffect } from "react";

import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import {
    Box,
    Table,
    Paper,
    Divider,
    TableRow,
    TextField,
    TableBody,
    TableCell,
    TableHead,
    Container,
    Typography,
    IconButton,
    TableContainer,
} from "@mui/material";

import { useSnackbar } from 'src/components/snackbar';

const ALL_USERS = [
    { _id: "1", name: "Ahmad Ali", email: "ahmad@test.com" },
    { _id: "2", name: "Sara Mohammad", email: "sara@test.com" },
    { _id: "3", name: "Omar Khaled", email: "omar@test.com" },
    { _id: "4", name: "Lina Hassan", email: "lina@test.com" },
];

export default function EmployeePage() {
    const [search, setSearch] = useState("");
    const [users, setUsers] = useState([]);
    const [companyUsers, setCompanyUsers] = useState([]);
    const { enqueueSnackbar } = useSnackbar();

    /* 🔍 Search */
    useEffect(() => {
        if (!search.trim()) {
            setUsers([]);
            return;
        }

        const filtered = ALL_USERS.filter(
            (u) =>
                u.name.toLowerCase().includes(search.toLowerCase()) ||
                u.email.toLowerCase().includes(search.toLowerCase())
        );

        setUsers(filtered);
    }, [search]);

    /* ➕ Assign user */
    const assignUser = (user) => {
        if (companyUsers.find((u) => u._id === user._id)) return;

        setCompanyUsers((prev) => [...prev, user]);
        setUsers((prev) => prev.filter((u) => u._id !== user._id));
        enqueueSnackbar('User added to company successfully', {
            variant: 'success',
        });
    };

    /* ➖ Remove user */
    const removeUser = (id) => {
        setCompanyUsers((prev) => prev.filter((u) => u._id !== id));
        enqueueSnackbar('User removed from company successfully', {
            variant: 'success',
        });
    };

    return (
        <Box sx={{ minHeight: "100vh", bgcolor: "#f4f6f8", py: 5 }} >
            <Container maxWidth={false} sx={{ px: 3 }}>
                {/* Search */}
                <Paper sx={{ p: 3, mb: 4, borderRadius: 3, width: "100%" }}>
                    <TextField
                        fullWidth
                        label="Search users"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </Paper>

                {/* Search Results */}
                {users.length > 0 && (
                    <Paper sx={{ mb: 5, borderRadius: 3 }}>
                        <Box sx={{ p: 2 }}>
                            <Typography fontWeight="bold">Search Results</Typography>
                        </Box>
                        <Divider />
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Name</TableCell>
                                        <TableCell>Email</TableCell>
                                        <TableCell align="center">Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {users.map((user) => (
                                        <TableRow key={user._id}>
                                            <TableCell>{user.name}</TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell align="center">
                                                <IconButton
                                                    color="primary"
                                                    onClick={() => assignUser(user)}
                                                >
                                                    <PersonAddIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                )}

                {/* Company Users */}
                <Paper sx={{ borderRadius: 3 }}>
                    <Box sx={{ p: 2 }}>
                        <Typography fontWeight="bold">Users in this company</Typography>
                    </Box>
                    <Divider />

                    {companyUsers.length === 0 ? (
                        <Box sx={{ p: 4 }}>
                            <Typography color="text.secondary">
                                No users assigned yet
                            </Typography>
                        </Box>
                    ) : (
                        <TableContainer>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Name</TableCell>
                                        <TableCell>Email</TableCell>
                                        <TableCell align="center">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {companyUsers.map((user) => (
                                        <TableRow key={user._id}>
                                            <TableCell>{user.name}</TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell align="center">
                                                <IconButton color="primary">
                                                    <ReceiptLongIcon />
                                                </IconButton>
                                                <IconButton color="success">
                                                    <EventAvailableIcon />
                                                </IconButton>
                                                <IconButton
                                                    color="error"
                                                    onClick={() => removeUser(user._id)}
                                                >
                                                    <PersonRemoveIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </Paper>
            </Container>

            
        </Box>
    );
}
