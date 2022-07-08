import { useContext, useState } from 'react';

import { useRouter } from 'next/router';
import NextLink from 'next/link'

import { Box, Button, Chip, Grid, Link, TextField, Typography } from "@mui/material"
import { useForm } from 'react-hook-form';

import { AuthContext } from '../../context';
import { AuthLayout } from "../../components/layouts"
import { tesloApi } from '../../api';
import { ErrorOutline } from '@mui/icons-material';
import { validations } from '../../utils';


type FormData = {
    name    : string;
    email   : string;
    password: string;
  };

const RegisterPage = () => {

    const router = useRouter();
    const { registerUser } = useContext( AuthContext )

    const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

    const [showError, setShowError] = useState(false)
    const [buttonDisabled, setButtonDisabled] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const onRegisterForm = async( { name, email, password }: FormData ) => {
        setShowError(false);
        setButtonDisabled(true)

        const { hasError, message } = await registerUser(name, email, password);

        if ( hasError ) {
            setShowError(true);
            setErrorMessage( message! );
            setTimeout(() => {
                setShowError(false);
                setButtonDisabled(false)
            }, 3000 );
            return
        }

        // navegar  a la pantalla que el usuario estaba
        const destination = router.query.p?.toString() || '/'
        router.replace( destination );


    }

  return (
    <AuthLayout  title={"Registrarse"}>
        <form onSubmit={ handleSubmit(onRegisterForm) } noValidate >
            <Box sx={{ width: 350, padding: '10px 20px' }}>
                <Grid container spacing={2}>

                    <Grid item xs={12}>
                        <Typography variant="h1" component="h1">Crear cuenta</Typography>
                    </Grid>
                    <Chip
                        label="ups! no se pudo crear el usuario! pruebe otro mail/password"
                        color="error"
                        icon={ <ErrorOutline /> }
                        className="fadeIn"
                        sx={{ display: showError ? 'flex' : 'none' }}
                    />

                    <Grid item xs={12}>
                        <TextField  
                            type="text"
                            label="Nombre completo" 
                            variant="filled" 
                            fullWidth
                            { ...register('name',{
                                required: 'Este campo es requerido',
                                minLength: { value: 2, message: 'Mínimo 2 caracteres' }
                            })}
                            error={ !!errors.name }
                            helperText = { errors.name?.message }
                        />

                    </Grid>

                    <Grid item xs={12}>
                        <TextField  
                            type="email"
                            label="Correo" 
                            variant="filled" 
                            fullWidth
                            { ...register('email', {
                                required: 'Este campo es requerido',
                                validate: validations.isEmail
                            })}
                            error={ !!errors.email }
                            helperText = { errors.email?.message }
                        />

                    </Grid>

                    <Grid item xs={12}>
                        <TextField  
                           
                            type='password' 
                            label="Contraseña" 
                            variant="filled" 
                            fullWidth
                            { ...register('password',{
                                required: 'Este campo es requerido',
                                minLength: { value: 6, message: 'Mínimo 6 caracteres' }
                            })}
                            error={ !!errors.password }
                            helperText = { errors.password?.message }
                        />

                    </Grid>

                    <Grid item xs={12}>
                        <Button 
                            type="submit"
                            color="secondary" 
                            className="circular-btn" 
                            size="large" 
                            fullWidth
                            disabled={ buttonDisabled }
                            
                        >
                            Registrar
                        </Button>
                    </Grid>

                    <Grid item xs={12} display="flex" justifyContent='end'>
                        <NextLink 
                            href={ router.query.p ? `/auth/login?p=${ router.query.p }` : '/auth/login'} 
                            passHref
                        >
                            <Link underline='always'>
                                ¿Ya tienes cuenta? 
                            </Link>
                        </NextLink>
        
                    </Grid>

                </Grid>

            </Box>
        </form>
    </AuthLayout>
  )
}

export default RegisterPage