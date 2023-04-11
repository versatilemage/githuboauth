import React from "react";
import Head from "next/head";

const SEO = ({title, description, image}) => {
    return (
        <Head>
            <title>{title}</title>
            <meta name="decription" content={description}/>
            <meta itemProp="name" content={title}/>
            <meta itemProp="image" content={image}/>
        </Head>
    )
};

SEO.defaultProps = {
    title: "Git-Hub Authentication",
    description: "Git-Hub Authentication using Git-Hub OAuth process",
    image: "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
}

export default SEO;
