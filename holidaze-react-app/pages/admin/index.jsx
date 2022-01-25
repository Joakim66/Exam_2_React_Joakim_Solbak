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

import styles from "../../styles/Admin.module.css"

const schema = yup.object().shape({
    title: yup.string().min(3, "Hotel title must be at least 3 characters").required("Please enter hotel title."),
    content: yup.string().min(4, "Content must be at least 10 characters").required("Please enter hotel description"),
    status: yup.string(),
    Price: yup.number().min(1000, "Price must be atleast 1000").max(9000, "Price can't be more than 9000").required("Please enter hotel price."),
    Accomodation: yup.string().required("Please enter hotel accomodation type."),
    Reviews: yup.number().required("Please enter hotel reviews."),
    PostalCode: yup.number().required("Please enter postal hotel postal code."),
    Address: yup.string().required("Please enter hotel address."),
})

const baseUrl = "https://jsolholidaze.wpengine.com"
const hotelPostTypeUrl = baseUrl + "/wp-json/wp/v2/hotel?per_page=100"

export default function Admin( ) {
    const [submitting, setSubmitting] = useState(false);
    const [adminError, setAdminError] = useState(null);

    const [auth, setAuth] = useContext(AuthContext)
  
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
    }) 

    const router = useRouter()

    useEffect(() =>{
        if(auth === null){
            router.push("/")
        }
    }, [])

    async function onSubmit(data) {
        setSubmitting(true)
        setAdminError(null)

        const dataTitle = data.title
        const dataContent = data.content
        const dataStatus = data.status
        const dataPrice = data.Price
        const dataAccomodation = data.Accomodation
        const dataReviews = data.Reviews
        const dataPostalCode = data.PostalCode
        const dataAddress = data.Address

        const stringified = JSON.stringify({
            title: dataTitle,
            content: dataContent,
            status: dataStatus,
            acf:{
                price: dataPrice,
                accomodations_list: dataAccomodation,
                reviews: dataReviews,
                postal_code: dataPostalCode,
                address: dataAddress,
                },
            }
        )

        const options =  {
            method: 'POST',
            body: stringified,
            headers: {
                'Authorization': `Bearer ${auth.token}`,
                'Content-Type': 'application/json',
            },
        }
        
        try {
            const response = await fetch(hotelPostTypeUrl, options)
            const json = await response.json()
        if(json){
            alert("Establishment successfully created.")
            router.push("/")
        }
        if(!json){
            setAdminError(json.message)
        }        
        } catch (error) {
            setAdminError(`<p>Error fetching data from server: ${error}</p>`)
        }finally {
            setSubmitting(false);
        }
    }

    return (
        <>
            <Head>
                <title>Admin | Next app for jsolholidaze.wpengine.com</title>
                <meta name="description" content="Admin | Next app for jsolholidaze.wpengine.com" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main>
                <Hero
                    h1_text={
                    <>
                        Admin Page
                    </>
                    }
                    lead_text={
                    <>
                        This is the admin page the user gets redirected to after logging in. When the user is authenticated with JWT, they're able to 
                        access this page and add new establishments to the API.
                    </>
                    }
                />
                <section className={styles.admin_section}>
                    <div className={styles.admin_form_container}>
                        <form className={styles.admin_form} onSubmit={handleSubmit(onSubmit)}>
                        {adminError && <span className="text-danger login-error">{adminError}</span>}
                        
                            <fieldset disabled={submitting}>
                                <div className="input-container">
                                    <label for="title">Title</label>
                                    <input type="text" {...register("title")} />
                                    {errors.title && <span>{errors.title.message}</span>}
                                </div>

                                <div className="input-container">
                                    <label for="content">Content</label>
                                    <textarea {...register("content")} />
                                    {errors.content && <span>{errors.content.message}</span>}
                                </div>

                                <div className="input-container">
                                <label for="status">Status</label>
                                    <select {...register("status")} >
                                        <option value="publish">Publish post</option>
                                        <option value="draft">Save as draft</option>
                                    </select>
                                    {errors.status && <span>{errors.status.message}</span>}
                                </div>

                                <div className="input-container">
                                    <label for="Price">Price</label>
                                    <input type="number" {...register("Price")} min="1000" placeholder='1000'/>
                                    {errors.Price && <span>{errors.Price.message}</span>}
                                </div>

                                <div className="input-container">
                                    <label for="Accomodation">Accomodation type</label>
                                    <select {...register("Accomodation")} >
                                        <option value="Hotel">Hotel</option>
                                        <option value="B&amp;b">B&amp;b</option>
                                        <option value="Guesthouse">Guesthouse</option>
                                    </select>
                                    {errors.Accomodation && <span>{errors.Accomodation.message}</span>}
                                </div>
                                <div className="input-container">
                                    <label for="Reviews">Reviews</label>
                                    <input type="number" {...register("Reviews")} />
                                    {errors.Reviews && <span>{errors.Reviews.message}</span>}
                                </div>

                                <div className="input-container">
                                    <label for="PostalCode">Postal code</label>
                                    <input type="number" {...register("PostalCode")} />
                                    {errors.PostalCode && <span>{errors.PostalCode.message}</span>}
                                </div>

                                <div className="input-container">
                                    <label for="Address">Address</label>
                                    <input type="text" {...register("Address")} />
                                    {errors.Address && <span>{errors.Address.message}</span>}
                                </div>

                                <button className="btn_primary" type="submit">
                                    {submitting ? "Submitting..." : "Add hotel"}
                                </button>
                            </fieldset>

                        </form>
                    </div>
                </section>
            </main>
        </>
    )
}

