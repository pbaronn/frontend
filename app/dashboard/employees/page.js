'use client';
import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import api from '../../lib/api';
import toast from 'react-hot-toast';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { getCurrentUser } from '../../lib/auth';
import Box from '@mui/material/Box';
import PeopleIcon from '@mui/icons-material/People';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Link from 'next/link';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import EditIcon from '@mui/icons-material/Edit';

export default function EmployeesPage() {
    const [users, setUsers] = useState([]);
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'employee' });
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [editData, setEditData] = useState({ _id: '', name: '', email: '', role: 'employee', password: '' });

    useEffect(() => {
        setUser(getCurrentUser());
    }, []);

    useEffect(() => {
        if (user) fetchUsers();
    }, [user]);

    const fetchUsers = async () => {
        try {
            const { data } = await api.get('/users');
            setUsers(data);
        } catch (error) {
            toast.error("Falha ao buscar usuários.");
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        toast.loading("Criando usuário...");
        try {
            await api.post('/users', formData);
            toast.dismiss();
            toast.success("Usuário criado com sucesso!");
            setFormData({ name: '', email: '', password: '', role: 'employee' });
            fetchUsers();
        } catch (error) {
            toast.dismiss();
            toast.error("Falha ao criar usuário.");
        } finally {
            setLoading(false);
        }
    };

    const handleEditOpen = (user) => {
        setEditData({ ...user, password: '' });
        setEditOpen(true);
    };

    const handleEditClose = () => setEditOpen(false);

    const handleEditChange = (e) => {
        setEditData({ ...editData, [e.target.name]: e.target.value });
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        toast.loading('Salvando alterações...');
        try {
            const payload = { name: editData.name, email: editData.email, role: editData.role };
            if (editData.password) payload.password = editData.password;
            await api.put(`/users/${editData._id}`, payload);
            toast.dismiss();
            toast.success('Usuário atualizado com sucesso!');
            setEditOpen(false);
            fetchUsers();
        } catch (error) {
            toast.dismiss();
            toast.error('Erro ao atualizar usuário.');
        }
    };

    if (!user) {
        return <div className="flex items-center justify-center h-screen">Carregando...</div>;
    }

    return (
        <Layout>
            <Box className="max-w-4xl mx-auto min-h-[70vh] flex flex-col justify-center bg-gradient-to-br from-indigo-50 to-white py-8">
                <Paper elevation={8} className="bg-white p-10 rounded-2xl shadow-xl border border-indigo-100 mb-8">
                    <Box className="flex flex-col items-center mb-6">
                        <PeopleIcon className="text-indigo-600" sx={{ fontSize: 56 }} />
                        <Typography variant="h5" fontWeight="bold" align="center" gutterBottom className="mt-2 text-indigo-900">Funcionários</Typography>
                        <Typography variant="body2" color="text.secondary" align="center">Cadastre e visualize os funcionários do sistema</Typography>
                    </Box>
                    <form onSubmit={handleSubmit} className="space-y-6 mb-10" autoComplete="off">
                        <Divider className="mb-4" />
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    type="text"
                                    name="name"
                                    label="Nome"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    type="email"
                                    name="email"
                                    label="E-mail"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    type="password"
                                    name="password"
                                    label="Senha"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    select
                                    name="role"
                                    label="Cargo"
                                    value={formData.role}
                                    onChange={handleChange}
                                    fullWidth
                                >
                                    <MenuItem value="employee">Funcionário</MenuItem>
                                    <MenuItem value="manager">Gestor</MenuItem>
                                    <MenuItem value="director">Diretor</MenuItem>
                                </TextField>
                            </Grid>
                        </Grid>
                        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ py: 1.5 }} disabled={loading}>
                            {loading ? 'Criando...' : 'Criar Usuário'}
                        </Button>
                    </form>
                    <Divider className="mb-4" />
                    <Typography variant="h6" fontWeight="bold" gutterBottom>Usuários Cadastrados</Typography>
                    <Grid container spacing={2}>
                        {users.map(userItem => (
                            <Grid item xs={12} sm={6} md={4} key={userItem._id}>
                                <Paper className="p-4 flex flex-col items-center gap-2 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                    <Avatar sx={{ bgcolor: '#6366f1', width: 48, height: 48 }}>{userItem.name[0]}</Avatar>
                                    <Typography fontWeight="bold">{userItem.name}</Typography>
                                    <Typography variant="body2" color="text.secondary">{userItem.email}</Typography>
                                    <Typography variant="caption" className="px-2 py-1 rounded-full bg-indigo-100 text-indigo-700 mt-1">
                                        {userItem.role === 'employee' ? 'Funcionário' : userItem.role === 'manager' ? 'Gestor' : 'Diretor'}
                                    </Typography>
                                    <Button startIcon={<EditIcon />} size="small" variant="outlined" sx={{ mt: 1 }} onClick={() => handleEditOpen(userItem)}>
                                        Editar
                                    </Button>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                </Paper>
                <Dialog open={editOpen} onClose={handleEditClose}>
                    <DialogTitle>Editar Funcionário</DialogTitle>
                    <form onSubmit={handleEditSubmit} autoComplete="off">
                        <DialogContent className="space-y-4">
                            <TextField
                                label="Nome"
                                name="name"
                                value={editData.name}
                                onChange={handleEditChange}
                                fullWidth
                                required
                            />
                            <TextField
                                label="E-mail"
                                name="email"
                                value={editData.email}
                                onChange={handleEditChange}
                                fullWidth
                                required
                            />
                            <TextField
                                label="Senha (opcional)"
                                name="password"
                                type="password"
                                value={editData.password}
                                onChange={handleEditChange}
                                fullWidth
                            />
                            <TextField
                                select
                                label="Cargo"
                                name="role"
                                value={editData.role}
                                onChange={handleEditChange}
                                fullWidth
                            >
                                <MenuItem value="employee">Funcionário</MenuItem>
                                <MenuItem value="manager">Gestor</MenuItem>
                                <MenuItem value="director">Diretor</MenuItem>
                            </TextField>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleEditClose}>Cancelar</Button>
                            <Button type="submit" variant="contained">Salvar</Button>
                        </DialogActions>
                    </form>
                </Dialog>
            </Box>
        </Layout>
    );
}