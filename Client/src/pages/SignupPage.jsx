import React, { useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import {Link} from "react-router-dom";
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare, User } from "lucide-react";
import {toast} from "react-hot-toast";

const SignupPage = () => {
	const [showPassword,setshowPassword] = useState(false);
	const [formData,setFormData] = useState({
		name : "",
		email : "",
		password : "",
	})
	const {signUp,isSigningUp} = useAuthStore();

	const validateForm = () => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/;
		if (!formData.name.trim()) return toast.error("Name is required");
		if (formData.name.length <= 2) return toast.error("Name requires minimum 3 letter")
		if (!formData.email.trim()) return toast.error("Email is required");
		if (!emailRegex.test(formData.email)) return toast.error("Enter Valid Email")
		if (!formData.password.trim()) return toast.error("Password is required");
		if (!passwordRegex.test(formData.password)) return toast.error("Password has minimum 8 letters, that includes [uppercase,lowercase,special and number]");
		return true;
	}

	const handleOnSubmit = (e) => {
		e.preventDefault();
		if(validateForm()===true) signUp(formData);
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
					<h1 className="text-2xl text-primary">Welcome to ChatApp!</h1>
				</div>
				<div>
					<form onSubmit={handleOnSubmit} className="w-80 md:w-100">

						<fieldset className="">
							<legend className="fieldset-legend">Name </legend>
							<input 
								type="text" 
								name="name"
								className="input md:w-100 focus:outline-none" 
								placeholder="Type here" 
								onChange={handleOnChange}
							/>
						</fieldset>

						<fieldset className="mt-1">
							<legend className="fieldset-legend">Email </legend>
							<input 
								type="text" 
								name="email"
								className="input md:w-100 focus:outline-none" 
								placeholder="Type here" 
								onChange={handleOnChange}
							/>
						</fieldset>

						<fieldset className="mt-1">
							<legend className="fieldset-legend">Password </legend>
							<div className="relative">
								<input 
									type={(showPassword)? "text" : "password"}
									name="password" 
									className="input md:w-100 focus:outline-none" 
									placeholder="Type here" 
									onChange={handleOnChange}
								/>
								<button className="absolute inset-y-0 right-3" onClick={(e) => {
									e.preventDefault();
									setshowPassword(!showPassword);
								}}>
								{	
									(showPassword)? <Eye className="size-5"/>: <EyeOff className="size-5 stroke-neutral-500"/>
								}
								</button>
							</div>
						</fieldset>

						<fieldset className="fieldset mt-5">
							<button className="btn btn-primary md:w-100" disabled={isSigningUp}> 
								{
									(isSigningUp)? 
									<>
									<Loader2 className="size-5 animate-spin" />
									Loading...
									</> : "Create Account"
								}
							</button>
						</fieldset>

						<fieldset className="fieldset">
							<Link to="/login"> Already have account? </Link>
						</fieldset>

					</form>
				</div>
			</div>
		</div>
	)
}

export default SignupPage;