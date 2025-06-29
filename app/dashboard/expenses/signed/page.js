'use client';
import { useState, useEffect } from 'react';
import Layout from '../../../components/Layout';
import api from '../../../lib/api';
import toast from 'react-hot-toast';
import Link from 'next/link';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { getCurrentUser } from '../../../lib/auth';
import Box from '@mui/material/Box';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import Avatar from '@mui/material/Avatar';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function SignedExpensesPage() {
    const [reports, setReports] = useState([]);
    const [user, setUser] = useState(null);

    useEffect(() => {
        setUser(getCurrentUser());
    }, []);

    useEffect(() => {
        if (user) {
            api.get('/reports/signed').then(res => setReports(res.data)).catch(() => toast.error("Falha ao buscar relatórios."));
        }
    }, [user]);

    if (!user) {
        return <div className="flex items-center justify-center h-screen">Carregando...</div>;
    }

    return (
        <Layout>
            <Box className="max-w-4xl mx-auto">
                <Paper elevation={6} className="bg-white p-8 rounded-xl shadow mb-6">
                    <Box className="flex flex-col items-center mb-4">
                        <AssignmentTurnedInIcon className="text-indigo-600" sx={{ fontSize: 48 }} />
                        <Typography variant="h5" fontWeight="bold" align="center" gutterBottom>Despesas Assinadas</Typography>
                        <Typography variant="body2" color="text.secondary" align="center">Verifique as assinaturas digitais das despesas</Typography>
                    </Box>
                    <div className="space-y-4">
                        {reports.length > 0 ? reports.map(report => (
                            <Paper key={report._id} className="p-4 border rounded-lg flex flex-col sm:flex-row justify-between items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-4 w-full">
                                    <Avatar sx={{ bgcolor: '#6366f1' }}>{report.signature.signedBy.name[0]}</Avatar>
                                    <div className="flex-1">
                                        <Typography fontWeight="bold" className="text-lg">{report.description}</Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Assinado por: <span className="font-semibold">{report.signature.signedBy.name}</span> | Valor: <span className="font-semibold">R$ {report.amount.toFixed(2)}</span>
                                        </Typography>
                                        {report.receipt && (
                                            <a href={`http://localhost:5000/${report.receipt.replace('uploads/receipts', 'uploads/receipts')}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-sm">
                                                Ver Recibo
                                            </a>
                                        )}
                                    </div>
                                </div>
                                <Link href={`/dashboard/expenses/verify/${report._id}`} passHref legacyBehavior>
                                    <Button variant="contained" color="primary" component="a" sx={{ mt: { xs: 2, sm: 0 }, minWidth: 140 }}>
                                        Verificar Assinatura
                                    </Button>
                                </Link>
                            </Paper>
                        )) : <Typography align="center">Nenhuma despesa assinada para verificar.</Typography>}
                    </div>
                </Paper>
            </Box>
        </Layout>
    );
}