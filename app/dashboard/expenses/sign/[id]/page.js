'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Layout from '../../../../components/Layout';
import api from '../../../../lib/api';
import { signHash } from '../../../../lib/crypto';
import toast from 'react-hot-toast';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { getCurrentUser } from '../../../../lib/auth';
import Box from '@mui/material/Box';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Link from 'next/link';

export default function SignExpensePage() {
    const [report, setReport] = useState(null);
    const [user, setUser] = useState(null);
    const { id } = useParams();
    const router = useRouter();

    useEffect(() => {
        setUser(getCurrentUser());
    }, []);

    useEffect(() => {
        if (id && user) {
            api.get(`/reports/${id}`).then(res => setReport(res.data)).catch(() => toast.error("Relatório não encontrado."));
        }
    }, [id, user]);

    const handleSign = async () => {
        if (!report) {
            toast.error('Relatório não carregado!');
            return;
        }
        toast.loading('Assinando relatório...');
        try {
            const signature = await signHash(report.dataHash);
            const token = localStorage.getItem('token');
            if (!token) throw new Error('Usuário não autenticado!');
            const response = await api.post(`/reports/sign/${id}`, { signature }, {
                headers: { 'x-auth-token': token }
            });
            toast.dismiss();
            toast.success('Relatório assinado com sucesso!');
            router.push('/dashboard/expenses/signed');
        } catch (error) {
            toast.dismiss();
            toast.error(error?.response?.data?.msg || error.message || 'Falha ao assinar.');
        }
    };

    if (!user) return <Layout><div>Carregando usuário...</div></Layout>;
    if (!report) return <Layout><div>Carregando relatório...</div></Layout>;

    return (
        <Layout>
            <Box className="flex justify-center items-center min-h-[70vh] bg-gradient-to-br from-indigo-50 to-white">
                <Paper elevation={8} className="max-w-2xl w-full bg-white p-10 rounded-2xl shadow-xl border border-indigo-100">
                    <Box className="flex items-center mb-6 w-full">
                        <Button component={Link} href="/dashboard" startIcon={<ArrowBackIcon />} variant="outlined" color="primary" sx={{ borderRadius: 2, fontWeight: 500 }}>
                            Voltar ao Menu
                        </Button>
                    </Box>
                    <Box className="flex flex-col items-center mb-6">
                        <AssignmentIcon className="text-indigo-600" sx={{ fontSize: 56 }} />
                        <Typography variant="h5" fontWeight="bold" align="center" gutterBottom className="mt-2 text-indigo-900">Assinar Relatório</Typography>
                        <Typography variant="body2" color="text.secondary" align="center">Confira os dados e assine digitalmente o relatório</Typography>
                    </Box>
                    <div className="mt-6 p-4 border rounded-xl bg-gray-50 space-y-2">
                        <Typography><strong>Descrição:</strong> {report.description}</Typography>
                        <Typography variant="body2" color="text.secondary"><strong>Valor:</strong> R$ {report.amount.toFixed(2)}</Typography>
                        <Typography variant="body2" color="text.secondary"><strong>Enviado por:</strong> {report.submittedBy.name}</Typography>
                        <Typography variant="body2" color="text.secondary" className="break-all"><strong>Hash dos Dados:</strong> <code className="text-sm">{report.dataHash}</code></Typography>
                        {report.receipt && (
                            <a href={`http://localhost:5000/uploads/receipts/${report.receipt && report.receipt.split(/[\\/]/).pop()}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-sm">
                                Ver Recibo
                            </a>
                        )}
                    </div>
                    <Button onClick={handleSign} variant="contained" color="success" fullWidth sx={{ mt: 4, py: 1.5, borderRadius: 2, fontWeight: 600, fontSize: 18 }}>
                        ASSINAR DIGITALMENTE COM MINHA CHAVE
                    </Button>
                </Paper>
            </Box>
        </Layout>
    );
}