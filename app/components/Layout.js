'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser, logout } from '../lib/auth';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import PeopleIcon from '@mui/icons-material/People';
import ReceiptIcon from '@mui/icons-material/Receipt';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import LogoutIcon from '@mui/icons-material/Logout';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import HomeIcon from '@mui/icons-material/Home';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

const menuOptions = (user) => {
  if (!user) return [];
  const common = [
    { text: 'Início', href: '/dashboard', icon: <HomeIcon /> },
  ];
  if (user.role === 'employee') {
    return [
      ...common,
      { text: 'Nova Despesa', href: '/dashboard/expenses/submit', icon: <ReceiptIcon /> },
      { text: 'Sair', action: 'logout', icon: <ExitToAppIcon /> },
    ];
  }
  if (user.role === 'manager') {
    return [
      ...common,
      { text: 'Funcionários', href: '/dashboard/employees', icon: <PeopleIcon /> },
      { text: 'Despesas Pendentes', href: '/dashboard/expenses/pending', icon: <AssignmentTurnedInIcon /> },
      { text: 'Sair', action: 'logout', icon: <ExitToAppIcon /> },
    ];
  }
  if (user.role === 'director') {
    return [
      ...common,
      { text: 'Funcionários', href: '/dashboard/employees', icon: <PeopleIcon /> },
      { text: 'Despesas Assinadas', href: '/dashboard/expenses/signed', icon: <AssignmentTurnedInIcon /> },
      { text: 'Sair', action: 'logout', icon: <ExitToAppIcon /> },
    ];
  }
  return common;
};

const Layout = ({ children }) => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      logout();
      router.push('/login');
    } else {
      setUser(currentUser);
    }
  }, [router]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (!user) {
    return <div className="flex items-center justify-center h-screen">Carregando...</div>;
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f3f4f6' }}>
      {/* AppBar */}
      <AppBar position="fixed" color="primary" sx={{ zIndex: 1201 }}>
        <Toolbar className="flex justify-between">
          <div className="flex items-center">
            <IconButton
              color="inherit"
              edge="start"
              onClick={() => setDrawerOpen(true)}
              sx={{ mr: 2, display: { sm: 'none' } }}
              aria-label="menu"
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div" className="font-bold">
              ReportSys
            </Typography>
          </div>
          <div className="flex items-center space-x-4">
            <Typography variant="body1" className="hidden sm:block">
              Bem-vindo, {user.name} ({user.role === 'employee' ? 'Funcionário' : user.role === 'manager' ? 'Gestor' : 'Diretor'})
            </Typography>
            <Button
              color="inherit"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              sx={{ fontWeight: 'bold' }}
            >
              Sair
            </Button>
          </div>
        </Toolbar>
      </AppBar>
      {/* Drawer lateral */}
      <Drawer
        variant="permanent"
        sx={{
          width: 220,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: 220, boxSizing: 'border-box', background: '#fff', borderRight: '1px solid #e5e7eb' },
          display: { xs: 'none', sm: 'block' },
        }}
        open
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {menuOptions(user).map((item) => (
              item.action === 'logout' ? (
                <ListItem button key={item.text} onClick={handleLogout}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItem>
              ) : (
                <Link href={item.href} key={item.text} passHref legacyBehavior>
                  <ListItem button component="a">
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.text} />
                  </ListItem>
                </Link>
              )
            ))}
          </List>
        </Box>
      </Drawer>
      {/* Drawer mobile */}
      <Drawer
        variant="temporary"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          [`& .MuiDrawer-paper`]: { width: 220, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {menuOptions(user).map((item) => (
              item.action === 'logout' ? (
                <ListItem button key={item.text} onClick={handleLogout}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItem>
              ) : (
                <Link href={item.href} key={item.text} passHref legacyBehavior>
                  <ListItem button component="a" onClick={() => setDrawerOpen(false)}>
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.text} />
                  </ListItem>
                </Link>
              )
            ))}
          </List>
        </Box>
      </Drawer>
      {/* Conteúdo principal */}
      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, sm: 4 }, marginLeft: { sm: '220px' }, marginTop: '64px' }}>
        <div className="max-w-5xl mx-auto w-full">
          {children}
        </div>
      </Box>
    </Box>
  );
};

export default Layout;