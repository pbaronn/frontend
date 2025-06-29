'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Layout from '../../../../components/Layout';
import api from '../../../../lib/api';
import { verifySignature } from '../../../../lib/crypto';
import toast from 'react-hot-toast';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import { getCurrentUser } from '../../../../lib/auth';
import Box from '@mui/material/Box';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Link from 'next/link';
import Button from '@mui/material/Button';

export default function VerifySignaturePage() {
    const [report, setReport] = useState(null);
    const [isValid, setIsValid] = useState(null);
    const [user, setUser] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        setUser(getCurrentUser());
    }, []);

    useEffect(() => {
        if (id && user) {
            api.get(`/reports/${id}`).then(res => {
                setReport(res.data);
                handleVerify(res.data);
            }).catch(() => toast.error("Relatório não encontrado."));
        }
    }, [id, user]);

    const handleVerify = async (reportToVerify) => {
        if (!reportToVerify?.signature?.value) {
            setIsValid(false);
            return;
        }
        const { signature, dataHash } = reportToVerify;
        const publicKeyB64 = signature.signedBy.publicKey;
        const signatureB64 = signature.value;
        const result = await verifySignature(publicKeyB64, signatureB64, dataHash);
        setIsValid(result);
    };

    if (!user) return <Layout><div>Carregando relatório para verificação...</div></Layout>;
    if (!report) return <Layout><div>Carregando relatório para verificação...</div></Layout>;

    return (
        <Layout>
            <Box className="flex justify-center items-center min-h-[70vh] bg-gradient-to-br from-indigo-50 to-white">
                <Paper elevation={8} className="max-w-2xl w-full bg-white p-10 rounded-2xl shadow-xl border border-indigo-100">
                    <Box className="flex items-center mb-6 w-full">
                        <Button component={Link} href="/dashboard" startIcon={<ArrowBackIcon />} variant="outlined" color="primary" sx={{ borderRadius: 2, fontWeight: 500 }}>
            <Box className="flex justify-center items-center min-h-[70vh]">
                <Paper elevation={6} className="max-w-2xl w-full bg-white p-8 rounded-xl shadow">
                    <Box className="flex items-center mb-4 w-full">
                        <Button component={Link} href="/dashboard" startIcon={<ArrowBackIcon />} variant="text" color="primary" className="mr-2">
                            Voltar ao Menu
                        </Button>
                    </Box>
                    <Box className="flex flex-col items-center mb-4">
                        <AssignmentTurnedInIcon className="text-indigo-600" sx={{ fontSize: 48 }} />
                        <Typography variant="h5" fontWeight="bold" align="center" gutterBottom>Verificar Assinatura</Typography>
                        <Typography variant="body2" color="text.secondary" align="center">Confira os dados e valide a assinatura digital da despesa</Typography>
                    </Box>
                    <div className="mt-6 p-4 border rounded-md bg-gray-50 space-y-2">
                        <Typography><strong>Descrição:</strong> {report.description}</Typography>
                        <Typography variant="body2" color="text.secondary"><strong>Valor:</strong> R$ {report.amount.toFixed(2)}</Typography>
                        <Typography variant="body2" color="text.secondary"><strong>Assinado por:</strong> {report.signature?.signedBy?.name}</Typography>
                        <Typography variant="body2" color="text.secondary" className="break-all"><strong>Assinatura:</strong> <code className="text-xs">{report.signature?.value}</code></Typography>
                        {report.receipt && (
                            <a href={`http://localhost:5000/${report.receipt.replace('uploads/receipts', 'uploads/receipts')}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-sm">
                                Ver Recibo
                            </a>
                        )}
                    </div>
                    <div className="mt-6">
                        {isValid === null ? (
                            <Alert severity="info">Verificando assinatura...</Alert>
                        ) : isValid ? (
                            <Alert severity="success">✅ Assinatura VÁLIDA</Alert>
                        ) : (
                            <Alert severity="error">❌ Assinatura INVÁLIDA</Alert>
                        )}
                    </div>
                </Paper>
            </Box>
        </Layout>
    );
}