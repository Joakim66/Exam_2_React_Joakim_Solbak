import Head from 'next/head'
import Link from 'next/link'

import Hero from '../components/layout/Hero'

import styles from '../styles/Home.module.css'

export const getStaticProps = async () => {
    const res = await fetch('https://jsolholidaze.wpengine.com/wp-json/wp/v2/hotel?per_page=25')
    const data = await res.json()

    return{
        props: { hotels: data }
    }
}

export default function Home( {hotels} ) {
    return (
        <>
            <Head>
                <title>Home | Next app for jsolholidaze.wpengine.com</title>
                <meta name="description" content="Home | Next app for jsolholidaze.wpengine.com" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main>
                <Hero
                    h1_text={
                        <>
                            Holidaze Next App
                        </>
                    }
                    lead_text={
                        <>
                            This is a Next.js app that uses <Link href="https://jsolholidaze.wpengine.com/wp-json/"><a>
                            the wordpress API</a></Link> generated from my <Link href="https://jsolholidaze.wpengine.com/"><a>previous project exam 2 submission.</a></Link> Here 
                            you can view a list of the hotels from the main site, you can also <Link href="/login"><a>login</a></Link> and 
                            create a new hotel establishment. 
                        </>
                    }
                />
                <section className={styles.hotelsList}>
                    <div className="container">
                        <h2>List of hotels</h2>
                        <ul className={styles.hotelsList_grid}>
                        {hotels.map(({id, better_featured_image, title, acf, link}) => (
                            <li key={id} className='box_shadow border_radius'>
                            <div className={styles.hotel_item_img}>
                                <img width="500" height="384"
                                /* C/O https://placeholder.com/ */
                                src={better_featured_image ? better_featured_image.media_details.sizes.medium_large.source_url : "https://via.placeholder.com/600/CC6D00/FFFFFF/?text=No%20image%20available" } 
                                alt={better_featured_image ? better_featured_image.alt_text : "No image available"} />
                            </div>
                            <div className={styles.hotel_item_info}>
                                <ul>
                                <h3>{title.rendered}</h3>
                                <li>
                                    <strong>Accomodation: </strong><p>{acf.accomodations_list}</p>
                                </li>
                                <li>
                                    <strong>Address: </strong><p>{acf.address}</p>
                                </li>
                                <li>
                                    <strong>Postal code: </strong><p>{acf.postal_code}</p>
                                </li>
                                <li>
                                    <strong>Price: </strong><p>{acf.price}</p>
                                </li>
                                <li>
                                    <strong>Reviews: </strong>
                                    <p>
                                    {!!acf.reviews ? acf.reviews : "No reviews"}
                                    </p>
                                </li>
                                
                                </ul>
                                <Link href={link}><a><button className="btn_primary">View details</button></a></Link>
                            </div>
                            </li>
                        ))}
                        </ul>
                    </div>
                </section>
            </main>
        </>
    )
}

