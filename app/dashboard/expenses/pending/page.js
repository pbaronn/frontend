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
import AssignmentIcon from '@mui/icons-material/Assignment';
import Avatar from '@mui/material/Avatar';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function PendingExpensesPage() {
    const [reports, setReports] = useState([]);
    const [user, setUser] = useState(null);

    useEffect(() => {
        setUser(getCurrentUser());
    }, []);

    useEffect(() => {
        if (user) {
            const fetchReports = async () => {
                try {
                    const { data } = await api.get('/reports/pending');
                    setReports(data);
                } catch (error) {
                    toast.error("Falha ao buscar relatórios pendentes.");
                }
            };
            fetchReports();
        }
    }, [user]);

    if (!user) {
        return <div className="flex items-center justify-center h-screen">Carregando...</div>;
    }

    return (
        <Layout>
            <Box className="max-w-4xl mx-auto min-h-[70vh] flex flex-col justify-center bg-gradient-to-br from-indigo-50 to-white py-8">
                <Paper elevation={8} className="bg-white p-10 rounded-2xl shadow-xl border border-indigo-100 mb-8">
                    <Box className="flex flex-col items-center mb-6">
                        <AssignmentIcon className="text-indigo-600" sx={{ fontSize: 56 }} />
                        <Typography variant="h5" fontWeight="bold" align="center" gutterBottom className="mt-2 text-indigo-900">Despesas Pendentes</Typography>
                        <Typography variant="body2" color="text.secondary" align="center">Aprove ou rejeite relatórios de despesas enviados pelos funcionários</Typography>
                    </Box>
                    <div className="space-y-6">
                        {reports.length > 0 ? reports.map(report => (
                            <Paper key={report._id} className="p-5 border rounded-xl flex flex-col sm:flex-row justify-between items-center gap-4 shadow hover:shadow-lg transition-shadow bg-indigo-50/50">
                                <div className="flex items-center gap-4 w-full">
                                    <Avatar sx={{ bgcolor: '#6366f1', width: 56, height: 56 }}>{report.submittedBy.name[0]}</Avatar>
                                    <div className="flex-1">
                                        <Typography fontWeight="bold" className="text-lg text-indigo-900">{report.description}</Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Enviado por: <span className="font-semibold">{report.submittedBy.name}</span> | Valor: <span className="font-semibold">R$ {report.amount.toFixed(2)}</span>
                                        </Typography>
                                        {report.receipt && (
                                            <a href={`http://localhost:5000/${report.receipt.replace('uploads/receipts', 'uploads/receipts')}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-sm">
                                                Ver Recibo
                                            </a>
                                        )}
                                    </div>
                                </div>
                                <Link href={`/dashboard/expenses/sign/${report._id}`} passHref legacyBehavior>
                                    <Button variant="contained" color="success" component="a" sx={{ mt: { xs: 2, sm: 0 }, minWidth: 140 }}>
                                        Assinar
                                    </Button>
                                </Link>
                            </Paper>
                        )) : <Typography align="center">Nenhum relatório pendente.</Typography>}
                    </div>
                </Paper>
            </Box>
        </Layout>
    );
}