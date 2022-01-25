const Hero = ( {h1_text, lead_text} ) => {
    return(
        <header className="hero">
            <div className="container">
                <h1>{h1_text}</h1>
                <p className="lead">
                    {lead_text}
                </p>
            </div>
        </header>
    )
}

export default Hero;