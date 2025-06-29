'use client';
import Layout from '../components/Layout';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { getCurrentUser } from '../lib/auth';
import { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PeopleIcon from '@mui/icons-material/People';
import ReceiptIcon from '@mui/icons-material/Receipt';
import Link from 'next/link';
import Box from '@mui/material/Box';

export default function DashboardPage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  if (!user) {
    return <div className="flex items-center justify-center h-screen">Carregando...</div>;
  }

  return (
    <Layout>
      <Box className="min-h-[70vh] flex flex-col justify-center items-center bg-gradient-to-br from-indigo-50 to-white py-8">
        <Paper elevation={8} className="w-full max-w-3xl mx-auto p-10 rounded-2xl shadow-xl border border-indigo-100 mb-10">
          <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom className="text-indigo-900 text-center">
            Bem-vindo ao Painel, {user?.name}!
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom className="text-center">
            Você está logado como <span className="font-semibold">{user?.role === 'employee' ? 'Funcionário' : user?.role === 'manager' ? 'Gestor' : 'Diretor'}</span>.
          </Typography>
          <Typography variant="body2" color="text.secondary" className="text-center mb-6">
            Utilize o menu lateral ou os atalhos abaixo para navegar entre as funcionalidades do sistema.
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            {user.role === 'employee' && (
              <Grid item xs={12} sm={6} md={4}>
                <Card className="hover:shadow-2xl transition-shadow cursor-pointer rounded-xl border border-indigo-100" component={Link} href="/dashboard/expenses/submit" sx={{ minHeight: 180 }}>
                  <CardContent className="flex flex-col items-center justify-center h-full">
                    <ReceiptIcon className="text-indigo-600" sx={{ fontSize: 48 }} />
                    <Typography variant="h6" className="mt-2 text-indigo-900">Nova Despesa</Typography>
                    <Typography variant="body2" color="text.secondary" align="center">Submeta um novo relatório de despesa</Typography>
                  </CardContent>
                </Card>
              </Grid>
            )}
            {user.role === 'manager' && (
              <>
                <Grid item xs={12} sm={6} md={4}>
                  <Card className="hover:shadow-2xl transition-shadow cursor-pointer rounded-xl border border-indigo-100" component={Link} href="/dashboard/employees" sx={{ minHeight: 180 }}>
                    <CardContent className="flex flex-col items-center justify-center h-full">
                      <PeopleIcon className="text-indigo-600" sx={{ fontSize: 48 }} />
                      <Typography variant="h6" className="mt-2 text-indigo-900">Funcionários</Typography>
                      <Typography variant="body2" color="text.secondary" align="center">Gerencie os funcionários</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Card className="hover:shadow-2xl transition-shadow cursor-pointer rounded-xl border border-indigo-100" component={Link} href="/dashboard/expenses/pending" sx={{ minHeight: 180 }}>
                    <CardContent className="flex flex-col items-center justify-center h-full">
                      <AssignmentIcon className="text-indigo-600" sx={{ fontSize: 48 }} />
                      <Typography variant="h6" className="mt-2 text-indigo-900">Despesas Pendentes</Typography>
                      <Typography variant="body2" color="text.secondary" align="center">Aprove ou rejeite despesas</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </>
            )}
            {user.role === 'director' && (
              <>
                <Grid item xs={12} sm={6} md={4}>
                  <Card className="hover:shadow-2xl transition-shadow cursor-pointer rounded-xl border border-indigo-100" component={Link} href="/dashboard/employees" sx={{ minHeight: 180 }}>
                    <CardContent className="flex flex-col items-center justify-center h-full">
                      <PeopleIcon className="text-indigo-600" sx={{ fontSize: 48 }} />
                      <Typography variant="h6" className="mt-2 text-indigo-900">Funcionários</Typography>
                      <Typography variant="body2" color="text.secondary" align="center">Visualize e gerencie funcionários</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Card className="hover:shadow-2xl transition-shadow cursor-pointer rounded-xl border border-indigo-100" component={Link} href="/dashboard/expenses/signed" sx={{ minHeight: 180 }}>
                    <CardContent className="flex flex-col items-center justify-center h-full">
                      <AssignmentIcon className="text-indigo-600" sx={{ fontSize: 48 }} />
                      <Typography variant="h6" className="mt-2 text-indigo-900">Despesas Assinadas</Typography>
                      <Typography variant="body2" color="text.secondary" align="center">Verifique assinaturas digitais</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </>
            )}
          </Grid>
        </Paper>
      </Box>
    </Layout>
  );
}