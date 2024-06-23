import React, { useEffect, useState } from 'react';
import './Register.css';
import { Link, useNavigate } from 'react-router-dom';

function Register() {
    const [name, setName] = useState('');
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [confirmPasswordNotes, setConfirmPasswordNotes] = useState('');
    const [formError, setFormError] = useState('');
    const [isFormValid, setIsFormValid] = useState(false);

    const navigate=useNavigate();

    useEffect(() => {
        if (repeatPassword.length > 0) {
            if (password.startsWith(repeatPassword)) {
                if (password.length === repeatPassword.length) {
                    setConfirmPasswordNotes('Your Password Matched');
                } else {
                    setConfirmPasswordNotes('Your Password is Matching, Proceed Further');
                }
            } else {
                setConfirmPasswordNotes('Your Password is <strong>NOT MATCHING</strong>. Recorrect it.');
            }
        } else {
            setConfirmPasswordNotes('');
        }
    }, [repeatPassword, password]);

    useEffect(() => {
        setIsFormValid(
            name.trim() !== '' &&
            userName.trim() !== '' &&
            email.trim() !== '' &&
            password.trim() !== '' &&
            password === repeatPassword
        );
    }, [name, userName, email, password, repeatPassword]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!isFormValid) {
            setFormError('Please fill all fields correctly.');
            return;
        }
        setFormError('');

        try {
            const response = await fetch('/api/v1/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, userName, email, password }),
            });
            const data = await response.json();
            if (response.ok) {
                console.log('Registration successful', data);
                alert(`Registration successful ${data}`);
                navigate('/login');
            } else {
                console.error('Registration failed', data);
                setFormError(data.message || 'Registration failed');
                alert(`Registration failed ${data}`);
            }
        } catch (error) {
            console.error('Error:', error);
            setFormError('An error occurred. Please try again.');
            alert(`An error occurred. Please try again. ${error}`);
        }
    };

    return (
        <div className='register'>
            <div className='register-area'>
                <div className='head'><h3>CREATE ACCOUNT</h3></div>
                <form onSubmit={handleSubmit}>
                    <input
                        type='text'
                        placeholder='Enter your name'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <input
                        type='text'
                        placeholder='Enter your username'
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                    />
                    <input
                        type='email'
                        placeholder='Enter your email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type='password'
                        placeholder='Password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <input
                        type='password'
                        placeholder='Repeat Password'
                        value={repeatPassword}
                        onChange={(e) => setRepeatPassword(e.target.value)}
                    />
                    <p dangerouslySetInnerHTML={{ __html: confirmPasswordNotes }}></p>
                    {formError && <p className='form-error'>{formError}</p>}
                    <button type='submit' disabled={!isFormValid}>SIGN UP</button>
                </form>
                <div className='login-section'>
                    <p>Already have an account? <Link to='/login'>Login Here</Link></p>
                </div>
            </div>
        </div>
    );
}

export default Register;
