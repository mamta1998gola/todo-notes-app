import { useState } from 'react';
import PropTypes from 'prop-types';
import {
  AppBar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
  Button
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from "react-router-dom";

const API = "http://localhost:8080";

const drawerWidth = 240;
const navItems = ['Todo', 'Storage'];

function Header(props) {
  const { window } = props;
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const authbtn = sessionStorage.getItem('token') ? 'Logout' : 'Login';

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        Todo Storage App
      </Typography>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item} disablePadding>
            <ListItemButton sx={{ textAlign: 'center' }}>
              <ListItemText primary={item} />
            </ListItemButton>
          </ListItem>
        ))}
        <ListItem key='auth_btn_list' disablePadding>
          <ListItemButton sx={{ textAlign: 'center' }} onClick={() => routes(authbtn)}>
            <ListItemText primary={authbtn} />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  const Logout = () => {
    fetch(`${API}/logout`)
    .then(()=> {
      navigate('/');
      sessionStorage.setItem('token', '');
    })
    .catch();
  }

  const routes = (item) => {
    switch(item) {
      case 'Todo':
        navigate('/todo');
      break;
      case 'Storage':
        navigate('/storage');
      break;
      case 'Logout': 
        Logout();
      break;
      default:
        navigate('/');
    }
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar component="nav" position='sticky'>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
          >
            Todo Storage App
          </Typography>
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            {navItems.map((item) => (
              <Button key={item} sx={{ color: '#fff' }} onClick={() => routes(item)}>
                {item}
              </Button>
            ))}
            <Button key='auth_btn' sx={{ color: '#fff' }} onClick={() => routes(authbtn)}>
              {authbtn}
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <nav>
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
    </Box>
  );
}

Header.propTypes = {
  window: PropTypes.func,
};

export default Header;
