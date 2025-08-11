export function HomePage() {
    const homeStyle = { textAlign: 'center' }
    const imgUrl = 'https://images.unsplash.com/photo-1530325553241-4f6e7690cf36?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'

    return (
        <section style={homeStyle}>
            <h2>Welcome To Toy Page!</h2>
            <img src={imgUrl} alt="Toy" />
        </section>
    )
}
