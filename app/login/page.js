'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../lib/api';
import toast from 'react-hot-toast';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import LockIcon from '@mui/icons-material/Lock';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      toast.loading('Entrando...');
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      toast.dismiss();
      toast.success('Login realizado com sucesso!');
      router.push('/dashboard');
    } catch (error) {
      toast.dismiss();
      toast.error('Credenciais inválidas. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <Paper elevation={8} className="max-w-md w-full space-y-8 p-10 rounded-2xl shadow-xl border border-indigo-100">
        <Box className="flex flex-col items-center mb-6">
          <LockIcon className="text-indigo-600" sx={{ fontSize: 56 }} />
          <Typography variant="h5" fontWeight="bold" align="center" gutterBottom className="mt-2 text-indigo-900">Sistema de Relatórios</Typography>
          <Typography variant="body2" color="text.secondary" align="center">Acesse sua conta para continuar</Typography>
        </Box>
        <form className="mt-4 space-y-6" onSubmit={handleSubmit} autoComplete="off">
          <TextField
            label="E-mail"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            fullWidth
            margin="normal"
            autoFocus
            InputProps={{ sx: { borderRadius: 2 } }}
          />
          <TextField
            label="Senha"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            fullWidth
            margin="normal"
            InputProps={{ sx: { borderRadius: 2 } }}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ py: 1.5, borderRadius: 2, fontWeight: 600, fontSize: 18 }} disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>
      </Paper>
    </Box>
  );
}