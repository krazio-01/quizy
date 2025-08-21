import "./notFound.scss";

const Custom404 = () => {
    return (
        <div className="not-found">
            <h1 className="error-code">#404</h1>
            <h2 className="error-text">Oops! Page Not Found</h2>
            <p className="error-subtext">
                It looks like the page you&apos;re looking for has wandered off into the
                internet wilderness.
            </p>
        </div>
    );
};

export default Custom404;
