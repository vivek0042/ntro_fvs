import * as React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { toast } from 'react-toastify';
import { post } from '../services/api';
import { useCookies } from 'react-cookie';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const defaultTheme = createTheme();

export default function SignIn() {
  const Navigate = useNavigate();
  const [captcha, setCaptcha] = useState("");
  const [cookies, setCookie, removeCookie] = useCookies(['user']);
  const [formData, setFormData] = useState({
    userid: "",
    password: "",
    remember: false,
    captcha: ""
  });

  useEffect(() => {
    generateCaptcha();
  }, []);

  function generateCaptcha() {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let captcha = '';
    for (let i = 0; i < 6; i++) {
      captcha += chars[Math.floor(Math.random() * chars.length)];
    }
    setCaptcha(captcha);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const req = {
      UserName: formData.userid,
      Password: formData.password,
      RememberMe: Boolean(formData.remember)
    };
    const Entcaptcha = formData.captcha;
  
    if (Entcaptcha !== captcha) {
      toast.error("Invalid Captcha");
      setFormData({
        userid: "",
        password: "",
        remember: false,
        captcha: ""
      });
      generateCaptcha();
      return;
    }
  
    const response = await post('Account/UserLogin', req);
    setFormData({
      userid: "",
      password: "",
      remember: false,
      captcha: ""
    });
    generateCaptcha();
    if (response.errCode === "106") {
      toast.error("UserName/Password is Incorrect");
      return;
    }
    if (response.cardType === 2 || response.cardType === 3) {
      toast.error("You have no Access, Please Contact the administrator");
    } else if (response.isActive === false) {
      toast.error("User is inactive, Please Contact the administrator");
    } else if (response.isLock === 1) {
      toast.error("User is Locked, Please Contact the administrator");
    }
  
    if (response.errCode === "0") {
      const options = {
        path: '/',
        expires: new Date(Date.now() + 60 * 60 * 1000) // 1 hour from now
      };
  
      setCookie('loginId', response.userid, options);
      setCookie('userroleid', response.userRole, options);
      setCookie('UserId', response.userName, options);
      setCookie('Name', response.name, options);
      setCookie('Cardtype', response.cardType, options);
      setCookie('AuthType', response.authType, options);
      setCookie('ADIDUser', response.adid, options);
      setCookie('RoleName', response.roleName, options);
      setCookie('CardSerialNo', response.cardSerialNo, options);
      setCookie('Mcsn', response.mcsn, options);
      Navigate("DashBoard/AdminDashBoard");
    } 
    console.log(response);
  };
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleLogout = () => {
    // To remove all cookies
    Object.keys(cookies).forEach(cookieName => {
      removeCookie(cookieName, { path: '/' });
    });

    // Redirect to the login page or home page after logout
    Navigate('/');
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="userid"
              label="User Id"
              value={formData.userid}
              onChange={handleChange}
              name="userid"
              autoComplete="userid"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="captcha"
              label="Captcha"
              id="captcha"
              onChange={handleChange}
              value={formData.captcha}
              autoComplete="captcha"
              sx={{ width: 150 }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="captchacode"
              id="captchacode"
              value={captcha}
              sx={{ width: 150 }}
              disabled
            />
            <FormControlLabel
              control={<Checkbox name="remember" id='remember' checked={formData.remember} onChange={handleChange} color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
            </Grid>
          </Box>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleLogout}
            sx={{ mt: 3, mb: 2 }}
          >
            Logout
          </Button>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}
