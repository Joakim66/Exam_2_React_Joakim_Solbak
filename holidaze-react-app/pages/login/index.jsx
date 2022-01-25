import Head from "next/head"
import { useRouter } from "next/router"

import { useEffect } from "react"
import { useState } from "react"
import { useContext } from "react"
import { useForm } from "react-hook-form"
import * as yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup"

import AuthContext from "../../context/AuthContext"

import Hero from "../../components/layout/Hero"

import styles from "../../styles/Login.module.css"

const schema = yup.object().shape({
    username: yup.string().min(3, "Username must be at least 3 characters").required("Please enter your username"),
    password: yup.string().min(4, "Password must be at least 4 characters").required("Please enter your password"),
})

const baseUrl = "https://jsolholidaze.wpengine.com"
const jwtUrl = baseUrl + "/wp-json/jwt-auth/v1/token"

export default function Login() {
    const [submitting, setSubmitting] = useState(false);
    const [loginError, setLoginError] = useState(null);

    const [auth, setAuth] = useContext(AuthContext)
    
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
    })

  const router = useRouter()
  
  async function onSubmit(data) {
        setSubmitting(true)
        setLoginError(null)

        const dataUsername = data.username
        const dataPassword = data.password

        const stringified = JSON.stringify({ username: dataUsername, password: dataPassword })

        const options =  {
            method: 'POST',
            body: stringified,
            headers: {
                'Content-Type': 'application/json',
            },
        }

        try {
            const response = await fetch(jwtUrl, options)
            const json = await response.json()

            if(json.user_display_name){
                setAuth(json)
                alert("Login successful.")
                router.push("/admin")
            }
            if(!json.user_display_name){
                setLoginError(json.message)
            }        
            }catch (error) {
                setLoginError(`<p>Error fetching data from server: ${error}</p>`)
            }finally {
                setSubmitting(false);
        }
    }

    return (
        <>
            <Head>
                <title>Login | Next app for jsolholidaze.wpengine.com</title>
                <meta name="description" content="Login | Next app for jsolholidaze.wpengine.com" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main>
                <Hero
                    h1_text={
                    <>
                        Login Form
                    </>
                    }
                    lead_text={
                    <>
                        Login form that uses JWT to authenticate a user, and when the user is logged in, they're able to add new establishments to the API.
                    </>
                    }
                />
                <section className={styles.login_form_section}>
                    <div className="container">
                        <div className={styles.login_form_container}>
                            <h2>Login</h2>

                            <form className={styles.login_form} onSubmit={handleSubmit(onSubmit)}>
                                {loginError && <span className="text-danger login-error">{loginError}</span>}
                                
                                <fieldset disabled={submitting}>
                                    <div className="input-container">
                                        <label for="username">Username</label>
                                        <input type="text" {...register("username")} />
                                        {errors.username && <span>{errors.username.message}</span>}
                                    </div>

                                    <div className="input-container">
                                        <label for="password">Password</label>
                                        <input type="password" {...register("password")} />
                                        {errors.password && <span>{errors.password.message}</span>}
                                    </div>

                                    <button className="btn_primary" type="submit">
                                        {submitting ? "Loggin in..." : "Login"}
                                    </button>
                                </fieldset>

                            </form>
                            
                        </div>
                    </div>
                </section>
            </main>

        </>
    )
}

