import { Eye, EyeOff, MessageSquare, Loader2 } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import {toast} from "react-hot-toast"; 

const LoginPage = () => {

	const [formData,setFormData] = useState({
		email : "",
		password : "",
	})
	const [showPassword,setShowPassword] = useState(false)
	const {logIn,isLoggingIn} = useAuthStore();

	const validateForm = () => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/;
		if (!formData.email) 
			return toast.error("Email is required");
		if (!emailRegex.test(formData.email)) 
			return toast.error("Enter valid email");
		if (!formData.password) 
			return toast.error("Password is required");
		if (!passwordRegex.test(formData.password)) 
			return toast.error("Password has minimum 8 letters, that includes [uppercase,lowercase,special and number]");
		return true;
	}
	const handleOnSubmit = (e) => {
		e.preventDefault();
		if (validateForm() === true) logIn(formData);
	}

	const handleOnChange = (e) => {
		setFormData((prev) => ({
			...prev,
			[e.target.name]: e.target.value,
		}));
	};

	return (
		<div className="min-h-screen flex items-center justify-center">
			<div className="flex flex-col md:flex-row gap-20">
				<div className="flex flex-col items-center justify-center">
					<MessageSquare className="size-15 stroke-primary stroke-1 hover:scale-105" />
					<h1 className="text-2xl text-primary">Welcome back!</h1>
				</div>
				<div>
					<form onSubmit={handleOnSubmit} className="w-80 md:w-100">
						<fieldset className="mt-1">
							<legend className="fieldset-legend">Email </legend>
							<input 
								type="text" 
								name="email"
								onChange={handleOnChange}
								className="input md:w-100 focus:outline-none" 
								placeholder="Type here" 
							/>
						</fieldset>

						<fieldset className="mt-1">
							<legend className="fieldset-legend">Password </legend>
							<div className="relative">
								<input 
									type= { (showPassword)? "text" : "password" } 
									name="password"
									onChange={handleOnChange}
									className="input md:w-100 focus:outline-none" 
									placeholder="Type here" 
								/>
								<button className="absolute inset-y-0 right-3" onClick={(e) => {
									e.preventDefault();
									setShowPassword(!showPassword);
								}}>
								{	
									(showPassword)? <Eye className="size-5"/>: <EyeOff className="size-5 stroke-neutral-500"/>
								}
								</button>
							</div>
						</fieldset>

						<fieldset className="fieldset mt-5">
							<button className="btn btn-primary md:w-100" disabled={isLoggingIn} >
							{
								(isLoggingIn)? 
								<>
									<Loader2 className="size-5 animate-spin" />
									Loading...
								</> : "Log In"
							}
							</button>
						</fieldset>

						<fieldset className="fieldset">
							<Link to="/signup"> Register new account? </Link>
						</fieldset>

					</form>
				</div>
			</div>
		</div>
	)
}

export default LoginPage;