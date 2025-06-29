'use client';
import { useState, useEffect } from 'react';
import Layout from '../../../components/Layout';
import api from '../../../lib/api';
import toast from 'react-hot-toast';
import { hashData } from '../../../lib/crypto';
import { useRouter } from 'next/navigation';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Input from '@mui/material/Input';
import { getCurrentUser } from '../../../lib/auth';
import Box from '@mui/material/Box';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Link from 'next/link';

export default function SubmitExpensePage() {
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [receipt, setReceipt] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setUser(getCurrentUser());
    }, []);

    if (!user) {
        return <div className="flex items-center justify-center h-screen">Carregando...</div>;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!description || !amount) {
            toast.error("Preencha todos os campos.");
            return;
        }
        setLoading(true);
        toast.loading("Enviando relatório...");
        try {
            const reportData = { description, amount: parseFloat(amount) };
            const dataHash = await hashData(reportData);

            const formData = new FormData();
            formData.append('description', description);
            formData.append('amount', amount);
            formData.append('dataHash', dataHash);
            if (receipt) formData.append('receipt', receipt);

            await api.post('/reports/submit', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            toast.dismiss();
            toast.success("Relatório enviado com sucesso!");
            router.push('/dashboard');
        } catch (error) {
            toast.dismiss();
            toast.error("Falha ao enviar relatório.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <Layout>
            <Box className="flex justify-center items-center min-h-[70vh] bg-gradient-to-br from-indigo-50 to-white">
                <Paper elevation={8} className="max-w-lg w-full bg-white p-10 rounded-2xl shadow-xl border border-indigo-100">
                    <Box className="flex flex-col items-center mb-6">
                        <UploadFileIcon className="text-indigo-600" sx={{ fontSize: 56 }} />
                        <Typography variant="h5" fontWeight="bold" align="center" gutterBottom className="mt-2 text-indigo-900">Nova Despesa</Typography>
                        <Typography variant="body2" color="text.secondary" align="center">Preencha os dados abaixo para submeter um novo relatório de despesa</Typography>
                    </Box>
                    <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data" autoComplete="off">
                        <TextField
                            id="description"
                            label="Descrição"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            fullWidth
                            margin="normal"
                            InputProps={{ sx: { borderRadius: 2 } }}
                        />
                        <TextField
                            id="amount"
                            label="Valor (R$)"
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            required
                            fullWidth
                            margin="normal"
                            InputProps={{ sx: { borderRadius: 2 } }}
                        />
                        <Button
                            variant="outlined"
                            component="label"
                            fullWidth
                            startIcon={<UploadFileIcon />}
                            sx={{ borderRadius: 2, fontWeight: 500 }}
                        >
                            {receipt ? receipt.name : 'Anexar Recibo (imagem ou PDF)'}
                            <input
                                type="file"
                                accept="image/*,application/pdf"
                                hidden
                                onChange={e => setReceipt(e.target.files[0])}
                                required
                            />
                        </Button>
                        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ py: 1.5 }} disabled={loading}>
                            {loading ? 'Enviando...' : 'Enviar Relatório'}
                        </Button>
                    </form>
                </Paper>
            </Box>
        </Layout>
    );
}