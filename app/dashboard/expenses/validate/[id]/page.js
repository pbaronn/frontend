'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Layout from '../../../../components/Layout';
import api from '../../../../lib/api';
import toast from 'react-hot-toast';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import AssignmentIcon from '@mui/icons-material/Assignment';

export default function ValidateExpensePage() {
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(false);
    const { id } = useParams();
    const router = useRouter();

    useEffect(() => {
        if (id) {
            api.get(`/reports/${id}`).then(res => setReport(res.data)).catch(() => toast.error("Relatório não encontrado."));
        }
    }, [id]);

    const handleAction = async (action) => {
        setLoading(true);
        toast.loading(action === 'approve' ? 'Aprovando...' : 'Rejeitando...');
        try {
            await api.post(`/reports/validate/${id}`, { action });
            toast.dismiss();
            toast.success(action === 'approve' ? 'Relatório aprovado!' : 'Relatório rejeitado!');
            router.push('/dashboard/expenses/pending');
        } catch (error) {
            toast.dismiss();
            toast.error('Erro ao validar relatório.');
        } finally {
            setLoading(false);
        }
    };

    if (!report) return <Layout><div className="flex items-center justify-center h-screen">Carregando relatório...</div></Layout>;

    return (
        <Layout>
            <Box className="flex justify-center items-center min-h-[70vh] bg-gradient-to-br from-indigo-50 to-white">
                <Paper elevation={8} className="max-w-2xl w-full bg-white p-10 rounded-2xl shadow-xl border border-indigo-100">
                    <Box className="flex flex-col items-center mb-6">
                        <AssignmentIcon className="text-indigo-600" sx={{ fontSize: 56 }} />
                        <Typography variant="h5" fontWeight="bold" align="center" gutterBottom className="mt-2 text-indigo-900">Validar Relatório</Typography>
                        <Typography variant="body2" color="text.secondary" align="center">Confira os dados e aprove ou rejeite o relatório</Typography>
                    </Box>
                    <div className="mt-6 p-4 border rounded-xl bg-gray-50 space-y-2">
                        <Typography><strong>Descrição:</strong> {report.description}</Typography>
                        <Typography variant="body2" color="text.secondary"><strong>Valor:</strong> R$ {report.amount.toFixed(2)}</Typography>
                        <Typography variant="body2" color="text.secondary"><strong>Enviado por:</strong> {report.submittedBy.name}</Typography>
                        {report.receipt && (
                            <a href={`http://localhost:5000/${report.receipt.replace('uploads/receipts', 'uploads/receipts')}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-sm">
                                Ver Recibo
                            </a>
                        )}
                    </div>
                    <Box className="flex gap-4 mt-8">
                        <Button onClick={() => handleAction('approve')} variant="contained" color="success" sx={{ px: 4, py: 1.5, borderRadius: 2, fontWeight: 600 }} disabled={loading}>
                            Aprovar
                        </Button>
                        <Button onClick={() => handleAction('reject')} variant="outlined" color="error" sx={{ px: 4, py: 1.5, borderRadius: 2, fontWeight: 600 }} disabled={loading}>
                            Rejeitar
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </Layout>
    );
} 