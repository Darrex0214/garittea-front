import { useState, useCallback } from 'react';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { useRouter } from 'src/routes/hooks';
import { Iconify } from 'src/components/iconify';
import { login } from 'src/api/authService';    // <-- importamos el servicio

export function SignInView() {
  const router = useRouter();

  // estados para email, password, loading y error
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleSignIn = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      await login({ email, password });
      router.push('/home');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error de autenticación');
    } finally {
      setLoading(false);
    }
  }, [email, password, router]);

  return (
    <>
      <Box gap={1.5} display="flex" flexDirection="column" alignItems="center" sx={{ mb: 5 }}>
        <Typography variant="h5">Inicio de Sesión</Typography>
      </Box>

      <Box display="flex" flexDirection="column" alignItems="flex-end">
        <TextField
          fullWidth
          label="Correo electrónico"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{ mb: 3 }}
        />

        <Link variant="body2" color="inherit" sx={{ mb: 1.5 }}>
          ¿Olvidaste tu contraseña?
        </Link>

        <TextField
          fullWidth
          label="Contraseña"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          InputLabelProps={{ shrink: true }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{ mb: 3 }}
        />

        <LoadingButton
          fullWidth
          size="large"
          variant="contained"
          loading={loading}
          onClick={handleSignIn}
        >
          Ingresar
        </LoadingButton>

        {error && (
          <Typography color="error" variant="body2" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
      </Box>
    </>
  );
}