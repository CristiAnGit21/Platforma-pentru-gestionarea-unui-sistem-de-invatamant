import errorImage from '../assets/403.png';

const PageNotFound = () => {
    return (
        <div id="wrapper" style={styles.wrapper}>
            <img
                src={errorImage}
                alt="Page not found"
                style={styles.image}
            />
            <div id="info">
                <h3 style={styles.text}>This page could not be found</h3>
            </div>
        </div>
    );
};

const styles = {
    wrapper: {
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        textAlign: 'center' as const,
        padding: '20px'
    },
    image: {
        maxWidth: '100%',
        height: 'auto',
        marginBottom: '20px'
    },
    text: {
        fontSize: '1.5rem',
        color: '#333'
    }
};

export default PageNotFound;